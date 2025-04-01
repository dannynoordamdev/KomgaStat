import React, { useState, useEffect } from "react";
import { getFirestore, doc, setDoc, getDoc, deleteField, updateDoc } from "firebase/firestore";
import { auth } from "/Firebase/firebaseConfig.js"; 
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

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
        } catch (error) {
            console.error("Error removing API key:", error);
        }
    };

    return (
        <div>
            <h2>Setup Komga API Server</h2>
            {retrievedKey ? (
                <>
                    <p>Your API key is securely stored.</p>
                    <button onClick={removeApiKey}>Remove API Key</button>
                </>
            ) : (
                <>
                    <input 
                        type="password" 
                        placeholder="Enter your Komga API key" 
                        value={apiKey} 
                        onChange={(e) => setApiKey(e.target.value)} 
                    />
                    <button onClick={saveApiKey}>Save API Key</button>
                </>
            )}
        </div>
    );
};

export default SetupAPIServer;
