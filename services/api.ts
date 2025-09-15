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

// Fetch billings for a business. Backend expects business_id as query param.
export const fetchBillingsWithBusinessId = async (businessId?: number) => {
    const params: any = {};
    if (businessId) params.business_id = businessId;

    const { data } = await api.get('/billings', { params });
    return data;
};

export const fetchBillings = async (businessId: number) => {
    const { data } = await api.get('/billings');
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

// ================= Verification (Document) =================
export type VerificationStatusType = string; // backend enum; keep loose on FE

export interface VerificationListParams {
    status?: VerificationStatusType | VerificationStatusType[];
    limit?: number;
    offset?: number;
}

export interface VerificationListResponse {
    data: any[];
    total?: number;
    limit?: number;
    offset?: number;
}

export const listPendingVerifications = async (params: VerificationListParams = {}): Promise<VerificationListResponse> => {
    const { status, limit, offset } = params;
    const query: any = {};
    if (status) query.status = status;
    if (typeof limit === 'number') query.limit = String(limit);
    if (typeof offset === 'number') query.offset = String(offset);
    const { data } = await api.get('/verification/pending', { params: query });
    // Backend wraps results as { data: [...], total, limit, offset }
    if (data && Array.isArray(data.data)) {
        return data as VerificationListResponse;
    }
    // Fallback if backend returns array directly
    return { data: Array.isArray(data) ? data : [], total: 0, limit, offset } as VerificationListResponse;
};

export const reviewVerification = async (verificationId: number, status: VerificationStatusType, reason?: string) => {
    const { data } = await api.patch(`/verification/${verificationId}/review`, { status, reason });
    return data;
};

export const processVerification = async (verificationId: number) => {
    const { data } = await api.patch(`/verification/${verificationId}/process`);
    return data;
};

export const getLatestVerificationForBusiness = async (businessId: number) => {
    const { data } = await api.get(`/verification/business/${businessId}/latest`);
    return data;
};

// ================= Vendors (Admin) =================
export const generateVendorKey = async () => {
    const { data } = await api.get('/vendors/generate-key');
    return data; // { status, message, key }
};

export const createVendor = async (payload: { name: string; key: string; app_name: string }) => {
    const { data } = await api.post('/vendors', payload);
    return data; // saved Vendor
};

export const listVendors = async () => {
    const { data } = await api.get('/vendors');
    return data; // Vendor[]
};

// ================= Payments =================
export interface PaymentSubmitPayload {
    orderid: string;
    amount: string; // e.g. "100.01"
    bill_name: string;
    bill_email: string;
    bill_mobile: string;
    bill_desc: string;
    country: string; // e.g. "MY"
}

// Submit a payment to MBMB public API
export const submitPayment = async (payload: PaymentSubmitPayload) => {
    const { data } = await api.post('/mbmb/public/api/payment/submit', payload);
    return data;
};

// ================= MySKB Ownership =================
export interface OwnershipItem {
    id: number;
    user_id?: number | null;
    name?: string | null;
    email: string;
    role?: string | null;
    project?: string | null;
    avatar_url?: string | null;
    last_seen_iso?: string | null;
    status: 'Pending' | 'Approved' | 'Rejected';
    scope?: 'project-only' | 'full';
    allowed_tabs?: string[];
    created_at?: string;
    updated_at?: string;
}

export interface OwnershipListParams {
    business_id: number;
    status?: 'Pending' | 'Approved' | 'Rejected';
    q?: string;
    limit?: number;
    offset?: number;
    sort?: string; // e.g., "created_at:desc"
}

export interface OwnershipListResponse {
    data: OwnershipItem[];
    total: number;
    limit: number;
    offset: number;
}

export const listOwnerships = async (params: OwnershipListParams): Promise<OwnershipListResponse> => {
    const { data } = await api.get('/myskb/ownership', { params });
    // normalize minimal fallback
    if (Array.isArray(data)) {
        return { data, total: data.length, limit: data.length, offset: 0 } as any;
    }
    return data;
};

export const inviteOwnership = async (payload: { business_id: number; email: string; project?: string; role?: string }) => {
    const { data } = await api.post('/myskb/ownership/invite', payload);
    return data as { status: boolean; user_exists?: boolean; invited?: boolean; invite_email_sent?: boolean; created: OwnershipItem };
};

export const updateOwnership = async (id: number, patch: { status?: 'Pending' | 'Approved' | 'Rejected'; role?: string; project?: string }) => {
    const { data } = await api.patch(`/myskb/ownership/${id}`, patch);
    return data as OwnershipItem;
};

export const removeOwnership = async (id: number) => {
    const { data } = await api.delete(`/myskb/ownership/${id}`);
    return data as { message: string };
};

// ================= MySKB Access Control =================
export interface MySkbAccess {
    projectOnly?: boolean;
    allowedTabs?: string[]; // e.g., ['Application']
}

// Query which tabs the current user is allowed to see in MySKB
export const getMySkbAccess = async (): Promise<MySkbAccess> => {
    try {
        const { data } = await api.get('/myskb/ownership/access');
        return data;
    } catch (e) {
        // Fallback: read local override if set for testing
        if (typeof window !== 'undefined') {
            const raw = localStorage.getItem('myskb_allowed_tabs');
            if (raw) {
                try { return { allowedTabs: JSON.parse(raw) }; } catch { }
            }
        }
        return {};
    }
};

export default api;

// ================= MySKB Project (Draft & Submit) =================
// NOTE: If your backend uses different paths, update these endpoints only.
export type ProjectFormPayload = Record<string, any>;

// Best-effort cleanup: remove empty strings and coerce simple numerics
const sanitizeProjectPayload = (src: ProjectFormPayload) => {
    const cleaned: Record<string, any> = {};
    const numericKeys = new Set([
        'business_id',
        'landArea',
        'existingBuilding',
        'residentialBuilding',
        'semiResidentialBuilding',
        'otherBuilding',
        'openArea',
        'closeArea',
        'processingFees',
    ]);
    for (const [k, v] of Object.entries(src || {})) {
        if (v === '' || v === undefined || v === null) continue;
        if (numericKeys.has(k)) {
            const n = Number(v);
            if (!Number.isNaN(n)) {
                cleaned[k] = n;
                continue;
            }
        }
        cleaned[k] = v;
    }
    return cleaned;
};

// Save project as draft
export const saveProjectDraft = async (payload: ProjectFormPayload) => {
    const cleaned = sanitizeProjectPayload(payload);
    const body = { data: cleaned };
    try {
        const { data } = await api.post('/myskb/project/draft', body, { headers: { 'Content-Type': 'application/json' } });
        return data;
    } catch (e: any) {
        const msg = e?.response?.data?.message;
        if (e?.response?.status === 400 && typeof msg === 'string' && /data must be an object/i.test(msg)) {
            // Backend might expect top-level payload; retry unwrapped for compatibility
            const { data } = await api.post('/myskb/project/draft', cleaned, { headers: { 'Content-Type': 'application/json' } });
            return data;
        }
        throw e;
    }
};

// Submit project (final)
export const submitProject = async (payload: ProjectFormPayload) => {
    const cleaned = sanitizeProjectPayload(payload);
    const body = { data: cleaned };
    try {
        const { data } = await api.post('/myskb/project/submit', body, { headers: { 'Content-Type': 'application/json' } });
        return data;
    } catch (e: any) {
        const msg = e?.response?.data?.message;
        if (e?.response?.status === 400 && typeof msg === 'string' && /data must be an object/i.test(msg)) {
            const { data } = await api.post('/myskb/project/submit', cleaned, { headers: { 'Content-Type': 'application/json' } });
            return data;
        }
        throw e;
    }
};
