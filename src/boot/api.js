import base from 'axios'

const api = base.create({
    withXSRFToken: true,
    withCredentials: true,
    baseURL: import.meta.env.VITE_API_URL
})

api.interceptors.request.use(
    config => {
        const token = localStorage.getItem('auth_token'); // Get the token from localStorage
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`; // Attach the token to the Authorization header
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

export default api