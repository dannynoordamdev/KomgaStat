import React from 'react'
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Navbar from './Components/Navbar'
import Footer from './Components/Footer'

import './App.css'


function App() {

  return (
    <>
    <Navbar/>

    <div className='main-content'>
      <h1>Welcome to KomgaStat!</h1>
      <p className='sub-title'>The way to visualize your comic reading habits!</p>
      <p className='setup-komga'>Don't have a Komga server yet? <a href='https://komga.org'>Set one up now!</a></p>
      <a href='/register' className='get-started-btn'>View Insights!</a>
    </div>

    <Footer/>
    </>
  )
}

export default App
