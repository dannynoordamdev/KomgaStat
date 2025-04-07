import React, { useState, useEffect } from "react";
import { auth } from "/Firebase/firebaseConfig.js"; 
import { onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, deleteField, updateDoc } from "firebase/firestore";
import "../Styling/Profile.css";
import SetupAPIServer from "../Components/SetupAPIServer";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const db = getFirestore();


const Dashboard = () => {
    const [retrievedKey, setRetrievedKey] = useState(null);  
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, []);
    
    useEffect(() => {
        if (!user) return;

        const fetchApiKey = async () => {
            try {
                const userRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(userRef);

                if (docSnap.exists() && docSnap.data().komgaApiKey) {
                    setRetrievedKey(docSnap.data().komgaApiKey);
                } else {
                    setRetrievedKey(""); // No API key found
                }
            } catch (error) {
                console.error("Error fetching API key:", error);
                setRetrievedKey(null); // Error occurred while fetching key
            }
        };

        fetchApiKey();
    }, [user]); 

    return (
        <div className="profile-container">
            <h1>Profile</h1>
            {user ? (
                <div>
                <p>Welcome, {user.email.split('@')[0]}</p>
                <hr />
                </div>
            ) : (
                <p>Loading...</p>
            )}
            
            {retrievedKey === null ? (
                <div>
                    <p>Error fetching API key. Please try again later.</p>
                    <SetupAPIServer />
                </div>
            ) : retrievedKey === "" ? (
                <div>
                    <p>There is no API key yet, feel free to setup the server connection using below form:</p>

                    <SetupAPIServer />
                </div>
            ) : (
                <div>
                <p className="success-message">API connection between Komgastat and server has been established.</p>
                <SetupAPIServer />

                </div>

            )}
            
        </div>
        
    );
};

export default Dashboard;
