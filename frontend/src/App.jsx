import React from 'react'
import {BrowserRouter as Router, Routes, Route } from 'react-router-dom'


// Components
import LandingPage from './Components/LandingPage/LandingPage'
import Login from './Components/Forms/Login'
import Signup from './Components/Forms/Signup'
import ResetPassword from './Components/Forms/ResetPassword'
import VerifyPage from './Components/Forms/VerifyPage'
import Projects from './Components/ProjectPage/Projects'
import { AuthProvider } from './Contexts/AuthContext'





function App() {
  return (
    <Router>    
      <AuthProvider> 
      <Routes>

        {/* Routes */}
        <Route path='/' element={<LandingPage/>}/ >
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/reset-password' element={<ResetPassword/>}/>
        <Route path='/verify-email' element={<VerifyPage/>}/> 
        <Route path='/projects' element={<Projects/>} />   
    
      </Routes>
      </AuthProvider>  
    </Router>
  )
}



export default App