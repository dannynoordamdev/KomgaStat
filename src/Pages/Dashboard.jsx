import React from "react"
import { auth } from "/Firebase/firebaseConfig.js"; 
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useState, useEffect } from "react";
import "../Styling/Dashboard.css";
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
        <div className="dashboard-container">

        <h1>Dashboard</h1>
        <SetupAPIServer />

        </div>
        </>
    )
}

export default Dashboard