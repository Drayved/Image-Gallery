import { useEffect, useState, useContext } from 'react';
import { getAuth } from 'firebase/auth';
import app from '../../firebaseConfig';
import { getStorage, ref, listAll } from 'firebase/storage';
import Images from './Images';
import { MyContext }  from '../App'
import { Link } from 'react-router-dom'

export default function Folders() {
  const auth = getAuth(app);
  const user = auth.currentUser;
  const userId = user ? user.uid : '';
  const [folders, setFolders] = useState<string[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  
  const {showAll, setShowAll} = useContext(MyContext)

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
  

  return (
    <div>
      {!showAll && (
        <>
          <h2 className='text-xl text-center font-semibold'>My Folders</h2>
          <h3 className='fixed left-0 top-0 font-italic '><Link to="/">return to home</Link></h3>
          {folders.map((folder) => (
            <div onClick={() => setSelectedFolder(folder)} key={folder}>
              <div className='folder-container'>
                <img className='folder-img' src="../images/folder-icon.png" alt="" />
                <h3>{folder}</h3>
              </div>
              
              {selectedFolder === folder && <Images folderId={folder} />}
            </div>
          ))}
        </>
      )}
      {showAll && (
        <>
        <div>
          
          <h1 className='text-xl text-center font-semibold'>My Images</h1>
          <h3 className='fixed left-0 top-0 font-italic '><Link to="/">return to home</Link></h3>
        </div>
        
        
        {folders.map((folder) => (
            <div key={folder}>
              
              {<Images folderId={folder} showAll={true} />}
            </div>
          ))}
        </>
        
      )}
    </div>
  );
}
