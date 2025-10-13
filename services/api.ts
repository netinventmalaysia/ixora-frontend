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

// Attach CSRF token only for mutating requests (POST/PUT/PATCH/DELETE)
api.interceptors.request.use(async (config) => {
    const method = (config.method || 'get').toLowerCase();
    const needsCsrf = ['post', 'put', 'patch', 'delete'].includes(method);

    if (needsCsrf) {
        let token = sessionStorage.getItem(CSRF_TOKEN_KEY);
        if (!token) token = await fetchCsrfToken();
        if (token) {
            (config.headers as any)['x-csrf-token'] = token;
        }
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
                router.push('/login');
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

// Fetch the currently authenticated user (alternative to email search)

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

// Billing status & receipt helpers (frontend assumptions until backend finalized)
// Normalize various backend shapes to a single FE-friendly structure used by the UI
// Final shape: { reference, status: 'pending' | 'success' | 'failed', amount?, paid_at?, receipt_no?, bills?: [...], gateway? }
const normalizeBillingStatus = (raw: any, fallbackRef?: string) => {
    // Some endpoints return { data: {...} }, others return the object directly
    const src = raw?.data?.data ?? raw?.data ?? raw;
    const ref = src?.reference || fallbackRef;

    // Map backend status to FE status
    const srcStatus: string = (src?.status || '').toString().toUpperCase();
    const gwStatus: string = (src?.gatewayStatus || src?.gateway_status || '').toString().toUpperCase();
    let status: 'pending' | 'success' | 'failed' = 'pending';
    if (srcStatus === 'PAID' || srcStatus === 'SUCCESS' || gwStatus === '00') status = 'success';
    else if (srcStatus === 'FAILED' || srcStatus === 'REJECTED' || gwStatus === '99') status = 'failed';

    // Amounts and timestamps (backend might use strings)
    const amount = src?.paidAmount || src?.totalAmount || src?.amount;
    const paid_at = src?.paidAt || src?.paid_at || null;
    const receipt_no = src?.receiptNo || src?.receipt_no || null;

    // Bills/items normalization
    let bills: Array<{ bill_no?: string; account_no?: string; item_type?: string; amount?: number }> = [];
    if (Array.isArray(src?.bills)) {
        bills = src.bills.map((b: any) => ({
            // Priority: bill_no > no_bil (assessment/booth) > nokmp (compound) > no_rujukan (misc) > order_no
            bill_no: b.bill_no || b.no_bil || b.nokmp || b.no_rujukan || b.order_no || b.orderNo || undefined,
            account_no: b.account_no || b.accountNo || undefined,
            item_type: b.item_type || b.itemType || undefined,
            amount: typeof b.amount === 'string' ? Number(b.amount) : b.amount,
        }));
    } else if (Array.isArray(src?.items)) {
        bills = src.items.map((it: any) => ({
            // Priority: bill_no > no_bil (assessment/booth) > nokmp (compound) > no_rujukan (misc) > order_no
            bill_no: it.bill_no || it.no_bil || it.nokmp || it.no_rujukan || it.order_no || undefined,
            account_no: it.account_no || undefined,
            item_type: it.item_type || undefined,
            amount: typeof it.amount === 'string' ? Number(it.amount) : it.amount,
        }));
    }

    const gateway = src?.gateway || {};
    const normalizedGateway = {
        ...gateway,
        transaction_id: src?.paymentGatewayTransactionId || src?.gatewayTransactionId || gateway?.transaction_id || undefined,
    };
    const result = {
        reference: ref,
        status,
        amount: typeof amount === 'string' ? Number(amount) : amount,
        paid_at,
        receipt_no,
        bills,
        gateway: Object.keys(normalizedGateway).length ? normalizedGateway : null,
        // keep raw available for debugging if needed
        _raw: src,
    };
    return result;
};

// Fetch a single billing/checkout status by reference.
export const fetchBillingStatus = async (reference: string) => {
    if (!reference) throw new Error('Missing reference');
    try {
        // Preferred endpoint if available
        const { data } = await api.get('/billings/status', { params: { reference } });
        return normalizeBillingStatus(data, reference);
    } catch (e) {
        // Fallback: attempt generic /billings/:reference (observed in production)
        try {
            const { data } = await api.get(`/billings/${reference}`);
            return normalizeBillingStatus(data, reference);
        } catch {
            throw e;
        }
    }
};

// Fetch receipt details (could be same as status if backend merges them). Endpoint guess: /billings/receipt?reference=REF
export const fetchBillingReceipt = async (reference: string) => {
    if (!reference) throw new Error('Missing reference');
    try {
        const { data } = await api.get('/billings/receipt', { params: { reference } });
        // If the receipt endpoint mirrors the status payload, normalize so UI can reuse fields
        return normalizeBillingStatus(data, reference);
    } catch (e) {
        // Fallback to fetching the same resource; some backends expose only one endpoint
        try {
            const { data } = await api.get(`/billings/${reference}`);
            return normalizeBillingStatus(data, reference);
        } catch {
            // Allow caller to ignore missing receipt
            return null;
        }
    }
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
export const getMySkbAccess = async (params?: { business_id?: number }): Promise<MySkbAccess> => {
    try {
        const { data } = await api.get('/myskb/ownership/access', { params });
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

// Lookup billing items by bill_no to determine if a bill has already been paid
export interface BillingItemRecord {
    id: number | string;
    reference?: string;
    billing_status?: string; // overall billing status for the reference
    order_no?: string;
    item_type?: string;
    account_no?: string;
    bill_no?: string;
    amount?: number | string;
    status?: string; // item status e.g., 'PAID'
    createdAt?: string;
    updatedAt?: string;
}

export const fetchBillingItemsByBillNo = async (bill_no: string): Promise<BillingItemRecord[]> => {
    if (!bill_no) return [];
    try {
        const { data } = await api.get('/billings/items/by-bill-no', { params: { bill_no } });
        const list = data?.data ?? data;
        return Array.isArray(list) ? list : [];
    } catch {
        return [];
    }
};

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
    account_no?: string;
    bill_no?: string; // optional narrowing
}

// Fetch outstanding assessment bills by IC or assessment number
export const fetchAssessmentOutstanding = async (params: AssessmentSearchParams) => {
    const query: any = {};
    // Backend expects columnName + columnValue style (assuming based on provided URL) OR simple ic/account search. We'll support both.
    if (params.ic) { query.columnName = 'no_kp'; query.columnValue = params.ic; }
    else if (params.account_no) { query.columnName = 'no_akaun'; query.columnValue = params.account_no; }
    else if (params.bill_no) { query.columnName = 'no_bil'; query.columnValue = params.bill_no; }
    if (typeof window !== 'undefined') console.log('[API] GET /assessment-tax params:', query);
    let primaryErr: any = null;
    let data: any;
    try {
        ({ data } = await api.get('/mbmb/public/api/assessment-tax', { params: query }));
    } catch (e) {
        primaryErr = e;
        if (typeof window !== 'undefined') console.warn('[API][Assessment] /assessment-tax failed, trying /assessment/outstanding fallback');
    }
    // If primary failed OR returned empty, fallback to original endpoint using simpler param style
    let raw: any[] = [];
    if (data) {
        raw = (data && Array.isArray(data.data)) ? data.data : Array.isArray(data) ? data : [];
    }
    if ((!raw || raw.length === 0) && primaryErr) {
        // Build fallback params: old endpoint appears to accept no_kp, account_no, bill_no directly
        const fallbackParams: any = {};
        if (params.ic) fallbackParams.no_kp = params.ic;
        else if (params.account_no) fallbackParams.account_no = params.account_no;
        else if (params.bill_no) fallbackParams.bill_no = params.bill_no;
        if (typeof window !== 'undefined') console.log('[API][Assessment] Fallback /assessment/outstanding params:', fallbackParams);
        try {
            const fallbackRes = await api.get('/mbmb/public/api/assessment/outstanding', { params: fallbackParams });
            const fd = fallbackRes.data;
            raw = (fd && Array.isArray(fd.data)) ? fd.data : Array.isArray(fd) ? fd : [];
        } catch (fallbackErr) {
            if (typeof window !== 'undefined') console.error('[API][Assessment] Fallback also failed:', fallbackErr);
            throw primaryErr; // rethrow original
        }
    }
    if (typeof window !== 'undefined') {
        try { console.log('[API][Assessment] full response (chosen):', JSON.parse(JSON.stringify(data || raw))); } catch { console.log('[API][Assessment] full response (chosen raw):', data || raw); }
    }
    const mapped: AssessmentBill[] = raw.map((item: any, idx: number) => {
        // Support already-normalized shape
        if (item && item.id && item.bill_no && item.amount !== undefined && item.due_date) {
            return {
                id: item.id,
                bill_no: item.bill_no,
                amount: Number(item.amount) || 0,
                due_date: item.due_date,
                description: item.description || item.nama || item.seksyen || item.alamat1 || undefined,
            };
        }
        const amountRaw = item.jumlah ?? item.cukai ?? item.cukai_sepenggal ?? item.amount;
        const amountNum = Number(amountRaw);
        return {
            id: item.no_akaun || item.id || idx,
            bill_no: item.no_bil || item.bill_no || '',
            amount: Number.isNaN(amountNum) ? 0 : amountNum,
            due_date: item.trk_end_bayar || item.trk_bil || item.due_date || '',
            description: item.nama || item.seksyen || item.alamat1 || undefined,
        };
    });
    if (typeof window !== 'undefined') console.log('[API][Assessment] mapped sample:', mapped[0]);
    return mapped;
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
    // also accept camelCase from callers and normalize
    compoundNo?: string;
    vehicle_registration_no?: string;
    vehicel_registration_no?: string; // compatibility
    vehicleRegistrationNo?: string; // camelCase acceptance
}

// Fetch outstanding compound by IC or compound number
export const fetchCompoundOutstanding = async (params: CompoundSearchParams) => {
    const query: any = {};
    if (params.ic) query.ic = params.ic;
    const compound = params.compound_no ?? params.compoundNo;
    if (!params.ic && compound) { query.compound_no = compound; query.compoundNo = compound; }
    const vrn = params.vehicle_registration_no ?? params.vehicel_registration_no ?? params.vehicleRegistrationNo;
    if (vrn) { query.vehicle_registration_no = vrn; query.vehicleRegistrationNo = vrn; }
    if (typeof window !== 'undefined') { console.log('[API] GET /compound/outstanding params:', query); }
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
    booth_no?: string; // deprecated alias
}

export const fetchBoothOutstanding = async (params: BoothSearchParams) => {
    const query: any = {};
    if (params.ic) query.ic = params.ic;
    const acct = params.account_no ?? params.booth_no;
    if (!params.ic && acct) query.account_no = acct;
    if (typeof window !== 'undefined') console.log('[API] GET /booth/outstanding params:', query);
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
    misc_no?: string; // legacy alias
    bill_no?: string; // legacy alias
}

export const fetchMiscOutstanding = async (params: MiscSearchParams) => {
    const query: any = {};
    if (params.ic) query.ic = params.ic;
    const acct = params.account_no ?? params.misc_no ?? params.bill_no;
    if (!params.ic && acct) query.account_no = acct;
    if (typeof window !== 'undefined') console.log('[API] GET /misc/outstanding params:', query);
    const { data } = await api.get('/mbmb/public/api/misc/outstanding', { params: query });
    if (typeof window !== 'undefined') {
        // Log the ENTIRE backend response shape once so we can verify wrapper keys
        try {
            console.log('[API][Misc] full response object:', JSON.parse(JSON.stringify(data)));
        } catch {
            console.log('[API][Misc] full response object (raw):', data);
        }
    }
    // Expected shape: { data: [...] } where each item may use backend field names (no_akaun, trk_bil, jumlah, amaun_bil, catitan1,...)
    const raw = (data && Array.isArray(data.data)) ? data.data : Array.isArray(data) ? data : [];
    if (typeof window !== 'undefined') {
        console.log('[API][Misc] raw sample:', raw[0]);
    }
    const mapped: MiscBill[] = raw.map((item: any, idx: number) => {
        // If backend already normalized (id, bill_no, amount, due_date, description) just reuse directly.
        const already = item && (item.bill_no || item.billNo) && (('description' in item) || item.trk_bil || item.due_date || item.dueDate);
        const amountRaw = item.amount ?? item.jumlah ?? item.amaun_bil;
        const amountNum = Number(amountRaw);
        const id = item.id ?? item.no_akaun ?? item.bill_no ?? item.billNo ?? item.no_rujukan ?? idx;
        const bill_no = item.bill_no ?? item.billNo ?? item.no_akaun ?? item.no_rujukan ?? '';
        const due_date = item.due_date ?? item.dueDate ?? item.trk_bil ?? '';
        const description = item.description ?? item.catitan1 ?? item.catitan2 ?? item.nama ?? undefined;
        if (already && item.description === undefined && (item.catitan1 || item.catitan2 || item.nama)) {
            // edge: was normalized except description key; this branch unlikely but kept for visibility
            if (typeof window !== 'undefined') console.warn('[API][Misc] description missing on normalized item; using fallback fields');
        }
        return {
            id,
            bill_no,
            amount: Number.isNaN(amountNum) ? 0 : amountNum,
            due_date,
            description,
        };
    });
    if (typeof window !== 'undefined') {
        console.log('[API][Misc] mapped sample:', mapped[0]);
        console.log('[API][Misc] total mapped:', mapped.length);
    }
    // Return array directly for simpler consumption
    return mapped;
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
        // handled separately or must remain top-level
        if (
            k === 'business_id' || k === 'businessId' ||
            k === 'owner_id' || k === 'ownerId' ||
            k === 'draft' ||
            k === 'owners_user_ids' || k === 'ownersUserIds' ||
            k === 'useDraft' || k === 'draft_id' || k === 'draftId'
        ) continue;
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
    const ownersRaw = (payload as any)?.owners_user_ids ?? (payload as any)?.ownersUserIds;
    const normalizeOwners = (raw: any): number[] | undefined => {
        if (raw === undefined || raw === null || raw === '') return undefined;
        if (Array.isArray(raw)) {
            const arr = raw.map((x) => Number(typeof x === 'string' ? x.trim() : x)).filter((n) => !Number.isNaN(n));
            return arr.length ? arr : undefined;
        }
        if (typeof raw === 'string') {
            const s = raw.trim();
            try {
                const parsed = JSON.parse(s);
                if (Array.isArray(parsed)) {
                    const arr = parsed.map((x: any) => Number(typeof x === 'string' ? x.trim() : x)).filter((n: any) => !Number.isNaN(n));
                    return arr.length ? arr : undefined;
                }
            } catch {}
            const arr = s.split(',').map((t) => Number(t.trim())).filter((n) => !Number.isNaN(n));
            return arr.length ? arr : undefined;
        }
        return undefined;
    };
    const cleaned = sanitizeProjectPayload(payload);
    const body: any = { business_id, data: cleaned };
    if (!Number.isNaN(owner_id!) && owner_id !== undefined) body.data.owner_id = owner_id;
    const owners_user_ids = normalizeOwners(ownersRaw);
    if (owners_user_ids) body.owners_user_ids = owners_user_ids;
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
    const ownersRaw = (payload as any)?.owners_user_ids ?? (payload as any)?.ownersUserIds;
    const normalizeOwners = (raw: any): number[] | undefined => {
        if (raw === undefined || raw === null || raw === '') return undefined;
        if (Array.isArray(raw)) {
            const arr = raw.map((x) => Number(typeof x === 'string' ? x.trim() : x)).filter((n) => !Number.isNaN(n));
            return arr.length ? arr : undefined;
        }
        if (typeof raw === 'string') {
            const s = raw.trim();
            try {
                const parsed = JSON.parse(s);
                if (Array.isArray(parsed)) {
                    const arr = parsed.map((x: any) => Number(typeof x === 'string' ? x.trim() : x)).filter((n: any) => !Number.isNaN(n));
                    return arr.length ? arr : undefined;
                }
            } catch {}
            const arr = s.split(',').map((t) => Number(t.trim())).filter((n) => !Number.isNaN(n));
            return arr.length ? arr : undefined;
        }
        return undefined;
    };
    const cleaned = sanitizeProjectPayload(payload);
    const body: any = { business_id, useDraft: false, data: cleaned };
    if (!Number.isNaN(owner_id!) && owner_id !== undefined) body.data.owner_id = owner_id;
    const owners_user_ids = normalizeOwners(ownersRaw);
    if (owners_user_ids) body.owners_user_ids = owners_user_ids;
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

// ================= Outstanding Bills Checkout =================
export interface CheckoutBillPayload {
    account_no: string; // derived from bill.id or meta
    item_type: string;  // MBMB jenis code
    amount: number;     // > 0
    bill_no?: string;   // optional
}

export interface CheckoutOutstandingDto {
    reference: string;
    businessId?: number;
    userId?: number;
    billName: string;
    billEmail: string;
    billMobile: string;
    billDesc: string;
    bills: CheckoutBillPayload[];
}

export interface CheckoutResponse {
    data: { reference: string; url?: string | null };
}

export const checkoutOutstandingBills = async (payload: CheckoutOutstandingDto): Promise<CheckoutResponse> => {
    // basic client-side validation
    if (!payload?.reference) throw new Error('Missing reference');
    if (!Array.isArray(payload.bills) || payload.bills.length === 0) throw new Error('No bills selected');
    payload.bills.forEach((b, idx) => {
        if (!b.account_no) throw new Error('Bill missing account_no at index ' + idx);
        if (!b.item_type) throw new Error('Bill missing item_type at index ' + idx);
        if (typeof b.amount !== 'number' || b.amount <= 0) throw new Error('Invalid amount for bill at index ' + idx);
    });
    if (typeof window !== 'undefined') {
        let cloned: any = null;
        try { cloned = JSON.parse(JSON.stringify(payload)); } catch { cloned = { shallow: { ...payload, bills: `[len:${payload.bills.length}]` } }; }
        console.log('[API][Checkout] full payload debug:', cloned);
        console.log('[API][Checkout] bills length:', payload.bills.length, 'reference:', payload.reference);
        console.log('[API][Checkout] first bill sample:', payload.bills[0]);
    }
    const { data } = await api.post('/billings/checkout', payload);
    if (typeof window !== 'undefined') console.log('[API][Checkout] response:', data);
    return data as CheckoutResponse;
};
