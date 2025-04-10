import { useState, useEffect } from "react";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import KomgaService from "../Services/komgaService";

// Intialiseren van firestore..
const db = getFirestore();

// Test limiet hoeveel we laten inladen.
const THUMBNAIL_LIMIT = 5;
const LATEST_SERIES_LIMIT = 20;

const useKomgaData = (user) => {
  const [latestSeries, setLatestSeries] = useState([]);
  const [latestSeriesNoThumbs, setLatestSeriesNoThumbs] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retrievedKey, setRetrievedKey] = useState(null);
  const [retrievedUrl, setRetrievedUrl] = useState(null);
  const [allComics, setAllComics] = useState([]);
  const [totalComics, setTotalComics] = useState([]);


  useEffect(() => {
    if (!user) return;

    const fetchUserSettings = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch gebruiker info van firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (!userDoc.exists()) {
          setError("User settings not found.");
          setLoading(false);
          return;
        }

        const { komgaApiKey, komgaUrl } = userDoc.data();
        setRetrievedKey(komgaApiKey);
        setRetrievedUrl(komgaUrl);

        if (!komgaApiKey || !komgaUrl) {
          setError("Komga API Key or URL not configured.");
          setLoading(false);
          return;
        }

        // Hier maken we gebruik van de request in komgaserver, om alle series te fetchen.
        const service = new KomgaService(komgaUrl, komgaApiKey);
        const latestResponse = await service.getLatestSeries(LATEST_SERIES_LIMIT);

        if (!latestResponse?.data?.content?.length) {
          setLatestSeries([]);
        } else {
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

          setLatestSeriesNoThumbs(latestResponse.data.content);

        }

        // Hier maken we gebruik van de request in komgaserver, om alle comics individueel te fetchen.
        const {comics, totalComics} = await service.getAllComics();
        if(comics.length){
          setAllComics(comics)
          setTotalComics(totalComics)
        }





      } catch (err) {
        setError("Failed to fetch data, try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserSettings();
  }, [user]);

  return { latestSeries, allComics, latestSeriesNoThumbs,totalComics, loading, error, retrievedKey, retrievedUrl };
};

export default useKomgaData;
