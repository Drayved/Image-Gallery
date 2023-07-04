import { useEffect, useState, createContext } from "react"
import { createBrowserRouter, RouterProvider, Route, createRoutesFromChildren, Outlet} from "react-router-dom"

import Layout from "./components/Layout"




function App() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  


  const router = createBrowserRouter(
    createRoutesFromChildren(
      <Route path={"/"} element={<Layout />}>
        {/* <Route path="/folders" element={<GetGames />} />
        <Route path="/all-images" element={<GamesSaved />}/> */}
      </Route>
    )
  )

  
  return (
  <div>
    <RouterProvider router={router} />
      <Outlet />
  </div>
  )

}

export default App
