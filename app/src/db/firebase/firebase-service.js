import { getFirestore, } from "firebase/firestore"
import { Database, getDatabase } from "firebase/database";
import {  initializeAuth } from "firebase/auth"
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

/**@import { Firestore } from "firebase/firestore"*/

export default class FirebaseService {
      /**
       * @type {Firestore}
       */
      static firestore;
      /**
       * @type {Database}
       */
      static realtimeDB;

      /**
       * @type {import("firebase/auth").Auth}
       */
      static auth;

      static create(){

            if( this.auth )
                  return;

            const firebaseConfig = {
                  // hehe 🤐
            };
            
            // Initialize Firebase
            const app = initializeApp(firebaseConfig);
            const analytics = getAnalytics(app);

            this.firestore = getFirestore( app );
            this.realtimeDB = getDatabase( app, 'https://card-exchange-2f6e1-default-rtdb.europe-west1.firebasedatabase.app/' );
            this.auth = initializeAuth( app );
      }

      /**
       * @protected
       */
      get auth(){
            return FirebaseService.auth;
      }

      /**
       * @protected
       */
      get realtimeDB(){
            return FirebaseService.realtimeDB;
      }

      /**
       * @protected
       */
      get firestore(){
            return FirebaseService.firestore;
      }
}