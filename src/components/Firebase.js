// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyAuveUYXNTmSERRI-43IxAkiD4lr6izOLo",
  authDomain: "cost-tracker-9e227.firebaseapp.com",
  projectId: "cost-tracker-9e227",
  storageBucket: "cost-tracker-9e227.appspot.com",
  messagingSenderId: "512914703944",
  appId: "1:512914703944:web:6cab444897aeb37106ba7d",
  measurementId: "G-NCXTPNDRVJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const storage = getStorage(app);
const db = getFirestore(app);
export {app, db, storage}