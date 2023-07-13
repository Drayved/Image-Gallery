import { ChangeEvent, useState, useEffect, useContext } from 'react';
import {
  getFirestore,
  collection,
  onSnapshot,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

import {
  getStorage,
  ref,
  getDownloadURL,
  uploadString,
} from 'firebase/storage';
import { MyContext } from '../App';
import app from '../../firebaseConfig';

export default function Uploader() {
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const [imageURL, setImageURL] = useState<string | null>(null);

  const [showModal, setShowModal] = useState<boolean>(false);
  const {
    selectedFolder,
    setSelectedFolder,
    newFolderName,
    setNewFolderName,
    availableFolders,
    setAvailableFolders,
    setSelectedFile,
    selectedFile
  } = useContext(MyContext);

  const auth = getAuth(app);
  const user = auth.currentUser;
  const userId = user ? user.uid : '';

  useEffect(() => {
    if (user) {
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
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setSelectedFile(file);
      setPreviewURL(URL.createObjectURL(file));
      setSelectedFolder('default');
      setImageURL(null);
    }
  };


  const handleSaveImage = async () => {
    if (selectedFile && selectedFolder) {
      try {
        if (!user) {
          console.error('No authenticated user found.');
          return;
        }

        const storage = getStorage(app);
        const file = selectedFile;
        const folderPath = `users/${userId}/folders/${selectedFolder}/images/${file.name}`;
        const fileRef = ref(storage, folderPath);

        const reader = new FileReader();
        reader.onload = async () => {
          const fileDataUrl = reader.result as string;

          await uploadString(fileRef, fileDataUrl, 'data_url');

          const imageURL = await getDownloadURL(fileRef);
          console.log('Image saved.', imageURL);
        };
        reader.readAsDataURL(file);
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
  
        const storage = getStorage(app);
        const folderRef = ref(storage, `users/${userId}/folders/${newFolderName}/.keep`);
        const fileContent = ''; // Empty string content
  
        await uploadString(folderRef, fileContent, 'raw');
  
        setAvailableFolders((prevFolders: string[]) => [...prevFolders, newFolderName]);
        setSelectedFolder(newFolderName);
        setShowModal(false);
        console.log('Folder created.');
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
    setSelectedFolder(null);
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
          <div className="img-btns">
            <button onClick={handleOpenModal}>Select Folder</button>
            <button onClick={handleSaveImage}>Save image</button>
          </div>

          {showModal && (
            <div className="modal">
              <div className="modal-content">
                <h3>Select a Folder</h3>
                <select value={selectedFolder ?? ''} onChange={(e) => setSelectedFolder(e.target.value)}>
                  {availableFolders.map((folder, index) => (
                    <option key={index} value={folder}>
                      {folder}
                    </option>
                  ))}
                </select>
                <div className="new-folder-container">
                  <label className="new-folder-text" htmlFor="newFolderInput">
                    New Folder:
                  </label>
                  <input type="text" id="newFolderInput" value={newFolderName} onChange={(e) => setNewFolderName(e.target.value)} />
                  <button className="create-folder-btn" onClick={handleCreateFolder}>
                    Create Folder
                  </button>
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