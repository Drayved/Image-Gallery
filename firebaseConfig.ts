// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage"
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCZzE2lVR3tWgqHyzLUmEPY7z76OVciKwQ",
  authDomain: "image-uploader-498ec.firebaseapp.com",
  projectId: "image-uploader-498ec",
  storageBucket: "image-uploader-498ec.appspot.com",
  messagingSenderId: "550260757314",
  appId: "1:550260757314:web:2d55c16e230b7fa5c9aedb",
  measurementId: "G-1W006FEP7W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const storage = getStorage(app)

export default app