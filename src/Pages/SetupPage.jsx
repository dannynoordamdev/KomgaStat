import React, { useState, useEffect } from "react";
import { auth, provider } from "/Firebase/firebaseConfig.js";
import { createUserWithEmailAndPassword, signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom"; 
import "../Styling/SetupPageStyling.css";

const SetupComponentPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate(); 

    const handleRegister = async () => {
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            navigate("/dashboard"); 
        } catch (error) {
            setError(error.message);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            await signInWithPopup(auth, provider);
            navigate("/dashboard"); 
        } catch (error) {
            setError(error.message);
        }
    };

    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser); 

            if(currentUser){
                navigate("/dashboard"); 
            }
        });
    
        return () => unsubscribe(); 

       
    }, []);

    return (
        <div className="main-content">
            <div className="setup-container">
                <h1>Create an Account</h1>

                <div className="input-group">
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>

                <div className="input-group">
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>

                <div className="input-group">
                    <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                </div>

                {error && <p className="error-message">{error}</p>}

                <button className="google-signin-btn" onClick={handleGoogleSignIn}>
                    Or Sign up with Google
                </button>

                <button className="get-started-btn" onClick={handleRegister}>Sign Up</button>


                
            </div>
        </div>
    );
};

export default SetupComponentPage;
