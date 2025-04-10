import React, { useState, useEffect } from "react";
import useKomgaData from "../Hooks/useKomgaData";
import { auth } from "../../Firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import "../Styling/DisplayComicSeries.css";



const DisplayComicSeries = () => {
    const [user, setUser] = useState(null);
    
        //Usekomga Hook:
    const { latestSeries, totalComics, latestSeriesNoThumbs, loading, error, retrievedKey, retrievedUrl } = useKomgaData(user);
      
    
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, setUser);
        return unsubscribe; // Resources opschonen.
    }, []);
    
    if (loading) return <div className="loading">Loading comic series...</div>
    if (error) return <div className="error">Error: Please setup your komga server connection first in your profile.</div>

    const getComicTitles = () => {
        return latestSeriesNoThumbs.map((series) => series.metadata?.title || 'Unknown');
    };

    const comicTitles = getComicTitles();

    



    return(
        <>
        {retrievedKey && retrievedUrl && latestSeries.length > 0 ? (
            <div className="card-container">
            <>
                <div className="stat-container">
                    <h2>Statistics:</h2>
                    <p>Total Comics: {totalComics}</p>
                    <hr/>
                    <h2>Latest added series:</h2>
                </div>

                <div className="series-grid">
                    {latestSeries.map((series) => (
                        <div key={series.id} className="series-card">
                            {series.thumbnail ? (
                                <img
                                    src={series.thumbnail}
                                    alt={series.metadata?.title || 'Comic Cover'}
                                    className="series-thumbnail"
                                /> 
                            ) : (
                                <p>No thumbnail found.</p>
                            )}
                            <h3 className="series-title">
                                    {series.metadata?.title ? 
                                        (series.metadata.title.length > 15 ? 
                                            `${series.metadata.title.substring(0, 15)}...` : 
                                            series.metadata.title) : 
                                        'Unknown'}
                                </h3> 
                                {typeof series.booksCount === 'number' && 
                                    <p className="series-books">{series.booksCount} books</p>}
                            </div>
                    ))}
                </div>

                <div className="AI-Container">
                <h2>Upcoming feature, AI comic suggestions.</h2>
                <p>Receive new comics based upon these series:</p>
                            <div className="">
                                {/* Toon de titels van de comics */}
                                <ul>
                                    {comicTitles.map((title, index) => (
                                        <li key={index}>{title.substring(0,50)}</li>
                                    ))}
                                </ul>
                            </div>
                </div>
            </>
            </div>

        ) : (
            <>
            
            </>
        )}
            </>

    );
};

export default DisplayComicSeries;