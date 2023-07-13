import { useEffect, useState } from 'react';
import { getStorage, ref, listAll, getDownloadURL } from 'firebase/storage';
import app from '../../firebaseConfig';
import { getAuth } from 'firebase/auth';

interface ImagesProps {
  folderId?: string;
  showAll?: boolean;
}

export default function Images({ folderId, showAll }: ImagesProps) {
  const [images, setImages] = useState<{ id: string; name: string; url: string }[]>([]);
  const auth = getAuth(app);
  const user = auth.currentUser;
  const userId = user ? user.uid : '';

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const storage = getStorage(app);
        let imageResults: { id: string; name: string; url: string }[] = [];

        if (showAll) {
          const folderRef = ref(storage, `users/${userId}/folders/${folderId}/images`);
          const filesList = await listAll(folderRef);

          const imagePromises = filesList.items.map(async (file) => {
            const imageUrl = await getDownloadURL(file);
            return {
              id: file.name,
              url: imageUrl,
              name: file.name
            };
          });

          imageResults = await Promise.all(imagePromises);
        } else if (folderId) {
          const folderRef = ref(storage, `users/${userId}/folders/${folderId}/images`);
          const filesList = await listAll(folderRef);

          const imagePromises = filesList.items.map(async (file) => {
            const imageUrl = await getDownloadURL(file);
            return {
              id: file.name,
              url: imageUrl,
              name: file.name
            };
          });

          imageResults = await Promise.all(imagePromises);
        }

        setImages(imageResults);
      } catch (error) {
        console.error('Error fetching Images:', error);
      }
    };

    fetchImages();
  }, [folderId, showAll, userId]);

  return (
    <div className='image-container'>
      {images.map((image) => (
        <img className='image' key={image.id} src={image.url} alt={`Image ${image.name}`} />
      ))}
    </div>
  );
}
