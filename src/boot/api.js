import axios from 'axios'

const api = axios.create({
    withXSRFToken: true,
    withCredentials: true,
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 10000, // Add timeout for better UX
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
})

api.interceptors.request.use(
    config => {
        const token = localStorage.getItem('authToken'); // Use consistent naming
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor for better error handling
api.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        if (error.response?.status === 401) {
            // Handle unauthorized access
            localStorage.removeItem('authToken');
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

export default api