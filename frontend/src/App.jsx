import Navbar from "./components/Navbar"
import { Routes,Route, Navigate } from "react-router-dom"
import SignUpPage from "./pages/SignUpPage"
import HomePage from "./pages/HomePage"
import LogInPage from "./pages/LogInPage"
import SettingsPage from "./pages/SettingsPage"
import ProfilePage from "./pages/ProfilePage"
import { useAuthStore } from "./store/useAuthStore"
import { useThemeStore } from "./store/useThemeStore"

import { useEffect } from "react"
import {Toaster} from "react-hot-toast"



const App = () => {
  const {authUser,checkAuth,isCheckingAuth} = useAuthStore()
  const {theme} = useThemeStore()


  useEffect(()=>{
    checkAuth();
  },[checkAuth])

  console.log(authUser)

  if(isCheckingAuth && !authUser)
    return (<div className="flex items-center justify-center h-screen">
      <span className="loading loading-dots loading-lg"></span>
    </div>)
    
    

  return (
    <div data-theme={theme}>
      <Navbar/>
      <Routes>
        <Route path="/" element={authUser ?  <HomePage/> : <Navigate to="/login"/> }/>
        <Route path="/signup" element={!authUser ? <SignUpPage/>: <Navigate to="/"/>}/>
        <Route path="/login" element={!authUser ? <LogInPage/> : <Navigate to="/"/>}/>
        <Route path="/settings" element={<SettingsPage/>}/>
        <Route path="/profile" element={authUser ? <ProfilePage/> : <Navigate to="/login"/>}/>

      </Routes>
      <Toaster/>
    </div>
  )
}
export default App 