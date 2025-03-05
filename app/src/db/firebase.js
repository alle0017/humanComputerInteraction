import FBUser from "./firebase/user";
import FBBooks from "./firebase/books";
import FirebaseService from "./firebase/firebase-service";

FirebaseService.create();
FBBooks.new();

export { FBUser, FBBooks }