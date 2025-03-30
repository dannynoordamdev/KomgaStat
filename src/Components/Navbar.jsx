import React from "react";
import '../Styling/Navbar.css';

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-left">
                <a href="/" className="logo">KomgaStat</a>
            </div>
           
            <div className="navbar-right">
                <a href="https://github.com/dannynoordamdev/komgastat" target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-github" style={{ fontSize: '24px', color: 'white' }}></i>
                </a>
                <a href="/login" className="login">Login</a>
                <a href="/register" className="cta-button">Get Started</a>
            </div>
        </nav>
    );
}

export default Navbar;
