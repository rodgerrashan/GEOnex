import React from 'react'
import { Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Devices from './pages/Devices';
import Projects from './pages/Projects';
import Settings from './pages/Settings';
import Login from "./pages/Login";
import Navbar from './components/Navbar';


const App = () => {
  return (
    <div >

      <Navbar/>

      <Routes>
        <Route path='/' element={<Home />}/>

        <Route path='/devices' element={<Devices />}/>

        <Route path='/projects' element={<Projects />}/>

        <Route path='/settings' element={<Settings />}/>

        <Route path='/login' element={<Login />}/>

      </Routes>
      
    </div>
  )
}

export default App
