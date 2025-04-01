import React from "react"
import { auth } from "/Firebase/firebaseConfig.js"; 
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useState, useEffect } from "react";
import "../Styling/App.css";
import SetupAPIServer from "../Components/SetupAPIServer";

const Dashboard = () => {
     const [user, setUser] = useState(null);
        
    
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
             setUser(currentUser); 
        });
        return () => unsubscribe(); 
    }, []);

    return(
        <>
        <div className="main-content">

        <h1>Dashboard</h1>
        {user ? <p>Welcome on the dashboard, {user.email}</p> : <p>Loading or not signed in...</p>}
        <SetupAPIServer />

        </div>
        </>
    )
}

export default Dashboard