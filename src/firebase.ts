// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyASqBm1n4c3_0eTpjr7E2uiGWfYus54VRk",
  authDomain: "room-booking-f648a.firebaseapp.com",
  databaseURL: "https://room-booking-f648a-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "room-booking-f648a",
  storageBucket: "room-booking-f648a.firebasestorage.app",
  messagingSenderId: "623347950770",
  appId: "1:623347950770:web:4224a3ff61f177d77d95ab",
  measurementId: "G-WCW1V1KWDZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore(app);