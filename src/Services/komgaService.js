const PROXY_ENDPOINT = '/api/komga-proxy';

export default class KomgaService {
    constructor(serverUrl, apiKey) {
        this.komgaUrl = serverUrl;
        this.apiKey = apiKey;

        if (!this.komgaUrl || !this.apiKey) {
            console.warn("KomgaService initialized without URL or API Key.");
        }
    }

    async makeRequest(endpoint, method = 'GET', body = null, responseType = 'json') {
        const payload = {
            url: this.komgaUrl,
            endpoint,
            method,
            headers: { 'X-API-Key': this.apiKey },
            data: body,
            responseType
        };

        try {
            const response = await fetch(PROXY_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                let errorData;
                try {
                    errorData = await response.json();
                    console.error("[KomgaService] Proxy error:", response.status, errorData);
                } catch {
                    const textError = await response.text();
                    console.error("[KomgaService] Proxy non-JSON error:", response.status, textError);
                    errorData = { error: `Proxy error ${response.status}`, details: textError };
                }
                throw new Error(errorData?.error || `Proxy request failed: ${response.status}`);
            }

            if (responseType === 'blob') {
                const dataUrl = await response.text();
                if (!dataUrl?.startsWith('data:image')) {
                    console.warn(`[KomgaService] Invalid Data URL received: ${dataUrl?.substring(0, 50)}...`);
                }
                return { status: response.status, data: dataUrl };
            } else {
                const jsonData = await response.json();
                return { status: response.status, data: jsonData };
            }
        } catch (error) {
            console.error('[KomgaService] makeRequest failed:', error.message || error);
            throw error;
        }
    }

    // Hier staan de api requests.

    async getLatestSeries(limit = 5) {
        const response = await this.makeRequest(`/api/v1/series/latest?page=0&size=${limit}`, 'GET', null, 'json');
        return response;
    }
    
    async getSeriesThumbnail(seriesId) {
    
        const cached = localStorage.getItem(`komga-thumbnail-${seriesId}`);
        if (cached) {
            return { status: 200, data: cached };
        }
        const response = await this.makeRequest(`/api/v1/series/${seriesId}/thumbnail`, 'GET', null, 'blob');
    
        if (response?.data?.startsWith('data:image')) {
            // Save to localStorage
            try {
                localStorage.setItem(`komga-thumbnail-${seriesId}`, response.data);
            } catch (e) {
                console.warn("Thumbnail cache full or unavailable:", e);
            }
        }
        return response;
    }
    
    

    async getAllComics() {
        const requestBody = {
            "condition": {
                "allOf": []
            },
            "page": 0, 
            "size": 100,
        };
    
        const response = await this.makeRequest('/api/v1/books/list', 'POST', requestBody, 'json');
    
    
        // Map over the response to only return titles
        const comicsTitles = response?.data?.content?.map(comic => comic) || [];

    
        return {
            comics: comicsTitles,  // Return only the titles
            totalComics: response?.data?.totalElements || 0 
        };
    }
    
    
    



    
}