import { ChangeEvent, useState, useEffect, useContext } from 'react';
import { getFirestore, collection, addDoc, getDocs, query, where, doc, onSnapshot, setDoc, updateDoc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import firebaseConfig from '../../firebaseConfig';
import { getStorage, ref, uploadBytes, getDownloadURL, UploadTaskSnapshot, uploadString } from 'firebase/storage';
import { MyContext, MyContextValue }  from '../App'
import app from '../../firebaseConfig';





export default function Uploader() {
  
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const [imageURL, setImageURL] = useState<string | null>(null);
 
  const [showModal, setShowModal] = useState<boolean>(false);
  // Replace with your available folder names
  const { selectedFolder, setSelectedFolder, newFolderName, setNewFolderName, availableFolders, setAvailableFolders, selectedFile, setSelectedFile } = useContext(MyContext);
  
  const auth = getAuth(app);
  const user = auth.currentUser;
  const userId = user ? user.uid : "";

  useEffect(() => {
    if(user){
      const fetchFolders = async () => {
        try {
          const db = getFirestore();
          const foldersCollectionRef = collection(db, 'users', userId, 'folders');
          
          const unsubscribe = onSnapshot(foldersCollectionRef, (snapshot) => {
            const foldersData = snapshot.docs.map((doc) => doc.data().name);
            setAvailableFolders(['default', ...foldersData]);
            console.log('foldersData:', foldersData);
          });
  
          return () => unsubscribe();
        } catch (error) {
          console.error('Error fetching folders:', error);
        }
      };
  
      fetchFolders();
    }
    
  }, [userId, setAvailableFolders, user]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0){
        const file = event.target.files;
        setSelectedFile(file);
        setPreviewURL(URL.createObjectURL(file[0]));
        setSelectedFolder('default')
        setImageURL(null)
    }
    
  };

  const handleSaveImage = async () => {
    if (selectedFile && selectedFolder) {
      try {

  
        if (!user) {
          console.error('No authenticated user found.');
          return;
        }
  
        const db = getFirestore(app);
        const userId = user.uid;
        const folderCollectionRef = collection(db, 'users', userId, 'folders');
        const folderDocRef = doc(folderCollectionRef, selectedFolder);
        const folderSnap = await getDoc(folderDocRef);

        console.log('selectedFolder:', selectedFolder);
        console.log('folderSnap.exists():', folderSnap.exists());
  
  
        if (!folderSnap.exists()) {
          console.error('Selected folder does not exist.');
          return;
        }
  
        const imageCollectionRef = collection(folderDocRef, 'images');
        const file = selectedFile[0];
  
        const newImage = {
          name: file.name,
          url: '', // Placeholder for the actual URL
        };
  
        const imageDocRef = await addDoc(imageCollectionRef, newImage);

        const reader = new FileReader();
        reader.onload = async () => {
        const fileDataUrl = reader.result as string;

  
        const storagePath = `users/${userId}/folders/${selectedFolder}/images/${imageDocRef.id}`;
        const storageRef = ref(getStorage(app), storagePath);
        await uploadString(storageRef, fileDataUrl, 'data_url');
  
        const imageURL = await getDownloadURL(storageRef);
  
        await updateDoc(imageDocRef, { url: imageURL });
        
        console.log('Image saved.', imageURL);
        }
      } catch (error) {
        console.error('Error saving image:', error);
      }
    }
  };
  
  const handleCreateFolder = async () => {
    if (newFolderName) {
      try {

  
        if (!user) {
          console.error('No authenticated user found.');
          return;
        }

        if(user){
          const db = getFirestore(app);
        
          const folderCollectionRef = collection(db, 'users', userId, 'folders');
          const folderDocRef = doc(folderCollectionRef, newFolderName);

          const folderSnap = await getDoc(folderDocRef);
          if (folderSnap.exists()) {
            console.error('Folder already exists.');
            return;
          }
    
          const newFolder = {
            name: newFolderName,
          };
    
          await setDoc(folderDocRef, newFolder);
          setAvailableFolders((prevFolders: string[]) => [...prevFolders, newFolderName]);
          setSelectedFolder(newFolderName);
          setShowModal(false);
          console.log('Folder created.');
        }
  
      
      } catch (error) {
        console.error('Error creating folder:', error);
      }
    }
  };

  const handleOpenModal = () => {
    setShowModal(true);
    if (!selectedFolder) {
      setSelectedFolder(availableFolders[0]);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedFolder(null)
  };

  return (
    <div className="uploader-container">
      <div>
        <input type="file" onChange={handleFileChange} />
      </div>

      {previewURL && (
        <div className="preview-image-container">
          <h2>Selected Image:</h2>
          <img className="uploaded-images" src={previewURL} alt="Selected" />
          <div className='img-btns'>
            <button onClick={handleOpenModal}>Select Folder</button>
            <button onClick={handleSaveImage}>Save image</button>
          </div>


          {showModal && (
            <div className="modal">
              <div className="modal-content">
              <h3>Select a Folder</h3>
                <select value={selectedFolder ?? ""} onChange={(e) => setSelectedFolder(e.target.value)}>
                  {availableFolders.map((folder, index) => (
                    <option key={index}  value={folder}>
                      {folder}
                    </option>
                  ))}
                </select>
                <div className='new-folder-container'>
                  <label className='new-folder-text' htmlFor="newFolderInput">New Folder:</label>
                  <input
                    type="text"
                    id="newFolderInput"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                  />
                  <button className='create-folder-btn' onClick={handleCreateFolder}>Create Folder</button>
                </div>
                <button onClick={handleCloseModal}>Close</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}








