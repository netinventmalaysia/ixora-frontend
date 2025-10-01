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

// ================= Assessment Tax =================
export interface AssessmentBill {
    id: string | number;
    bill_no: string;
    amount: number;
    due_date: string; // ISO or yyyy-mm-dd
    description?: string;
}

export interface AssessmentSearchParams {
    ic?: string;
    account_no?: string; // preferred param name
    bill_no?: string; // optional filter
    // legacy alias support from older UI
    assessment_no?: string;
}

// Fetch outstanding assessment bills by IC or assessment number
export const fetchAssessmentOutstanding = async (params: AssessmentSearchParams) => {
    const query: any = {};
    if (params.ic) query.ic = params.ic;
    const acct = params.account_no ?? params.assessment_no; // map legacy to preferred
    if (acct) { query.account_no = acct; query.accountNo = acct; }
    if (params.bill_no) { query.bill_no = params.bill_no; query.billNo = params.bill_no; }
    console.log('[API] GET /assessment/outstanding params:', query);
    const { data } = await api.get('/mbmb/public/api/assessment/outstanding', { params: query });
    return data as { data?: AssessmentBill[] } | AssessmentBill[];
};

// ================= Compound =================
export interface CompoundBill {
    id: string | number;
    bill_no: string;
    amount: number;
    due_date: string; // ISO or yyyy-mm-dd
    description?: string;
}

export interface CompoundSearchParams {
    ic?: string;
    compound_no?: string;
    vehicle_registration_no?: string; // optional filter
    // compatibility typo accepted from callers
    vehicel_registration_no?: string;
}

// Fetch outstanding compound by IC or compound number
export const fetchCompoundOutstanding = async (params: CompoundSearchParams) => {
    const query: any = {};
    if (params.ic) query.ic = params.ic;
    if (params.compound_no) { query.compound_no = params.compound_no; query.compoundNo = params.compound_no; }
    const vrn = params.vehicle_registration_no ?? params.vehicel_registration_no;
    if (vrn) { query.vehicle_registration_no = vrn; query.vehicleRegistrationNo = vrn; }
    console.log('[API] GET /compound/outstanding params:', query);
    const { data } = await api.get('/mbmb/public/api/compound/outstanding', { params: query });
    return data as { data?: CompoundBill[] } | CompoundBill[];
};

// ================= Booth Rental =================
export interface BoothBill {
    id: string | number;
    bill_no: string;
    amount: number;
    due_date: string;
    description?: string;
}

export interface BoothSearchParams {
    ic?: string;
    account_no?: string; // preferred
    // deprecated alias accepted from callers
    booth_no?: string;
}

export const fetchBoothOutstanding = async (params: BoothSearchParams) => {
    const query: any = {};
    if (params.ic) query.ic = params.ic;
    const acct = params.account_no ?? params.booth_no;
    if (acct) { query.account_no = acct; query.accountNo = acct; } // backend prefers account_no; booth_no is deprecated alias
    console.log('[API] GET /booth/outstanding params:', query);
    const { data } = await api.get('/mbmb/public/api/booth/outstanding', { params: query });
    return data as { data?: BoothBill[] } | BoothBill[];
};

// ================= Miscellaneous Bills =================
export interface MiscBill {
    id: string | number;
    bill_no: string;
    amount: number;
    due_date: string;
    description?: string;
}

export interface MiscSearchParams {
    ic?: string;
    account_no?: string; // preferred
    // legacy aliases accepted from callers; map to account_no
    misc_no?: string;
    bill_no?: string;
}

export const fetchMiscOutstanding = async (params: MiscSearchParams) => {
    const query: any = {};
    if (params.ic) query.ic = params.ic;
    const acct = params.account_no ?? params.misc_no ?? params.bill_no;
    if (acct) { query.account_no = acct; query.accountNo = acct; }
    console.log('[API] GET /misc/outstanding params:', query);
    const { data } = await api.get('/mbmb/public/api/misc/outstanding', { params: query });
    return data as { data?: MiscBill[] } | MiscBill[];
};

// ================= MySKB Project (Draft & Submit) =================
// NOTE: If your backend uses different paths, update these endpoints only.
export type ProjectFormPayload = Record<string, any>;

// Best-effort cleanup: remove empty strings and coerce simple numerics (excluding business_id which is handled separately)
const sanitizeProjectPayload = (src: ProjectFormPayload) => {
    const cleaned: Record<string, any> = {};
    const numericKeys = new Set([
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
        if (k === 'business_id' || k === 'businessId' || k === 'owner_id' || k === 'ownerId' || k === 'draft') continue; // handled separately
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
export const saveProjectDraft = async (payload: ProjectFormPayload, opts: { draftId?: number | string } = {}) => {
    const businessIdRaw = payload?.business_id ?? (payload as any)?.businessId;
    const business_id = Number(businessIdRaw);
    if (Number.isNaN(business_id)) {
        throw new Error('business_id is required and must be a number');
    }
    const ownerIdRaw = (payload as any)?.owner_id ?? (payload as any)?.ownerId;
    const owner_id = ownerIdRaw !== undefined ? Number(ownerIdRaw) : undefined;
    const cleaned = sanitizeProjectPayload(payload);
    const body: any = { business_id, data: cleaned };
    if (!Number.isNaN(owner_id!) && owner_id !== undefined) body.data.owner_id = owner_id;
    const draftId = opts?.draftId;
    if (draftId !== undefined && draftId !== null && String(draftId).length > 0) {
        try {
            const { data } = await api.put(`/myskb/project/draft/${draftId}`, body, { headers: { 'Content-Type': 'application/json' } });
            return data;
        } catch (e) {
            // Fallback to POST if PUT not supported
            const { data } = await api.post('/myskb/project/draft', { ...body, id: draftId }, { headers: { 'Content-Type': 'application/json' } });
            return data;
        }
    }
    const { data } = await api.post('/myskb/project/draft', body, { headers: { 'Content-Type': 'application/json' } });
    return data;
};

// Submit project (final)
export const submitProject = async (payload: ProjectFormPayload, opts: { draftId?: number | string } = {}) => {
    const businessIdRaw = payload?.business_id ?? (payload as any)?.businessId;
    const business_id = Number(businessIdRaw);
    if (Number.isNaN(business_id)) {
        throw new Error('business_id is required and must be a number');
    }
    const ownerIdRaw = (payload as any)?.owner_id ?? (payload as any)?.ownerId;
    const owner_id = ownerIdRaw !== undefined ? Number(ownerIdRaw) : undefined;
    const cleaned = sanitizeProjectPayload(payload);
    const body: any = { business_id, useDraft: false, data: cleaned };
    if (!Number.isNaN(owner_id!) && owner_id !== undefined) body.data.owner_id = owner_id;
    const draftId = opts?.draftId;
    if (draftId !== undefined && draftId !== null && String(draftId).length > 0) {
        // Prefer dedicated submit endpoint for an existing draft if available
        try {
            const { data } = await api.post(`/myskb/project/draft/${draftId}/submit`, body, { headers: { 'Content-Type': 'application/json' } });
            return data;
        } catch (e) {
            // Fallback: submit endpoint that accepts draft_id in body
            try {
                const { data } = await api.post('/myskb/project/submit', { ...body, draft_id: draftId, useDraft: true }, { headers: { 'Content-Type': 'application/json' } });
                return data;
            } catch (e2) {
                // Last resort: rethrow the original error
                throw e2;
            }
        }
    } else {
        const { data } = await api.post('/myskb/project/submit', body, { headers: { 'Content-Type': 'application/json' } });
        return data;
    }
};

// List project drafts for current user
export interface ProjectDraftListResponse {
    data: Array<{
        id: number | string;
        name?: string;
        projectTitle?: string;
        createdAt?: string;
        created_at?: string;
        updatedAt?: string;
        updated_at?: string;
        status?: string;
        [key: string]: any;
    }>;
    total?: number;
    limit?: number;
    offset?: number;
}

export const listProjectDrafts = async (params: { limit?: number; offset?: number } = {}): Promise<ProjectDraftListResponse> => {
    try {
        const { data } = await api.get('/myskb/project/draft', { params });
        if (Array.isArray(data)) return { data, total: data.length, limit: data.length, offset: 0 } as any;
        if (data && Array.isArray(data.data)) return data as ProjectDraftListResponse;
        return { data: [] };
    } catch (e: any) {
        // Fallback to generic listing endpoint with status filter if available
        try {
            const { data } = await api.get('/myskb/project', { params: { ...params, status: 'Draft' } });
            if (Array.isArray(data)) return { data, total: data.length, limit: data.length, offset: 0 } as any;
            if (data && Array.isArray(data.data)) return data as ProjectDraftListResponse;
        } catch { }
        return { data: [] };
    }
};

// Get a single draft by id and normalize into { id, business_id, data }
export const getProjectDraftById = async (id: number | string): Promise<{ id: number | string; business_id?: number; data: Record<string, any> }> => {
    const normalize = (raw: any): { id: number | string; business_id?: number; data: Record<string, any> } => {
        if (!raw) return { id, data: {} };
        const draftId = raw.id ?? id;
        const business_id = Number(raw.business_id ?? raw.businessId);
        // Heuristic: backend may store form fields under one of these keys
        const candidate = raw.data ?? raw.form_data ?? raw.payload ?? raw.content ?? raw.fields;
        let form: Record<string, any> = {};
        if (candidate && typeof candidate === 'object') {
            form = { ...candidate };
        } else if (raw && typeof raw === 'object') {
            // If the object itself looks like the form, pick likely keys (non-meta)
            const metaKeys = new Set(['id', 'createdAt', 'created_at', 'updatedAt', 'updated_at', 'status', 'business_id', 'businessId']);
            form = Object.fromEntries(Object.entries(raw).filter(([k]) => !metaKeys.has(k)));
        }
        // Ensure top-level defaults align with our form field names
        if (!Number.isNaN(business_id)) form.business_id = business_id;
        return { id: draftId, business_id: Number.isNaN(business_id) ? undefined : business_id, data: form };
    };

    // Try primary endpoint
    try {
        const { data } = await api.get(`/myskb/project/draft/${id}`);
        // Some backends wrap as { data }
        if (data && data.data && typeof data.data === 'object') return normalize(data.data);
        return normalize(data);
    } catch (e) {
        // Fallback 1: generic project by id (if drafts live together)
        try {
            const { data } = await api.get(`/myskb/project/${id}`);
            if (data && data.data && typeof data.data === 'object') return normalize(data.data);
            return normalize(data);
        } catch {
            // Fallback 2: list and find
            try {
                const list = await listProjectDrafts({ limit: 100, offset: 0 });
                const found = (list.data || []).find((d) => String(d.id) === String(id));
                if (found) return normalize(found);
            } catch { }
            return { id, data: {} };
        }
    }
};

// List submitted/active projects (non-drafts)
export interface ProjectListParams {
    status?: string | string[]; // e.g., 'Submitted' | 'Pending' | 'Rejected' | 'Complete'
    limit?: number;
    offset?: number;
}

export interface ProjectListResponse {
    data: Array<Record<string, any>>;
    total?: number;
    limit?: number;
    offset?: number;
}

export const listProjects = async (params: ProjectListParams = {}): Promise<ProjectListResponse> => {
    try {
        const { data } = await api.get('/myskb/project', { params });
        if (Array.isArray(data)) return { data, total: data.length, limit: data.length, offset: 0 } as any;
        if (data && Array.isArray(data.data)) return data as ProjectListResponse;
        return { data: [] };
    } catch (e) {
        // Fallback: return empty list on failure
        return { data: [] };
    }
};

// ================= PWA Push (Frontend helpers to call backend) =================
// These call your backend endpoints which should be implemented server-side.

// Get VAPID public key from backend
export const getPushPublicKey = async (): Promise<string | null> => {
    try {
        const { data } = await api.get('/push/public-key');
        // accept either { publicKey } or raw string
        const key = typeof data === 'string' ? data : data?.publicKey || data?.key || null;
        return (key && typeof key === 'string') ? key : null;
    } catch (e) {
        return null;
    }
};

// Save a browser subscription on server
export const savePushSubscription = async (
    subscription: PushSubscription | PushSubscriptionJSON,
    extras?: { userAgent?: string }
) => {
    const subJson = (typeof (subscription as any).toJSON === 'function') ? (subscription as any).toJSON() : subscription;
    // Prefer provided userAgent; otherwise try to read from browser
    const ua = extras?.userAgent ?? (typeof navigator !== 'undefined' ? navigator.userAgent : undefined);
    const body: any = { subscription: subJson };
    if (ua) body.userAgent = ua;
    const { data } = await api.post('/push/subscription', body, { headers: { 'Content-Type': 'application/json' } });
    return data; // expected: { id, status: 'ok' }
};

// Delete/unregister a subscription on server
export const deletePushSubscription = async (endpoint: string) => {
    // Prefer body payload; if backend expects query, adjust accordingly
    const { data } = await api.delete('/push/subscription', { data: { endpoint } });
    return data;
};

// Alternative: delete by stored id (if backend supports it)
export const deletePushSubscriptionById = async (id: number | string) => {
    const { data } = await api.delete('/push/subscription', { data: { id } });
    return data;
};

// List subscriptions (admin)
export const listPushSubscriptions = async (params: { userId?: number; limit?: number; offset?: number } = {}) => {
    const { data } = await api.get('/push/subscriptions', { params });
    return data;
};

// Admin-only: trigger a test push from server
export const sendAdminTestPush = async (payload: { title?: string; body?: string; url?: string; icon?: string; ttl?: number; all?: boolean; userId?: number; subscriptionId?: number | string } = {}) => {
    const { data } = await api.post('/push/test', payload);
    return data;
};

// Admin-only: generate VAPID key pair (save to vault and set envs on backend)
export const generatePushVapidKeys = async () => {
    const { data } = await api.post('/push/generate-keys');
    return data; // { publicKey, privateKey } or backend-specific shape
};
