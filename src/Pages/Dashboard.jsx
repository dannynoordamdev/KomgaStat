import React, { useState, useEffect } from "react";
import { auth } from "/Firebase/firebaseConfig.js"; 
import { onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import KomgaService from "../Services/komgaService";
import "../Styling/Dashboard.css";

const db = getFirestore();

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [latestSeries, setLatestSeries] = useState([]);
    
    // Set up auth listener
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe(); 
    }, []);

    // Fetch data when user is available
    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;
            
            try {
                // Get Komga settings from Firestore
                const userRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(userRef);
                
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    
                    if (data.komgaApiKey && data.komgaUrl) {
                        // Create service and fetch data
                        const service = new KomgaService(data.komgaUrl, data.komgaApiKey);
                        const latestData = await service.getLatestSeries(10);
                        
                        if (latestData.data && latestData.data.content) {
                            setLatestSeries(latestData.data.content);
                        }
                    }
                }
            } catch (error) {
                console.log("Error:", error);
            }
        };
        
        fetchData();
    }, [user]);

    return (
        <div className="dashboard-container">
            <h1>Dashboard</h1>
            
            <div className="series-container">
                <h2>Latest Series</h2>
                <div className="series-grid">
                    {latestSeries.map((series) => (
                        <div key={series.id} className="series-card">
                            <h3>{series.metadata?.title || 'Unknown Title'}</h3>
                            {series.booksCount && <p>{series.booksCount} books</p>}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;