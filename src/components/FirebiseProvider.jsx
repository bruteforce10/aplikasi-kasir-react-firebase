import { useAuthState } from "react-firebase-hooks/auth";
import { createContext, useContext } from "react";
// import firebaseConfig from "../config/Firebase";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import app from "../config/Firebase";
import { getStorage } from "firebase/storage";

const FirbaseContext = createContext();
const auth = getAuth(app);
const db = getFirestore(app);
const docRef = doc(db, `toko/identitas`);
const storage = getStorage(app);

export function useFirebase() {
  return useContext(FirbaseContext);
}

const FirebaseProvider = (props) => {
  const [user, loading, error] = useAuthState(auth);
  const state = { user, loading, error, auth, db, docRef, storage };

  return (
    <FirbaseContext.Provider value={{ state }}>
      {props.children}
    </FirbaseContext.Provider>
  );
};

export default FirebaseProvider;
