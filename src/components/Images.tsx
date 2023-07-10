import { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import app from '../../firebaseConfig';

export default function Images({ folderId }: {folderId: string}){
    const auth = getAuth(app);
    const user = auth.currentUser;
    const userId = user ? user.uid : '';
    const [images, setImages] = useState<{ id: string; name: string, url:string;}[]>([]);
  
    useEffect(() => {
      const fetchImages = async () => {
        try {
          const db = getFirestore();
          const imagesCollectionRef = collection(db, 'users', userId, 'folders', folderId , 'images');
          const querySnapshot = await getDocs(imagesCollectionRef);
          const imageData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            url: doc.data().url,
            name: doc.data().name
          }));
          setImages(imageData);
        } catch (error) {
          console.error('Error fetching Images:', error);
        }
      };
  
      if (user) {
        fetchImages();
      }
    }, [userId, user, folderId]);

    return(
        <div>
          {images.map((image) =>(
            <img key={image.id} src={image.url} alt={`Image ${image.name}`} />
          ))}
        </div>
    )
}