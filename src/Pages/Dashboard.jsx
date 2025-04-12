import React, { useState, useEffect, useCallback } from "react";

import DisplayComicSeries from "../Components/DisplayComicSeries";
import "../Styling/Dashboard.css";

const Dashboard = () => {
    



    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">KomgaStat Dashboard</h1>
               <DisplayComicSeries/>
            
    </div>
    );
};

export default Dashboard;