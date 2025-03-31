import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './Components/Navbar'
import Footer from './Components/Footer'
import Home from './Pages/Home'
import Setup from './Pages/SetupPage'
import Login from './Pages/Login'
import Dashboard from './Pages/Dashboard'

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/setup' element={<Setup />} />
        <Route path='/login' element={<Login />} />
        <Route path='/dashboard' element={<Dashboard />} />



      </Routes>
      <Footer />
    </Router>
  )
}

export default App
