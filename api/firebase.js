import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyB0WZSTBU9T4zgl3zWUsPs6ZX0MwogSe0Q",
  authDomain: "react-learning-74d0b.firebaseapp.com",
  projectId: "react-learning-74d0b",
  storageBucket: "react-learning-74d0b.appspot.com",
  messagingSenderId: "634017430920",
  appId: "1:634017430920:web:2fa2c6df36930abb038e3d"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const tenziesLeaderboard = collection(db, "tenzies")