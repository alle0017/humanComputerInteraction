
import { computedAsync } from "@vueuse/core";
import { FBBooks, FBUser } from "./firebase";



import { Marks, Paths } from "../test.config"
/**
 * @param {number} pathLen 
 */
export const addResult = (pathLen, end = true) => FBUser.get().endSession( pathLen, end )
/**
 * @param {string} book 
 * @returns {Promise<BookProgress>}
 */
export const getBookUserData = book => FBUser.get().getProgress( book )
export const getLikedBooks = () => computedAsync( () =>{ 
      const db = FBBooks.get();
      const res = FBUser.get().get().value.likedBooks.map( async book => await db.getBookFromTitle( book ) );
      return Promise.all( res );
}, [] )
export const getAllUserBooks = () => computedAsync(() =>{ 
      const db = FBBooks.get();
      const res = FBUser.get().get().value.books.map( async book => await db.getBookFromTitle( book ) );
      return Promise.all( res );
}, [] )
/**
 * 
 * @param {string[]} tags 
 * @returns 
 */
export const getBookWithTags = tags => {
      const db = FBBooks.get();
      const res = FBUser
            .get()
            .get()
            .value
            .books
            .map( async book => await db.getBookFromTitle( book ) )
            .filter( async v =>{
                  const t = (await v).tags; 
                  return tags.some( tag => t.includes( tag ) );
            });
      return Promise.all( res );
}
/**
 * @param {string[]} titles
 * @returns 
 */                 
export const getBooksFromTitle = titles => { 
      const db = FBBooks.get();
      return Promise.all( titles.map( t => db.getBookFromTitle( t ) ) );
};
     
export const getMarketBooks = async () =>{
      const res = await FBBooks.get().getNotBoughtBooks();
      return res;
};

/**
 * 
 * @param {string} title 
 * @param {number} price 
 * @returns 
 */
export const buyBook = async ( title, price ) => await FBUser.get().buyBook( title, price );

/**
 * @param {string} title 
 * @returns {Promise<Review[]>}
 */
export const getReviewForBook = title => FBBooks.get().getReviewsForBook( title )

export const useUserData = () => FBUser.get().get();

export const getMarks = () => Marks;
/**
 * @returns {DefaultPath[]}
 */
export const getDefaultPaths = () => Paths;

/**
 * @param {string} title 
 * @param {number} lastChapterRead 
 * @param {number} deltaHourPassed
 */
export const saveProgressAndRetrieve = ( title, lastChapterRead, deltaHourPassed = 0 ) => FBBooks.get().savePersonalDataAndGet( title, lastChapterRead, deltaHourPassed ); 

export { FBUser, FBBooks }
