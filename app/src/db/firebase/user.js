import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth"
import { get, set, ref as fbRef, Database, getDatabase } from "firebase/database";
import FirebaseService from "./firebase-service";
import WebFS from "../webfs";
import { collection, getDocs, where, and, query } from "firebase/firestore"


import { ref } from "vue";
/**@import { Ref } from "vue";*/
/**@import { Auth, User as AuthUser } from "firebase/auth";*/



export default class FBUser extends FirebaseService {
      /**
       * @type {FBUser}
       */
      static #instance;

      static get(){
            if( !this.#instance )
                  this.#instance = new FBUser();
            return this.#instance;
      }

      /**
       * @readonly
       * @type {Auth}
       */
      #auth;

      /**
       * @readonly
       * @type {Database}
       */
      #db;

      /**
       * @type {AuthUser}
       */
      #user;

      /**
       * @type {Ref<User>}
       */
      #data;

      constructor(){

            super();

            this.#auth = this.auth;
            this.#db = this.realtimeDB;
            
            this.#auth.onAuthStateChanged( user => {
                  this.#user = user;
            });
            this.#data = ref({
                  name: '',
                  exp: 0,
                  lvl: 0,
                  coins: 0,
                  likedBooks: [],
                  books: []
            });
      }

      /**
       * 
       * @param {string} title 
       * @param {number} chapter 
       */
      async #getText( title, chapter ){
            return (await getDocs( 
                  query( 
                        collection(this.firestore, 'chapters'), 
                        and( 
                              where( 'title', '==', title ),
                              where( 'chapter', '<=', chapter ),
                        )
                  )
            )).docs
            .map( doc => `<h2><center>${doc.data().chapter}</center></h2> <br/> ${doc.data().text}` )
            .join('<br/>')
      }

      async #getData(){
            const user = localStorage.getItem('user');
            

            if( user ){
                  this.#data.value = JSON.parse( user );
                  return this;
            }

            /**
             * @type {WebFS<BookProgress>}
             */
            const progress = await WebFS.create( 'progress' );
            

            try{
                  const req = await get( fbRef( this.#db, `users/${this.#user.uid}/` ) );

                  if( req.exists() ){
                        /**
                         * @type {StoredUser}
                         */
                        const user = req.val();
                        const books = [];
                        const likedBooks = [];
                        const storedBooks = Object.entries( user.books || {} );

                        for( let i = 0; i < storedBooks.length; i++ ){
                              books.push( storedBooks[i][0] );

                              if( storedBooks[i][1].like )
                                    likedBooks.push( storedBooks[i][0] );

                              progress.writeFile( storedBooks[i][0], {
                                    chapter: storedBooks[i][1].chapter,
                                    hourPassed: storedBooks[i][1].hourPassed,
                                    text: await this.#getText( storedBooks[i][0], storedBooks[i][1].chapter )
                              })
                        }

                        this.#data.value = {
                              ...user,
                              likedBooks,
                              books,
                        }

                        localStorage.setItem('user', JSON.stringify( this.#data.value ) );
                  }else{
                        throw new Error('no data available')
                  }
            }catch(e){
                  throw e;
            }
            return this;
      }

      /**
       * @param {string} email 
       * @param {string} password 
       */
      async login( email, password ){
            if( this.#user )
                  throw new Error('you must log out first');

            try{
                  const cred = await signInWithEmailAndPassword( this.#auth, email, password );
                  this.#user = cred.user;
                  await this.#getData();
            }catch(e){
                  throw e;
            }

            return this;
      }

      async logout(){
            if( !this.#user )
                  throw new Error('you must log in first');

            try{
                  await signOut( this.#auth );
                  this.#user = null;
                  localStorage.removeItem('user');
                  await (await WebFS.create('progress')).clear()
                  this.#data.value = {
                        name: '',
                        exp: 0,
                        lvl: 0,
                        coins: 0,
                        likedBooks: [],
                        books: []
                  };
            }catch(e){
                  throw e;
            }

            return this;
      }

      /**
       * @param {string} name 
       * @param {string} email 
       * @param {string} password 
       */
      async createAccount( name, email, password ){
            if( this.#user )
                  throw new Error('you must log out first');

            try{
                  const cred = await createUserWithEmailAndPassword( this.#auth, email, password );
                  this.#user = cred.user;

                  this.#data.value = {
                        name,
                        exp: 0,
                        lvl: 0,
                        coins: 0,
                        likedBooks: [],
                        books: []
                  };
                  localStorage.setItem('user', JSON.stringify(this.#data.value));

                  try{
                        await set( fbRef( this.#db, `users/${this.#user.uid}/` ),{
                              name,
                              exp: 0,
                              lvl: 0,
                              coins: 0,
                              books: {},
                        });
                  }catch(e){
                        throw e;
                  }
            }catch(e){
                  throw e;
            }

            return this;
      }

      /**
       * @param {number} pathLen
       */
      async endSession( pathLen, end = true ){
            this.#data.value.exp += pathLen;

            if( this.#data.value.exp >= this.#data.value.lvl + 5 ){
                  this.#data.value.lvl++;
                  this.#data.value.exp -= this.#data.value.lvl + 5;

                  try{
                        await set( fbRef( this.#db, `users/${this.#user.uid}/lvl/` ), this.#data.value.lvl );
                  }catch(e){
                        throw e;
                  }
            }

            this.#data.value.coins += pathLen + (end? 10: 0);
            localStorage.setItem('user', JSON.stringify(this.#data.value));

            try{
                  await set( fbRef( this.#db, `users/${this.#user.uid}/exp/` ), this.#data.value.exp );
                  await set( fbRef( this.#db, `users/${this.#user.uid}/coins/` ), this.#data.value.coins );
            }catch(e){
                  throw e;
            }

            return this;
      }

      get(){
            return this.#data;
      }

      /**
       * @param {string} title 
       */
      async addLikeToBook( title ){
            if( this.#data.value.books.indexOf( title ) < 0 )
                  throw new Error('you must add the book first');

            if( this.#data.value.likedBooks.indexOf( title ) >= 0 )
                  return;

            try{
                  this.#data.value.likedBooks.push( title );
                  await set( fbRef( this.#db, `users/${this.#user.uid}/books/${title}/like/` ), true );
            }catch(e){
                  throw e;
            }
      }

      /**
       * @param {number} number 
       */
      async addCoins( number ){
            this.#data.value.coins += number;
            await set( fbRef( this.#db, `users/${this.#user.uid}/coins/` ), this.#data.value.coins );
      }

      /**
       * @param {string} title 
       * @param {number} price 
       */
      async buyBook( title, price ){

            if( this.#data.value.books.indexOf( title ) >= 0 )
                 return false;

            if( this.#data.value.coins < price )
                  return false;
            
            const bookDB = await WebFS.create( 'books' );
            const marketDB = await WebFS.create( 'market' );


            this.#data.value.books.push( title );
            this.#data.value.coins -= price;
            
            try {
                  await set( fbRef( this.#db, `users/${this.#user.uid}/coins/` ), this.#data.value.coins );
                  await set( fbRef( this.#db, `users/${this.#user.uid}/books/${title}/` ), {
                        like: false,
                        chapter: 0,
                        hourPassed: 0,
                  });
                  const book = await marketDB.readFile( title );

                  await marketDB.deleteFile( title );

                  bookDB.writeFile( title, book );
                  localStorage.setItem('user', JSON.stringify(this.#data.value));
            }catch(e){
                  throw e;
            }

            return true;
      }

      /**
       * @param {string} title
       */
      async getProgress( title ){
            /**
             * @type {WebFS<BookProgress>}
             */
            const progress = await WebFS.create( 'progress' );
            const book = await progress.readFile( title );

            if( book ){
                  return book;
            }

            const req = await get( fbRef( this.#db, `users/${this.#user.uid}/books/${title}/` ) );

            if( req.exists() ){
                  const text = await this.#getText( title, req.val().chapter );

                  progress.writeFile( title,{
                        chapter: req.val().chapter,
                        hourPassed: req.val().hourPassed,
                        text,
                  });
                  return /**@type {BookProgress}*/({
                        chapter: req.val().chapter,
                        hourPassed: req.val().hourPassed,
                        text,
                  })
            }

            const text = await this.#getText( title, 1 );

            await set( fbRef( this.#db, `users/${this.#user.uid}/books/${title}/` ), {
                  chapter: 1,
                  hourPassed: 0,
                  like: false,
            });
            progress.writeFile( title,{
                  chapter: 1,
                  hourPassed: 0,
                  text,
            });

            return {
                  chapter: 1,
                  hourPassed: 0,
                  text,
            };
      }
}