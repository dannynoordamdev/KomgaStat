import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "/Firebase/firebaseConfig.js";
import { onAuthStateChanged, signOut } from "firebase/auth";
import "../Styling/Navbar.css";

const Navbar = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser); 
        });
        return () => unsubscribe(); 
    }, []);

    const handleClickOutside = (e) => {
        if (menuOpen && !e.target.closest('.navbar-right') && !e.target.closest('.hamburger')) {
            setMenuOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [menuOpen]);

    const handleLogout = async () => {
        try {
            await signOut(auth);  
            navigate("/");  
        } catch (error) {
            console.error("Logout error:", error);
        }
        setMenuOpen(false); // Close the menu after logout
    };

    const handleProfile = () => {
        navigate("/profile");  
        setMenuOpen(false); 
    };

    const handleDashboard = () => {
        navigate("/dashboard");  
        setMenuOpen(false); 
    };

    const handleLinkClick = () => {
        setMenuOpen(false); // Close menu when any link is clicked
    };

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <Link to="/" className="logo">KomgaStat</Link>
            </div>

            <div className={`hamburger ${menuOpen ? "open" : ""}`} onClick={() => setMenuOpen(!menuOpen)}>
                ☰
            </div>

            <div className={`navbar-right ${menuOpen ? "open" : ""}`}>
                <a href="https://github.com/dannynoordamdev/komgastat" target="_blank" rel="noopener noreferrer" onClick={handleLinkClick}>
                    <i className="fab fa-github"></i>
                </a>
                
                {user ? (
                    <div className="user-info">
                        <span className="user-email">{user.email}</span>
                        <button className="buttons" onClick={handleProfile}>Profile</button>
                        <button className="buttons" onClick={handleDashboard}>Dashboard</button>
                        <button className="buttons logout-btn" onClick={handleLogout}>Sign Out</button>
                    </div>
                ) : (
                    <>
                        <Link to="/login" className="login buttons" onClick={handleLinkClick}>Login</Link>
                        <Link to="/setup" className="cta-button buttons" onClick={handleLinkClick}>Get Started</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
