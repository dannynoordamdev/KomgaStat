import React, { useState, useEffect, useCallback } from "react";
import { auth } from "../../Firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import KomgaService from "../Services/komgaService";
import "../Styling/Dashboard.css";

const db = getFirestore();
const THUMBNAIL_LIMIT = 8;
const LATEST_SERIES_LIMIT = 8;

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [latestSeries, setLatestSeries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Auth listener setup
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, setUser);
        return unsubscribe; // Cleanup
    }, []);

    // Fetch data when user changes
    const fetchData = useCallback(async () => {
        if (!user) {
            setLatestSeries([]);
            setError(null);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (!userDoc.exists()) {
                setError("User settings not found.");
                setLatestSeries([]);
                return;
            }

            const { komgaApiKey, komgaUrl } = userDoc.data();
            if (!komgaApiKey || !komgaUrl) {
                setError("Komga API Key or URL not configured.");
                setLatestSeries([]);
                return;
            }

            const service = new KomgaService(komgaUrl, komgaApiKey);
            const latestResponse = await service.getLatestSeries(LATEST_SERIES_LIMIT);

            if (!latestResponse?.data?.content?.length) {
                setLatestSeries([]);
                return;
            }

            const seriesWithThumbs = await Promise.allSettled(
                latestResponse.data.content.slice(0, THUMBNAIL_LIMIT).map(async (series) => {
                    try {
                        const thumbResponse = await service.getSeriesThumbnail(series.id);
                        return thumbResponse?.data?.startsWith('data:image') ? { ...series, thumbnail: thumbResponse.data } : { ...series, thumbnail: null };
                    } catch {
                        return { ...series, thumbnail: null };
                    }
                })
            );

            setLatestSeries(seriesWithThumbs.filter(res => res.status === 'fulfilled').map(res => res.value));

        } catch (err) {
            setError(err.message || "Failed to fetch data.");
            setLatestSeries([]);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <div className="dashboard-container">

            <h1 className="dashboard-title">Dashboard!</h1>


            <div className="dashboard-statistics">
              <h1>Comic Insights</h1>
              <p>Here Are Your Latest Insights:</p>
              <div className="reading-stats">

              </div>
            </div>



            {loading && <p className="loading-message">Loading series data...</p>}
            {error && <p className="error-message">Error: {error}</p>}

            {!loading && !error && latestSeries.length === 0 && user && (
                <p className="info-message">No recent series found.</p>
            )}

            {!loading && !error && latestSeries.length > 0 && (
                <div className="series-container">

                    <h2 className="section-title">Latest Series</h2>
                    <hr/>
                    <div className="series-grid">
                        {latestSeries.map((series) => (
                            <div key={series.id} className="series-card">
                                <div className="series-thumbnail-container">
                                    {series.thumbnail ? (
                                        <img
                                            src={series.thumbnail}
                                            alt={`${series.metadata?.title || 'Series'} thumbnail`}
                                            className="series-thumbnail"
                                            onError={(e) => e.target.style.display = 'none'}
                                        />
                                    ) : (
                                        <div className="series-thumbnail-placeholder">No Image</div>
                                    )}
                                </div>
                                <h3 className="series-title">
                                {series.metadata?.title ? series.metadata.title.substring(0, 15) : 'Unknown'}
                                </h3>                               
                                {typeof series.booksCount === 'number' && <p className="series-books">{series.booksCount} books</p>}
                                        </div>
                        ))}
                    </div>
                </div>
            )}

            {!user && <p className="info-message">Please log in to view your dashboard.</p>}
        </div>
    );
};

export default Dashboard;