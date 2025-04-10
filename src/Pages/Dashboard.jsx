import React, { useState, useEffect, useCallback } from "react";
import { auth } from "../../Firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import useKomgaData from "../Hooks/useKomgaData";
import DisplayComicSeries from "../Components/DisplayComicSeries";
import "../Styling/Dashboard.css";

const Dashboard = () => {
    const [user, setUser] = useState(null);

    //Gebruik makende van de useKomgaData Hook
    const { latestSeries, loading, error, retrievedKey, retrievedUrl } = useKomgaData(user);
  

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, setUser);
        return unsubscribe; // Bij het uitloggen van de gebruiker ruimen we resources op.
    }, []);



    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">KomgaStat Dashboard</h1>
               <DisplayComicSeries/>
            
    </div>
    );
};

export default Dashboard;