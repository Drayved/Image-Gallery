import { useEffect, useState, createContext, useContext } from "react";
import { createBrowserRouter, RouterProvider, Route, createRoutesFromChildren, Outlet } from "react-router-dom";
import Layout from "./components/Layout";
import Folders from "./components/Folders";
import Images from "./components/Images";

export interface MyContextValue {
  selectedFolder: string | null;
  setSelectedFolder: (folder: string | null) => void;
  newFolderName: string;
  setNewFolderName: (name: string) => void;
  availableFolders: string[];
  setAvailableFolders: (folders: ((prevFolders: string[]) => string[]) | string[]) => void;
  selectedFile: File | null
  setSelectedFile: (file: File| null) => void
  email: string;
  setEmail: (email: any) => void
}

export const MyContext = createContext<MyContextValue>({
  selectedFolder: null,
  setSelectedFolder: () => {''},
  newFolderName: "",
  setNewFolderName: () => {''},
  availableFolders: ["default"],
  setAvailableFolders: () => {''},
  selectedFile: null,
  setSelectedFile: () => {''},
  email: "",
  setEmail: () => {''}
});

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState<string>("");
  const [availableFolders, setAvailableFolders] = useState<string[]>(["default"]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  

  const router = createBrowserRouter(
    createRoutesFromChildren(
      <>
        <Route path={"/"} element={<Layout />} />
        <Route path="/folders" element={<Folders />} />
        <Route path="/all-images" element={<Images />} />
       </>
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
          setSelectedFile,
          email,
          setEmail
        }}
      >
        <RouterProvider router={router} />
        <Outlet />
      </MyContext.Provider>
    </div>
  );
}

export default App;
