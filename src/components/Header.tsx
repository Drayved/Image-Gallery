import { useState, useEffect, useContext } from "react";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import app from '../../firebaseConfig';
import { collection, doc, setDoc, getDocs } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { getStorage, ref, uploadString, getDownloadURL, uploadBytes } from "firebase/storage";
import { MyContext }  from '../App'
import { Link } from 'react-router-dom'

export default function Header() {
  // const { selectedFolder, setSelectedFolder, newFolderName, setNewFolderName, availableFolders, setAvailableFolders, selectedFile, setSelectedFile } = useContext(MyContext);
  const [showMenu, setShowMenu] = useState(false);
  const [newUser, setNewUser] = useState(false);
  const {email, setEmail} = useContext(MyContext)
  const [password, setPassword] = useState("");
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    const auth = getAuth(app);
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setSignedIn(true);
        setEmail(user.email);
      } else {
        setSignedIn(false);
        setEmail("");
      }
    });
  }, []);

  async function createUserFolderCollection() {
    const auth = getAuth(app);
    const user = auth.currentUser;
    
  
    if (!user) {
      console.error('No authenticated user found. ');
      return;
    }
    const userId = user.uid
  //   const db = getFirestore(app);
  //   const usersCollectionRef = collection(db, 'users');
  
  //   const userDocumentRef = doc(usersCollectionRef, userId);
  
  //   const folderCollectionRef = collection(userDocumentRef, 'folders');
  
  //   // Check if the folder already exists
  //   const folderQuerySnapshot = await getDocs(folderCollectionRef);
  //   if (!folderQuerySnapshot.empty) {
  //     console.log('Folders already exist for the user. Skipping folder creation.');
  //     return;
  //   }
  
  //   // Create a new folder document within the folder collection
  //   const folderDocumentRef = doc(folderCollectionRef, "default");
  
  //   // Set the data for the folder document (if needed)
  //   const folderData = {
  //     folder: 'default'
  //   };
  
  //     // Write the folder document to the database
  // try {
  //   await setDoc(folderDocumentRef, folderData);
  //   console.log('Folder document created successfully!');
  // } catch (error) {
  //   console.error('Error creating folder document:', error);
  // }

  const storage = getStorage(app);
  const userFolderRef = ref(storage, `users/${userId}/`);
  const dummyFileRef = ref(userFolderRef, 'dummy.txt');
  await uploadString(dummyFileRef, 'Dummy content');
  console.log('User-specific folder created successfully!');
}

  function handleSignInMenu() {
    setShowMenu(!showMenu);
  }

  function handleNewUserMenu() {
    setNewUser(!newUser);
  }

  function handleEmailChange(event: React.ChangeEvent<HTMLInputElement>) {
    setEmail(event.target.value);
  }

  function handlePasswordChange(event: React.ChangeEvent<HTMLInputElement>) {
    setPassword(event.target.value);
  }

  function signInUser(email: string, password: string) {
    const auth = getAuth(app);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // User signed in successfully
        const user = userCredential.user;
        console.log('User signed in:', user);
        console.log(auth.currentUser)
        // Add any further logic you want to perform after sign-in
        createUserFolderCollection()
        setSignedIn(true)
      })
        .catch((error) => {
          // An error occurred while signing in
          console.error('Error signing in:', error);
        });
        
        
    }
    
  function signUpUser(email: string, password: string) {
    const auth = getAuth(app);
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // User signed up successfully
        const user = userCredential.user;
        console.log('User signed up:', user);
        // Add any further logic you want to perform after sign-up
        createUserFolderCollection()
      })
      .catch((error) => {
        // An error occurred while signing up
        console.error('Error signing up:', error);
      });
      setSignedIn(true)
  }

  async function handleSignOut() {
    const auth = getAuth()
    try {
      await signOut(auth)
      setSignedIn(false)
      console.log("User signed out!")
    } catch (error) {
      console.log("Error signing out:", error)
    }
  }

    return(
      <div className="title-container">
          <h1 className="title">Image Uploader</h1>
          <h3 className="sub-title">Upload your images and keep them in 1 place</h3>
          <div className="image-btns">
              <button><Link to="/folders">Folders</Link></button>
              {signedIn ?
                  <button className="sign-in-btn" onClick={handleSignInMenu}>Signed in as {email}</button>
                  :
                  <button className="sign-in-btn" onClick={handleSignInMenu}>Sign In</button>
              }

              <button><Link to="all-images">All images</Link></button>
          </div>
          {showMenu && !signedIn ?       
              <div className="sign-in-container">
                  <h3>Email:</h3>
                  <input className="text-black" type="email" onChange={handleEmailChange}/>
                  <h3>Password:</h3>
                  <input type="password" onChange={handlePasswordChange}/>
                  <div >
                      {newUser ? 
                          <div className="sign-in-btns">
                              <button onClick={() => signUpUser(email, password)}>Sign Up</button>
                              <button onClick={handleNewUserMenu}>Existing account? Login</button>
                          </div>
                          :
                          <div className="sign-in-btns">
                              <button onClick={() => signInUser(email, password)}>Sign In</button>
                              <button onClick={handleNewUserMenu}>New user? Sign up</button>
                          </div>
                      }
                  </div>   
              </div>
          : showMenu && signedIn ? 
              <div className="sign-in-container">
                  <h3>Signed in as {email}</h3>
                  <button onClick={handleSignOut}>Sign out</button>
              </div>
      : ""}
      </div>
    )
}