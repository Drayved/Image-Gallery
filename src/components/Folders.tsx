import { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import app from '../../firebaseConfig';
import Images from './Images';

export default function Folders() {
  const auth = getAuth(app);
  const user = auth.currentUser;
  const userId = user ? user.uid : '';
  const [folders, setFolders] = useState<{ id: string; name: string;}[]>([]);

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const db = getFirestore();
        const foldersCollectionRef = collection(db, 'users', userId, 'folders');
        const querySnapshot = await getDocs(foldersCollectionRef);
        const folderData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
        }));
        setFolders(folderData);
      } catch (error) {
        console.error('Error fetching folders:', error);
      }
    };

    if (user) {
      fetchFolders();
    }

    
  }, [userId, user]);

  return (
    <div>
      <h2>My Folders</h2>
      {folders.map((folder) => (
        <div key={folder.id}>
          <h3>{folder.name}</h3>
          <Images folderId={folder.id} />
        </div>
      ))}
    </div>
  );
}
