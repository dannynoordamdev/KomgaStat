import React, { useState, useEffect } from "react";
import { auth, provider } from "/Firebase/firebaseConfig.js";
import { signInWithEmailAndPassword, signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom"; 
import "../Styling/SetupPageStyling.css";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate(); 
    const [user, setUser] = useState(null);


    

    const handleGoogleSignIn = async () => {
        try {
            await signInWithPopup(auth, provider);
            navigate("/dashboard"); 
        } catch (error) {
            setError(error.message);
        }
    };

    const handleLogin = async () => {
        try{
            await signInWithEmailAndPassword(auth, email,password);
            navigate("/dashboard");
        }
        catch (error){
            setError(error.message);
        }
    }


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
                <h1>Login to your account</h1>

                <div className="input-group">
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>

                <div className="input-group">
                    
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>

                

                {error && <p className="error-message">{error}</p>}

                <button className="get-started-btn" onClick={handleLogin}>Login</button>

                <p>OR</p>

                <button className="google-signin-btn" onClick={handleGoogleSignIn}>
                    Sign in with Google
                </button>
            </div>
        </div>
    );
};

export default Login;
