// src/utils/networkUtils.js
import axios from 'axios';

export const testApiConnection = async () => {
    const urls = [
        'https://localhost:7071/api',
        'http://localhost:7071/api',
        'https://127.0.0.1:7071/api',
        'http://127.0.0.1:7071/api'
    ];

    for (const url of urls) {
        try {
            await axios.get(`${url}/health`, { timeout: 5000 });
            console.log(`✅ Connected to: ${url}`);
            return url;
        } catch (error) {
            console.warn(`❌ Failed to connect to: ${url}`);
        }
    }

    throw new Error('No API endpoint is reachable');
};

export const isOnline = () => {
    return navigator.onLine;
};

export const waitForConnection = (callback) => {
    if (isOnline()) {
        callback();
    } else {
        window.addEventListener('online', callback, { once: true });
    }
};
