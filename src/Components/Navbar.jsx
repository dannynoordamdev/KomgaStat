import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "/Firebase/firebaseConfig.js"; 
import { onAuthStateChanged, signOut } from "firebase/auth";
import "../Styling/Navbar.css";

const Navbar = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

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
           
            <div className="navbar-right">
                {user ? (
                    <>
                        <span>Welcome! {user.email}</span> 
                        <button onClick={handleLogout}>Sign Out</button> 
                    </>
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
