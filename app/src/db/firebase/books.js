import { Firestore, Timestamp, collection, getDocs, where, and, query, limit, updateDoc, orderBy, addDoc, } from "firebase/firestore"
import { get, set, ref as fbRef, } from "firebase/database";
import FirebaseService from "./firebase-service";
import WebFS from "../webfs";
import FBUser from "./user";

import { ref } from "vue";



export default class FBBooks extends FirebaseService {
      /**
       * @type {FBBooks}
       */
      static #instance;

      static async new(){
            if( !this.#instance ){
                  const books = await WebFS.create( 'books' );
                  const progress = await WebFS.create( 'progress' );
                  const reviews = await WebFS.create( 'reviews' );
                  const market = await WebFS.create( 'market' );

                  this.#instance = new FBBooks();
                  this.#instance.#bookDB = books;
                  this.#instance.#progressDB = progress;
                  this.#instance.#reviewsDB = reviews;
                  this.#instance.#marketDB = market;
            }

            return this.#instance;
      }

      /**
       * @type {Firestore}
       */
      #db;

      /**
       * @type {WebFS<Book>}
       */
      #bookDB;

      /**
       * @type {WebFS<Book>}
       */
      #marketDB;

      /**
       * @type {WebFS<BookProgress>}
       */
      #progressDB
      /**
       * @type {WebFS<Review[]>}
       */
      #reviewsDB

      /**
       * @type {Book[]}
       */
      #toBuyBooks = [];


      static get(){
            if( !this.#instance )
                  throw new Error('to fix!')
            return this.#instance;
      }

      constructor(){
            super();

            this.#db = this.firestore;
      }


      /**
       * @param {string} title 
       * @returns {Promise<StoredBookProgress>}
       */
      async #getPersonalDataFromDB( title ){
            const res = await get( fbRef( this.realtimeDB, `users/${this.auth.currentUser.uid}/${title}/` ));

            if( res.exists() ){
                  return res.val();
            }
            if( FBUser.get().get().value.books.indexOf( title ) >= 0 ){
                  set( fbRef( this.realtimeDB, `users/${this.auth.currentUser.uid}/books/${title}/` ), {
                        like: false,
                        chapter: 0,
                        hourPassed: 0,
                  });
            }
            return {
                  like: false,
                  chapter: 0,
                  hourPassed: 0,
            }
      }


      /**
       * @param {string} title
       */
      async getBookFromTitle( title ){
            const localRes = await this.#bookDB.readFile( title );

            if( localRes ){
                  return localRes;
            }

            const book = /**@type {Book}*/((
                  await getDocs( 
                        query( 
                              collection(this.#db, 'books'), 
                              where( 'title', '==', title ) 
                        ) )
            ).docs[0].data());
            this.#bookDB.writeFile( title, book );

            return book;
      }

      /**
       * @param {string} title 
       * @param {number} lastChapterRead 
       * @param {number} deltaHourPassed
       */
      async savePersonalDataAndGet( title, lastChapterRead, deltaHourPassed = 0 ){

            const local = await this.#progressDB.readFile( title );

            if( local && lastChapterRead < local.chapter ){
                  local.hourPassed += deltaHourPassed;
                  this.#progressDB.writeFile( title , local );
                  return local.text;
            }
            

            const res = local? local: await this.#getPersonalDataFromDB( title );
            const firstChapter = res.chapter;
            const baseText = local? local.text: '';

            const text = baseText + (
                  await getDocs( 
                        query( 
                              collection(this.#db, 'chapters'), 
                              and( 
                                    where( 'title', '==', title ),
                                    where( 'chapter', '>', firstChapter ),
                                    where( 'chapter', '<=', lastChapterRead ),
                              )
                        ))
            )
            .docs
            .map( doc => `<h2><center>${doc.data().chapter}</center></h2> <br/> ${doc.data().text}` )
            .join('<br/>');

            this.#progressDB.writeFile( title , {
                  text,
                  chapter: lastChapterRead,
                  hourPassed: res.hourPassed + deltaHourPassed,
            });

            set( fbRef( this.realtimeDB, `users/${this.auth.currentUser.uid}/books/${title}/hourPassed/` ), res.hourPassed + deltaHourPassed );
            set( fbRef( this.realtimeDB, `users/${this.auth.currentUser.uid}/books/${title}/chapter/` ), lastChapterRead );

      
            return text;
      }   

      /**
       * @param {string} title 
       */
      async getReviewsForBook( title ){
            const localRes = await this.#reviewsDB.readFile( title );

            if( localRes ){
                  return localRes;
            }

            const reviews = /**@type {Review[]}*/(((
                  await getDocs( 
                        query( 
                              collection(this.#db, 'reviews'), 
                              where( 'title', '==', title ),
                              limit(20) 
                        ) )
            ).docs || []).flatMap( doc => doc.data().reviews ));

            this.#reviewsDB.writeFile( title, reviews );

            return reviews;
      }

      async getNotBoughtBooks(){

            if( this.#toBuyBooks.length > 0 )
                  return this.#toBuyBooks;

            const latest = localStorage.getItem('market::latest') || new Date(0,0,0).toISOString();
            const ts = Timestamp.fromDate( new Date(latest) );

            this.#toBuyBooks = [];

            await this.#marketDB.forEach( v => this.#toBuyBooks.push( v ) );
            const titles = FBUser
                                    .get()
                                    .get()
                                    .value
                                    .books;
            try{
                  const res = /**@type {Array<Book & { date: Timestamp }>}*/(((await getDocs( 
                        titles.length > 0 ? query( 
                              collection( this.#db, 'books' ), 
                              where( 'date', '>', ts ),
                              where( 'title', 'not-in', titles ), 
                              limit( 50 ),
                              orderBy('date', 'asc'),
                        ) : query( 
                              collection( this.#db, 'books' ), 
                              where( 'date', '>', ts ),
                              limit( 50 ),
                              orderBy('date', 'asc'),
                        )
                  )).docs || []).map( doc => doc.data() ));

                  if( res.length ){
                        localStorage
                        .setItem( 
                              'market::latest', 
                              res.at(-1).date.toDate().toISOString() 
                        );
                        this.#toBuyBooks.concat( res );
                        res.forEach( v => this.#marketDB.writeFile( v.title, v ) );
                  }
            }catch(e){
                  console.error(e)
            }

            return this.#toBuyBooks;
      }

      /**
       * @param {EditableBook} book 
       */
      async createBook( book ){
            try {
                  const user = FBUser.get().get().value;
                  
                  await set( fbRef( this.realtimeDB, `users/${this.auth.currentUser.uid}/books/${book.title}/` ), {
                        like: false,
                        chapter: 0,
                        hourPassed: 0,
                  });

                  (await WebFS.create('books')).writeFile( book.title, {
                        title: book.title.toLowerCase(),
                        img: book.img || 'https://bookstoreromanceday.org/wp-content/uploads/2020/08/book-cover-placeholder.png',
                        author: user.name,
                        cost: book.cost,
                        chapter: book.chapters.length,
                        tags: book.tags,
                  });

                  localStorage.setItem('user', JSON.stringify(user));

                  await addDoc( collection( this.#db, 'books'), {
                        title: book.title.toLowerCase(),
                        img: book.img || 'https://bookstoreromanceday.org/wp-content/uploads/2020/08/book-cover-placeholder.png',
                        author: user.name,
                        cost: book.cost,
                        chapter: book.chapters.length,
                        tags: book.tags,
                  });

                  for( let i = 0; i < book.chapters.length; i++ ){
                        await addDoc( collection( this.#db, 'chapters'), {
                              title: book.title.toLowerCase(),
                              chapter: i + 1,
                              text: book.chapters[i],
                        });
                  }
            }catch(e){
                  throw e;
            }
      }
}