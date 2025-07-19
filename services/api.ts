// services/api.ts
import axios from 'axios';
import router from 'next/router';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
    withCredentials: true,
});

// Attach CSRF token to all requests that need it
api.interceptors.request.use((config) => {
    const csrfToken = localStorage.getItem('csrfToken');
    if (csrfToken) {
        config.headers['X-CSRF-Token'] = csrfToken;  // ✅ You have this already
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

api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const csrfToken = localStorage.getItem('csrfToken');
        if (csrfToken) {
            config.headers['X-CSRF-Token'] = csrfToken;
        }
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.warn('401 Unauthorized — Redirecting to login');
            if (typeof window !== 'undefined') {
                localStorage.removeItem('csrfToken');
                router.push('/');  // ✅ Redirect globally on 401
            }
        }
        return Promise.reject(error);
    }
);

export const loginUser = async (credentials: any) => {
    const { data } = await api.post('/auth/login', credentials);
    console.log('Login response:', data);

    return data;
};


export const guestLogin = async () => {
    const { data } = await api.post('/auth/guest-login');
    return data;
}


export const logoutUser = async () => {
    await api.post('/auth/logout');
};

export const createUser = (userData: any) => api.post('/users', userData);
export const getUserProfile = (userId: number) => api.get(`/users/profile/${userId}`);
export const updateUser = (userData: any) => api.put(`/users/profile/${userData.id}`, userData);
export const createBusiness = (businessData: any) => api.post('/business', businessData);


export const fetchCsrfToken = async () => {
    const res = await api.get('/auth/csrf-token');
    console.log('Fetched CSRF token:', res.data);
    const csrfToken = res.data?.csrfToken;
    if (csrfToken) {
        localStorage.setItem('csrfToken', csrfToken);
    }
};

export const forgotPassword = async (data: { email: string }) => {
    return api.post('/auth/forgot-password', data);
};


export const resetPassword = async (data: { token: string | string[] | undefined; newPassword: string }) => {
    if (!data.token || Array.isArray(data.token)) {
        throw new Error('Invalid or missing token');
    }

    return api.post('/auth/reset-password', {
        token: data.token,
        newPassword: data.newPassword,
    });
};

export async function uploadCertificate(file: File, folder = 'certificates'): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    console.log('Uploading file:', file.name, 'to folder:', folder);

    const res = await api.post('/uploads/file', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });

    return res.data.path;
}


export async function fetchMyBusinesses() {
    const { data } = await api.get('/business/registered');
    return data;
}


// Get team members for selected business
export const fetchTeamMembers = async (businessId: number) => {
    const { data } = await api.get(`/business/${businessId}/team`);
    return data;
};

// Invite new staff member (and trigger email)
export const inviteTeamMember = async (businessId: number, email: string) => {
    const { data } = await api.post(`/business/${businessId}/team/invite`, { email });
    return data;
};

// Assign new role
export const updateTeamMemberRole = async (memberId: number, role: string) => {
    const { data } = await api.patch(`/business/team/${memberId}/role`, { role });
    return data;
};

// Remove team member
export const removeTeamMember = async (memberId: number) => {
    const { data } = await api.delete(`/business/team/${memberId}`);
    return data;
};

export default api;
