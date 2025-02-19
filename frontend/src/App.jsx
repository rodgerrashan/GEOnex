import React from 'react'
import { Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Devices from './pages/Devices';
import Projects from './pages/Projects';
import Settings from './pages/Settings';
import Login from "./pages/Login";


const App = () => {
  return (
    <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px=[9vw]">

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
