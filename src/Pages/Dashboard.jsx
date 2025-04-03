import React from "react";
import { auth } from "/Firebase/firebaseConfig.js"; 
import { onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../Styling/Dashboard.css";

const Dashboard = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser); 
        });
        return () => unsubscribe(); 
    }, []);

    return (
        <>
            <div className="dashboard-container">
                <h1>Dashboard</h1>
                <Link className="profilelink" to="/profile">
                    First time here? Setup your server connection in your profile settings first.
                </Link>
            </div>

            <div className="insights-container">
                <h3 className="insight-title">
                    Your collection currently exists of {1 + 1} comics!
                </h3>
                <hr className="underline-title" />
            </div>

            <div className="insights-container">
                <h3 className="insight-title">
                    According to your recent 5 read comics, your favorite genre is {"Action"}.
                </h3>
                <hr className="underline-title" />
            </div>
            <div className="insights-container">
                <h3 className="insight-title">
                    Your collection currently exists of {1 + 1} comics!
                </h3>
                <hr className="underline-title" />
            </div>

            <div className="insights-container">
                <h3 className="insight-title">
                    According to your recent 5 read comics, your favorite genre is {"Action"}.
                </h3>
                <hr className="underline-title" />
            </div>
        </>
    );
}

export default Dashboard;
