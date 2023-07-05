import { ChangeEvent, useState, useEffect, useContext } from 'react';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';
import firebaseConfig from '../../firebaseConfig';
import { MyContext, MyContextValue }  from '../App'





export default function Uploader() {
  
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  
  
  const [showModal, setShowModal] = useState<boolean>(false);
  // Replace with your available folder names
  const { selectedFolder, setSelectedFolder, newFolderName, setNewFolderName, availableFolders, setAvailableFolders, selectedFile, setSelectedFile } = useContext(MyContext);
  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const db = getFirestore();
        const foldersCollection = collection(db, 'users');
        const foldersSnapshot = await getDocs(foldersCollection);
        const foldersData = foldersSnapshot.docs.map((doc) => doc.data().name);
        setAvailableFolders(['default', ...foldersData]);
      } catch (error) {
        console.error('Error fetching folders:', error);
      }
    };

    fetchFolders();
  }, []);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0){
        const file = event.target.files;
        setSelectedFile(file);
        setPreviewURL(URL.createObjectURL(file[0]));
        setSelectedFolder('default')
    }
    
  };

  const handleSaveImage = async () => {
    if (selectedFile && selectedFolder) {
      try {
        const db = getFirestore();
        const foldersCollection = collection(db, 'users');
        const newImage = {
          name: selectedFile[0].name,
          folder: selectedFolder,
        };
        await addDoc(foldersCollection, newImage);
        console.log('Image saved.');
      } catch (error) {
        console.error('Error saving image:', error);
      }
    }
  };
  const handleSelectFolder = (folderName: string) => {
    setSelectedFolder(folderName);
    setShowModal(false);
  };

  const handleCreateFolder = () => {
    // Perform the folder creation logic here
    // You need to implement the logic for creating a folder in your specific storage system
    // It might involve creating a new directory, updating the database, etc.
    // Once the folder is created, you can set the selectedFolder state to the new folder name
    setAvailableFolders((prevFolders: string[]) => [...prevFolders, newFolderName]);
    setSelectedFolder(newFolderName);
    setShowModal(false);
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
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








