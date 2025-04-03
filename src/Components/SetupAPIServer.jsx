import React, { useState, useEffect } from "react";
import { getFirestore, doc, setDoc, getDoc, deleteField, updateDoc } from "firebase/firestore";
import { auth } from "/Firebase/firebaseConfig.js"; 
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import '../Styling/Profile.css'

const db = getFirestore();

const SetupAPIServer = () => {
    const [apiKey, setApiKey] = useState("");
    const [retrievedKey, setRetrievedKey] = useState(null);  
    const [user, setUser] = useState(null);
    const navigate = useNavigate(); 

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
                    setRetrievedKey(""); 
                }
            } catch (error) {
                console.error("Error fetching API key:", error);
            }
        };

        fetchApiKey();
    }, [user]); 

    const saveApiKey = async () => {
        if (!user) {
            alert("You need to be signed in!");
            navigate("/login"); 
            return;
        }

        try {
            const userRef = doc(db, "users", user.uid);
            await setDoc(userRef, { komgaApiKey: apiKey }, { merge: true });

            setRetrievedKey(apiKey);
            setApiKey("");
            alert("API Key saved securely, setup completed!");
            window.location.reload();
        } catch (error) {
            console.error("Error saving API key:", error);
        }
    };

    const removeApiKey = async () => {
        if (!user) {
            alert("You must be logged in!");
            navigate("/login"); 
            return;
        }

        try {
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, { komgaApiKey: deleteField() });

            setRetrievedKey(""); 
            alert("API Key removed!");
            window.location.reload();

        } catch (error) {
            console.error("Error removing API key:", error);
        }
    };

    return (
        <div className="profile-container">
            <hr/>
            <p>Hosted URL of Komga server:</p>
            <input 
                        type="text" 
                        placeholder="https://domain.com" 
                        value={apiKey} 
                        onChange={(e) => setApiKey(e.target.value)} 
                    />

            {retrievedKey ? (
                <>
                    <button onClick={removeApiKey}>Remove API Key</button>
                </>
            ) : (

                <>
                    <p>Komga API key</p>

                    <input 
                        type="password" 
                        placeholder="Enter your Komga API key" 
                        value={apiKey} 
                        onChange={(e) => setApiKey(e.target.value)} 
                    />
                    <button onClick={saveApiKey}>Save API Key + URL</button>
                </>
            )}
        </div>
    );
};

export default SetupAPIServer;
