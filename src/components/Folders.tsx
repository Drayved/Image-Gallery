import { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import app from '../../firebaseConfig';
import { getStorage, ref, listAll } from 'firebase/storage';
import Images from './Images';

export default function Folders() {
  const auth = getAuth(app);
  const user = auth.currentUser;
  const userId = user ? user.uid : '';
  const [folders, setFolders] = useState<string[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [showAll, setShowAll] = useState<boolean>(false);

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        if (!user) {
          console.error('No authenticated user found.');
          return;
        }

        const storage = getStorage(app);
        const foldersRef = ref(storage, `users/${userId}/folders`);
        const foldersList = await listAll(foldersRef);
        const folderNames = foldersList.prefixes.map((folder) => folder.name);
        setFolders(folderNames);
      } catch (error) {
        console.error('Error fetching folders:', error);
      }
    };

    fetchFolders();
  }, [userId, user]);

  const handleShowImages = (folder: string) => {
    setSelectedFolder(folder === selectedFolder ? null : folder);
    setShowAll(false);
  };



  return (
    <div>
      <h2>My Folders</h2>
      
      {folders.map((folder) => (
        <div key={folder}>
          <h3 onClick={() => handleShowImages(folder)}>{folder}</h3>
          {showAll || (selectedFolder === folder && <Images folderId={folder} />)}
        </div>
      ))}
    </div>
  );
}
