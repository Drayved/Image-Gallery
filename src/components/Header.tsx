import { useState } from "react"
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import app from '../../firebaseConfig';




export default function Header(){
    const [showMenu, setShowMenu] = useState(false)
    const [newUser, setNewUser] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [signedIn, setSignedIn] = useState(false)

    function handleSignInMenu(){
        setShowMenu(!showMenu)
    }

    function handleNewUserMenu(){
        setNewUser(!newUser)
    }

    function handleSignIn(){
        setSignedIn(true)
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
                <div className="signed-in-container">
                    <h3>Signed in as {email}</h3>
                    <button onClick={handleSignOut}>Sign out</button>
                </div>
        : ""}
        </div>
    )
}