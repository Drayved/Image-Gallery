import firebase, { initializeApp } from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import app from './firebaseConfig';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, setDoc, doc } from 'firebase/firestore';



const auth = getAuth(app);

createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // User created successfully
    const user = userCredential.user;
    console.log('User created:', user);
    // Save user data to Firestore or perform any other operations
    const db = getFirestore(app);
    setDoc(doc(db, 'users', user.uid), {
      name: 'John Doe',
      email: user.email,
    })
      .then(() => {
        console.log('User data saved to Firestore');
      })
      .catch((error) => {
        console.error('Error saving user data:', error);
      });
  })
  .catch((error) => {
    // An error occurred while creating the user
    console.error('Error creating user:', error);
  });