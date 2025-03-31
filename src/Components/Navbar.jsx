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

    const handleLogout = async () => {
        try {
            await signOut(auth);  
            navigate("/");  
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <Link to="/" className="logo">KomgaStat</Link>
            </div>

            {/* Hamburger menu icon */}
            <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
                ☰
            </div>

            <div className={`navbar-right ${menuOpen ? "open" : ""}`}>
                
                <a href="https://github.com/dannynoordamdev/komgastat" target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-github"></i>
                </a>
                
                {user ? (
                    <div className="user-info">
                        <span className="user-email">{user.email}</span> 
                        <button onClick={handleLogout}>Sign Out</button>

                    </div>
                ) : (
                    <>
                        <Link to="/login" className="login">Login</Link>
                        <Link to="/setup" className="cta-button">Get Started</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
