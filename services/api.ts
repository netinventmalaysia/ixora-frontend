// services/api.ts
import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
    withCredentials: true,
});

// Attach CSRF token to all requests that need it
api.interceptors.request.use((config) => {
    const csrfToken = localStorage.getItem('csrfToken');
    if (csrfToken && config.headers) {
        config.headers['X-CSRF-Token'] = csrfToken;
    }

    return config;
});

// Handle 401 errors globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            console.error('Unauthorized access - redirecting to login');
            localStorage.removeItem('csrfToken'); // only CSRF token now
        }
        return Promise.reject(error);
    }
);

export const loginUser = async (credentials: any) => {
    const { data } = await api.post('/auth/login', credentials);
    const csrfRes = await api.get('/auth/csrf-token');
    const csrfToken = csrfRes?.data?.csrfToken;
    if (csrfToken) {
        localStorage.setItem('csrfToken', csrfToken);
    }
    return data;
};


export const guestLogin = async () => {
    const { data } = await api.post('/auth/guest-login');
    const csrfRes = await api.get('/auth/csrf-token');
    const csrfToken = csrfRes?.data?.csrfToken;
    if (csrfToken) {
        localStorage.setItem('csrfToken', csrfToken);
    }
    return data;
}


export const logoutUser = async () => {
    await api.post('/auth/logout');
    localStorage.removeItem('csrfToken');
};

export const createUser = (userData: any) => api.post('/users', userData);
export const getUserProfile = (userId: string) => api.get(`/users/${userId}`);

export const fetchCsrfToken = async () => {
    const res = await api.get('/auth/csrf-token');
    const csrfToken = res.data?.csrfToken;
    if (csrfToken) {
        localStorage.setItem('csrfToken', csrfToken);
    }
};

export default api;
