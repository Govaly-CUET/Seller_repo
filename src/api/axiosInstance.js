import axios from 'axios';

const axiosInstance = axios.create({
    // Set VITE_API_URL when the backend is not running on localhost:5000.
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
});

// Automatically attach JWT token (if present) to every request
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('sellerToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default axiosInstance;