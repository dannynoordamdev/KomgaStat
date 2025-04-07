import React, { useState, useEffect } from "react";
import { getFirestore, doc, setDoc, getDoc, deleteField, updateDoc } from "firebase/firestore";
import { auth } from "/Firebase/firebaseConfig.js"; 
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import '../Styling/Profile.css'

const db = getFirestore();

const SetupAPIServer = () => {
    const [apiKey, setApiKey] = useState("");
    const [komgaUrl, setKomgaUrl] = useState("");
    const [retrievedKey, setRetrievedKey] = useState(null);  
    const [retrievedUrl, setRetrievedUrl] = useState(null);
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

        const fetchData = async () => {
            try {
                const userRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(userRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setRetrievedKey(data.komgaApiKey || "");
                    setRetrievedUrl(data.komgaUrl || "");
                } else {
                    setRetrievedKey("");
                    setRetrievedUrl("");
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [user]); 

    const saveConnectionInfo = async () => {
        if (!user) {
            alert("You need to be signed in!");
            navigate("/login"); 
            return;
        }

        try {
            const userRef = doc(db, "users", user.uid);
            await setDoc(userRef, { 
                komgaApiKey: apiKey, 
                komgaUrl: komgaUrl 
            }, { merge: true });

            setRetrievedKey(apiKey);
            setRetrievedUrl(komgaUrl);
            setApiKey("");
            setKomgaUrl("");
            alert("API Key and URL saved securely!");
            window.location.reload();
        } catch (error) {
            console.error("Error saving data:", error);
        }
    };

    const removeConnectionInfo = async () => {
        if (!user) {
            alert("You must be logged in!");
            navigate("/login"); 
            return;
        }

        try {
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, { 
                komgaApiKey: deleteField(),
                komgaUrl: deleteField()
            });

            setRetrievedKey(""); 
            setRetrievedUrl("");
            alert("Connection info removed!");
            window.location.reload();

        } catch (error) {
            console.error("Error removing data:", error);
        }
    };

    

    return (
        <div className="profile-container">

            {retrievedKey && retrievedUrl ? (
                <>
                    <p>Connected to:&nbsp;<strong>{retrievedUrl}</strong></p>
                    <p>API Key:&nbsp;<strong>{retrievedKey.slice(0, 3)}••••••••••••</strong></p>

                    <button onClick={removeConnectionInfo}>Terminate Connection</button>
                </>
            ) : (
                <>
                            <h2>Komga API Setup</h2>

                    <label>Komga Server URL</label>
                    <input 
                        type="url" 
                        placeholder="https://your-komga-server.com" 
                        value={komgaUrl} 
                        onChange={(e) => setKomgaUrl(e.target.value)} 
                        required
                    />

                    <label>Komga API Key</label> 
                    <input 
                        type="password" 
                        placeholder="Enter your Komga API key" 
                        value={apiKey} 
                        onChange={(e) => setApiKey(e.target.value)} 
                        required
                    />

                    <button onClick={saveConnectionInfo}>Save API Key + URL</button>
                </>
            )}
        </div>
    );
};

export default SetupAPIServer;
