import React from "react";
import { Link } from 'react-router-dom'
import '../Styling/Navbar.css';

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-left">
                <Link to="/" className="logo">KomgaStat</Link>
                
            </div>
           
            <div className="navbar-right">
                <a href="https://github.com/dannynoordamdev/komgastat" target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-github" style={{ fontSize: '24px', color: 'white' }}></i>
                </a>
                <Link to="/login" className="login">Login</Link>
                <Link to="/setup" className="cta-button">Get Started</Link>
            </div>
        </nav>
    );
}

export default Navbar;
