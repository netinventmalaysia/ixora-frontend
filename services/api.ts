// services/api.ts
import axios from 'axios';
import router from 'next/router';

// Constants
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ixora-api.mbmb.gov.my';
const CSRF_TOKEN_KEY = 'csrfToken';

// Shared state to avoid multiple CSRF fetches
let csrfFetchingPromise: Promise<string | null> | null = null;

// Create main API instance with interceptors
const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

// --- CSRF Token Helpers ---

// Use plain Axios (no interceptors) to prevent infinite loop
const rawAxios = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

export const fetchCsrfToken = async (): Promise<string | null> => {
    if (csrfFetchingPromise) return csrfFetchingPromise;

    csrfFetchingPromise = rawAxios
        .get('/auth/csrf-token')
        .then((res) => {
            const token = res.data?.csrfToken;
            if (token) {
                sessionStorage.setItem(CSRF_TOKEN_KEY, token);
                console.log('[CSRF] Token fetched:', token);
                return token;
            } else {
                console.warn('[CSRF] Token missing in response');
                return null;
            }
        })
        .catch((error) => {
            console.error('[CSRF] Failed to fetch token:', error);
            return null;
        })
        .finally(() => {
            csrfFetchingPromise = null;
        });

    return csrfFetchingPromise;
};



// --- Axios Interceptors ---

// Attach CSRF token to all outgoing requests
api.interceptors.request.use(async (config) => {
    let token = sessionStorage.getItem(CSRF_TOKEN_KEY);
    if (!token) token = await fetchCsrfToken();

    if (token) {
        config.headers['x-csrf-token'] = token;
    }

    return config;
});

// Handle 401 errors globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.warn('401 Unauthorized — handling globally');

            // Optional: Try to detect "guest" role to avoid auto-kick
            const userRole = localStorage.getItem('userRole');
            const userId = localStorage.getItem('userId');

            const isGuest = userRole === 'guest' || !userId;

            // Clear CSRF token
            sessionStorage.removeItem('csrfToken');

            if (!isGuest && typeof window !== 'undefined') {
                console.warn('🔐 Redirecting to home — non-guest 401');
                router.push('/');
            } else {
                console.warn('🟡 Skipped redirect for guest user');
            }
        }

        return Promise.reject(error);
    }
);

// --- API Methods ---

export const loginUser = async (credentials: any) => {
    const { data } = await api.post('/auth/login', credentials);
    await fetchCsrfToken(); // Refresh token after login
    return data;
};

export const guestLogin = async () => {
    const { data } = await api.post('/auth/guest-login');
    return data;
};

export const logoutUser = async () => {
    await api.post('/auth/logout');
};

export const createUser = (userData: any) => api.post('/users', userData);
export const getUserProfile = (userId: number) => api.get(`/users/profile/${userId}`);
export const updateUser = (userData: any) => api.put(`/users/profile/${userData.id}`, userData);
export const createBusiness = (businessData: any) => api.post('/business', businessData);

// Fetch user(s) by email. Backend may return an object or an array — callers should handle both shapes.
export const fetchUserByEmail = async (email: string) => {
    const { data } = await api.get('/users', { params: { email } });
    return data;
};

export const forgotPassword = (data: { email: string }) => api.post('/auth/forgot-password', data);

export const resetPassword = (data: { token: string | string[] | undefined; newPassword: string }) => {
    if (!data.token || Array.isArray(data.token)) {
        throw new Error('Invalid or missing token');
    }

    return api.post('/auth/reset-password', {
        token: data.token,
        newPassword: data.newPassword,
    });
};

export const uploadCertificate = async (file: File, folder = 'certificates'): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const res = await api.post('/uploads/file', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });

    return res.data.path;
};

// Business
export const fetchMyBusinesses = async () => {
    const { data } = await api.get('/business/registered');
    return data;
};

export const fetchBusinessById = async (businessId: number) => {
    const { data } = await api.get(`/business/${businessId}`);
    return data;
};

export const updateBusiness = async (businessId: number, payload: any) => {
    const { data } = await api.put(`/business/${businessId}`, payload);
    return data;
};

export const withdrawBusiness = async (businessId: number) => {
    const { data } = await api.patch(`/business/${businessId}/status`, { status: 'Withdrawn' });
    return data;
};

// Team Members
export const fetchTeamMembers = async (businessId: number) => {
    const { data } = await api.get(`/business/${businessId}/team`);
    return data;
};

export const inviteTeamMember = async (businessId: number, email: string) => {
    const { data } = await api.post(`/business/${businessId}/team/invite`, { email });
    return data;
};

export const updateTeamMemberRole = async (memberId: number, role: string) => {
    const { data } = await api.patch(`/business/team/${memberId}/role`, { role });
    return data;
};

export const removeTeamMember = async (memberId: number) => {
    const { data } = await api.delete(`/business/team/${memberId}`);
    return data;
};

// Business Invites
export const validateBusinessInvite = async (token: string) => {
    const { data } = await api.get(`/business/invite/validate`, { params: { token } });
    return data;
};

export const acceptBusinessInvite = async (token: string) => {
    const { data } = await api.post(`/business/invite/accept`, { token });
    return data;
};

// Email verification
export const validateEmailVerification = async (token: string) => {
    const { data } = await api.get(`/auth/verify-email/validate`, { params: { token } });
    return data;
};

export const confirmEmailVerification = async (token: string) => {
    const { data } = await api.post(`/auth/verify-email/confirm`, { token });
    return data;
};

export default api;
