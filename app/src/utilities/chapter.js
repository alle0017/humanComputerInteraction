import WebFS from "../db/webfs"
import { FBBooks } from "../db";

export const getAllEditable = async () => {
      /**
       * @type {WebFS<EditableBook>}
       */
      const db = await WebFS.create('editor');
      /**
       * @type {EditableBook[]}
       */
      const books = [];

      await db.forEach( b => books.push(b) );

      return books;
}

/**
 * @param {EditableBook} book 
 */
export const saveEditable = async book => {
      /**
       * @type {WebFS<EditableBook>}
       */
      const db = await WebFS.create('editor');

      db.writeFile( book.title, book );
}

/**
 * @param {EditableBook} book 
 */
export const loadChapterToDB = book => FBBooks.get().createBook( book );