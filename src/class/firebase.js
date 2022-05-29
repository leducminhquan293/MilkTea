// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDA9QpgT0poby-xR-NEFNjiqgGkC6XiECU",
  authDomain: "milktea-leducminhquan293.firebaseapp.com",
  projectId: "milktea-leducminhquan293",
  storageBucket: "milktea-leducminhquan293.appspot.com",
  messagingSenderId: "631796587041",
  appId: "1:631796587041:web:6dc89030859f4d0c17e160",
  measurementId: "G-9P9P97RWXS"
};

// Initialize Firebase
const FireBase = initializeApp(firebaseConfig);
const db = getFirestore(FireBase);

export default db;