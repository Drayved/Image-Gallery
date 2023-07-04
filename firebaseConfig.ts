// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC-JwRpZg_BNLPkwZV3rhG3WfKg4-PXHvk",
  authDomain: "image-uploader-a5dba.firebaseapp.com",
  databaseURL: "https://image-uploader-a5dba-default-rtdb.firebaseio.com",
  projectId: "image-uploader-a5dba",
  storageBucket: "image-uploader-a5dba.appspot.com",
  messagingSenderId: "724312811914",
  appId: "1:724312811914:web:bd2600a1459d9cb1178073",
  measurementId: "G-2TGWWF1F8B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app