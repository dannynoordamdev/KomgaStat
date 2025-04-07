import axios from 'axios';

const PROXY_URL = 'http://localhost:5000/api/komga-proxy';

export default class KomgaService {
  constructor(serverUrl, apiKey) {
    this.serverUrl = serverUrl;
    this.apiKey = apiKey;
  }

  async makeRequest(endpoint) {
    const response = await axios.post(PROXY_URL, {
      url: this.serverUrl,
      endpoint,
      headers: {
        'X-API-Key': this.apiKey
      }
    });
    
    return response.data;
  }

  async getLatestSeries(size = 10) {
    return this.makeRequest(`/api/v1/series/latest?page=0&size=${size}`);
  }
}