import { FirebaseAuthentication } from "@capacitor-firebase/authentication";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth";

class FirebaseAuth {
  signInWithGoogle = async () => {
    // 1. Create credentials on the native layer
    const result = await FirebaseAuthentication.signInWithGoogle();
    // 2. Sign in on the web layer using the id token
    const credential = GoogleAuthProvider.credential(
      result.credential?.idToken
    );
    const auth = getAuth();
    return await signInWithCredential(auth, credential);
  };

  getCurrentUser = async () => {
    const result = await FirebaseAuthentication.getCurrentUser();
    return result.user;
  };

  getIdToken = async () => {
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      return;
    }
    const result = await FirebaseAuthentication.getIdToken();
    return result.token;
  };
}

const firebaseAuth = new FirebaseAuth();
export default firebaseAuth;
