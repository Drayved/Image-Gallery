import { useState, useContext } from "react";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import app from '../../firebaseConfig';
import { collection, doc, setDoc } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { MyContext, MyContextValue } from '../App'

export default function Header() {
  const { selectedFolder, setSelectedFolder, newFolderName, setNewFolderName, availableFolders, setAvailableFolders, selectedFile, setSelectedFile } = useContext(MyContext);
  const [showMenu, setShowMenu] = useState(false);
  const [newUser, setNewUser] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signedIn, setSignedIn] = useState(false);

  function createUserFolderCollection() {
    const auth = getAuth(app);
    const user = auth.currentUser;

    if (!user) {
      console.error('No authenticated user found.');
      return;
    }

    const db = getFirestore(app);
    const usersCollectionRef = collection(db, "users");

    // Create a new user document with a unique ID
    const userDocumentRef = doc(usersCollectionRef);

    // Set the data for the user document (if needed)
    const userData = {
      username: email
    };

    // Create a folder collection within the user document
    const folderCollectionRef = collection(userDocumentRef, "folders");

    // Create a new folder document within the folder collection
    const folderDocumentRef = doc(folderCollectionRef);

    // Set the data for the folder document (if needed)
    const folderData = {
      folder: selectedFolder
    };

    // Create an image collection within the folder document
    const imageCollectionRef = collection(folderDocumentRef, "images");

    // Create a new image document within the image collection
    const imageDocumentRef = doc(imageCollectionRef);

    // Set the data for the image document
    const imageData = {
      url: selectedFile
    };

    // Write the user, folder, and image documents to the database
    Promise.all([
      setDoc(userDocumentRef, userData),
      setDoc(folderDocumentRef, folderData),
      setDoc(imageDocumentRef, imageData)
    ])
      .then(() => {
        console.log("User, folder, and image documents created successfully!");
      })
      .catch((error) => {
        console.error("Error creating documents:", error);
      });
  }

  function handleSignInMenu() {
    setShowMenu(!showMenu);
  }

  function handleNewUserMenu() {
    setNewUser(!newUser);
  }

  function handleSignIn() {
    setSignedIn(true);
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
        // Add any further logic you want to perform after sign-in

        createUserFolderCollection();
      })
        .catch((error) => {
          // An error occurred while signing in
          console.error('Error signing in:', error);
        });
        setSignedIn(true)
    }
    
      function signUpUser(email: string, password: string) {
        const auth = getAuth(app);
        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            // User signed up successfully
            const user = userCredential.user;
            console.log('User signed up:', user);
            // Add any further logic you want to perform after sign-up
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
              <button>Folders</button>
              {signedIn ?
                  <button className="sign-in-btn" onClick={handleSignInMenu}>Signed in as {email}</button>
                  :
                  <button className="sign-in-btn" onClick={handleSignInMenu}>Sign In</button>
              }

              <button>All images</button>
          </div>
          {showMenu && !signedIn ?       
              <div className="sign-in-container">
                  <h3>Email:</h3>
                  <input type="email" onChange={handleEmailChange}/>
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