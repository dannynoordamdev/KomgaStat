import React, { useState } from "react";
import { Link } from 'react-router-dom';
import '../Styling/SetupPageStyling.css';

const SetupComponentPage = () => {
    const [step, setStep] = useState(1);

    return (
        <div className="main-content">
            <div className="setup-container">
                {step === 1 ? (
                    <>
                        <h1>{step}: User Registration</h1>

                        <div className="input-group">
                            <label>Email:</label>
                            <input type="email" />
                        </div>

                        <div className="input-group">
                            <label>Name:</label>
                            <input type="text" />
                        </div>

                        <div className="input-group">
                            <label>Password:</label>
                            <input type="password" />
                        </div>

                        <div className="input-group">
                            <label>Re-enter Password:</label>
                            <input type="password" />
                        </div>

                        <button className="get-started-btn" onClick={() => setStep(2)}>Continue!</button>

                    </>
                ) : (
                    <>
                        <h1>{step}: Server Initialization</h1>

                        <div className="input-group">
                            <label>Server URL</label>
                            <input type="text" placeholder="https://example.com/api/v1/series" />
                        </div>

                        <div className="input-group">
                            <label>Username Komga Server</label>
                            <input type="text" />
                        </div>

                        <div className="input-group">
                            <label>Password Komga Server</label>
                            <input type="password" />
                        </div>

                        <button className="get-started-btn">Continue!</button>

                        <Link to="/security-info">How we handle your server password securely.</Link>
                    </>
                )}
            </div>
        </div>
    );
};

export default SetupComponentPage;
