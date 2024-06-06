import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyCl6Hau-W2qLasIRwCeHqvvSwRrhKPFc1E",
    authDomain: "car-ecommerce-8552a.firebaseapp.com",
    projectId: "car-ecommerce-8552a",
    storageBucket: "car-ecommerce-8552a.appspot.com",
    messagingSenderId: "178788093433",
    appId: "1:178788093433:web:27d439b2a1acef3b358128",
    measurementId: "G-7LZEE4964J"
  };

// const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
// };

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { firestore, storage, auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut };


