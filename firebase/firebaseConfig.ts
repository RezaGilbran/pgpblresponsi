// firebase/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBli9KJ19vZLWDrzTZBG4MiB5kDirUlWFM",
  authDomain: "sitours-35616.firebaseapp.com",
  projectId: "sitours-35616",
  storageBucket: "sitours-35616.appspot.com",
  messagingSenderId: "285591440440",
  appId: "1:285591440440:web:514e71f24f40d84d4baacd",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
