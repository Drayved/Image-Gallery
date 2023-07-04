import { ChangeEvent, useState } from 'react';

export default function Uploader() {
  const [selectedFile, setSelectedFile] = useState<FileList | null>(null);
  const [previewURL, setPreviewURL] = useState<string | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0){
        const file = event.target.files;
        setSelectedFile(file);
        setPreviewURL(URL.createObjectURL(file[0]));
    }
    
  };


  return (
    <div className='uploader-container'>
        <div>
            <input type="file" onChange={handleFileChange} />
        </div>
      
      {previewURL && (
        <div className='preview-image-container'>
          <h2>Selected Image:</h2>
          <img className='uploaded-images' src={previewURL} alt="Selected" />
          <button>Save image</button>
        </div>
        
      )}
      
    </div>
  );
}
