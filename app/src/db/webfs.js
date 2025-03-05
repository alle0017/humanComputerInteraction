/**
 * use IndexedDB to create a virtualization of the filesystem
 * @template T
 */
export default class WebFS {
      /**
       * filePath is the unique key for each object
       */

      /**
       * @type {IDBDatabase}
       */
      #db;
      /**
       * @type {string}
       */
      #dbName;

      /**
       * @template T
       * @param {string} projectName 
       * @throws {Error} if the opening of the db fails
       * @returns {Promise<WebFS<T>>}
       */
      static async create( projectName ){
            const request = indexedDB.open( projectName, 1 )

            return new Promise((resolve, reject) => {
                  request.onerror = () => {
                        throw new Error("database opening failed")
                  }
                  request.onsuccess = () => {
                        const db = request.result;
      
                        resolve(new WebFS( db, projectName ));
                  }
                  request.onupgradeneeded = () => {
                        const db = request.result;
                        if( db.objectStoreNames.contains( projectName ) ) {
                              db.deleteObjectStore( projectName );
                        }
                        db.createObjectStore( projectName, {
                              // path to the file
                              keyPath: "filePath"
                        });
      
                        resolve(new WebFS( db, projectName ));
                  }
            })
      }
      /**
       * 
       * @param {IDBDatabase} db 
       * @param {string} dbName 
       */
      constructor( db, dbName ){
            this.#db = db;
            this.#dbName = dbName;
      }
      /**
       * 
       * @param {string} filePath 
       * @returns {Promise<T>}
       */
      async readFile( filePath ){
            const trans = this.#db.transaction([this.#dbName], "readonly");
            const store = trans.objectStore(this.#dbName);
            const request = store.get( filePath );

            return new Promise( (resolve,reject) => {
                  request.onsuccess = () => {
                        resolve( request.result? request.result.content: '' )
                  }
                  request.onerror = (e) => {
                        resolve(null);
                  }
            })
      }     
      /**
       * 
       * @param {string} filePath 
       * @param {T} content 
       */
      async writeFile( filePath, content ){
            const trans = this.#db.transaction( [ this.#dbName ], "readwrite");
            const store = trans.objectStore( this.#dbName );
            const request = store.put({
                  filePath,
                  content,
            });
            return new Promise( (resolve, reject) => {
                  request.onsuccess = resolve;
                  request.onerror = reject;
            })
      }

      /**
       * @param {string} filePath 
       */
      async deleteFile( filePath ){
            const trans = this.#db.transaction( [ this.#dbName ], "readwrite");
            const store = trans.objectStore( this.#dbName );
            const request = store.delete( filePath );
            return new Promise( (resolve, reject) => {
                  request.onsuccess = resolve;
                  request.onerror = reject;
            })
      }

      async clear(){
            const trans = this.#db.transaction( [ this.#dbName ], "readwrite");
            const store = trans.objectStore( this.#dbName );
            const request = store.clear();

            return new Promise( (resolve, reject) => {
                  request.onsuccess = resolve;
                  request.onerror = reject;
            })
      }

      /**
       * @param {(value: T, key: string) => void} f 
       */
      async forEach( f ){
            const trans = this.#db.transaction( [ this.#dbName ], "readonly");
            const store = trans.objectStore( this.#dbName );
            const request = store.openCursor();
            new Promise(( resolve, reject ) => {
                  request.onerror = reject
                  request.onsuccess = event => {
                        //@ts-ignore
                        const cursor = event.target.result;

                        if( cursor ){
                            f( cursor.value.content, cursor.primaryKey );
                            cursor.continue();
                        }
                        else {
                            resolve();
                        }
                  };   
            })
      }
}