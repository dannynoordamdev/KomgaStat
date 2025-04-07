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

    async getLatestSeries(limit = 10) {
        return this.makeRequest(`/api/v1/series/latest?page=0&size=${limit}`, 'GET', null, 'json');
    }

    async getSeriesThumbnail(seriesId) {
        return this.makeRequest(`/api/v1/series/${seriesId}/thumbnail`, 'GET', null, 'blob');
    }
}