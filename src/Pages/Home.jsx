import React from 'react'
import { Link } from 'react-router-dom'
import '../Styling/App.css'



function Home() {
  return (
    <div className="home-main-content">
      <h1 className="main-title">Welcome to KomgaStat!</h1>
      <p className="sub-title">The way to visualize your comic reading habits!</p>
      <p className="setup-komga">
        Don't have a Komga server yet? <a href="https://komga.org">Set one up now!</a>
      </p>
      <Link to="/setup" className="get-started-btn">View Insights!</Link>
    </div>
  )
}

export default Home
