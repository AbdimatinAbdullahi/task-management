import React from 'react'
import {BrowserRouter as Router, Routes, Route } from 'react-router-dom'


// Components
import LandingPage from './Components/LandingPage/LandingPage'
import Login from './Components/Forms/Login'
import Signup from './Components/Forms/Signup'
import MainPage from './Components/ProjectPage/MainPage'
import CreateWorkspace from './Components/Forms/CreateWorkspace'

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
        <Route path='/workspace' element={<MainPage/>} />   
        <Route path='/create-workspace' element={<CreateWorkspace/>} />
      </Routes>
      </AuthProvider>  
    </Router>
  )
}



export default App