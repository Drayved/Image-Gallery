import { useEffect, useState, createContext, useContext } from "react";
import { createBrowserRouter, RouterProvider, Route, createRoutesFromChildren, Outlet } from "react-router-dom";
import Layout from "./components/Layout";

export interface MyContextValue {
  selectedFolder: string | null;
  setSelectedFolder: (folder: string | null) => void;
  newFolderName: string;
  setNewFolderName: (name: string) => void;
  availableFolders: string[];
  setAvailableFolders: (folders: ((prevFolders: string[]) => string[]) | string[]) => void;
  selectedFile: FileList | null
  setSelectedFile: (file: FileList | null) => void
  
}

export const MyContext = createContext<MyContextValue>({
  selectedFolder: null,
  setSelectedFolder: () => {''},
  newFolderName: "",
  setNewFolderName: () => {''},
  availableFolders: ["default"],
  setAvailableFolders: () => {''},
  selectedFile: null,
  setSelectedFile: () => {''}
});

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState<string>("");
  const [availableFolders, setAvailableFolders] = useState<string[]>(["default"]);
  const [selectedFile, setSelectedFile] = useState<FileList | null>(null);

  const router = createBrowserRouter(
    createRoutesFromChildren(
      <Route path={"/"} element={<Layout />} />
      /* <Route path="/folders" element={<GetGames />} />
      <Route path="/all-images" element={<GamesSaved />} /> */
    )
  );

  return (
    <div>
      <MyContext.Provider
        value={{
          selectedFolder,
          setSelectedFolder,
          newFolderName,
          setNewFolderName,
          availableFolders,
          setAvailableFolders,
          selectedFile,
          setSelectedFile
        }}
      >
        <RouterProvider router={router} />
        <Outlet />
      </MyContext.Provider>
    </div>
  );
}

export default App;
