// utils/reference.ts
// Generate unique checkout references: PREFIX-YYYYMMDDHHmmss-SEQ
let seq = 0;
export const generateReference = (prefix = 'IXO') => {
    const now = new Date();
    const pad = (n: number, l = 2) => String(n).padStart(l, '0');
    const ts = [
        now.getFullYear(),
        pad(now.getMonth() + 1),
        pad(now.getDate()),
        pad(now.getHours()),
        pad(now.getMinutes()),
        pad(now.getSeconds())
    ].join('');
    seq = (seq + 1) % 10000; // roll over after 9999
    const seqStr = String(seq).padStart(4, '0');
    return `${prefix}-${ts}-${seqStr}`;
};

export const isLikelyDuplicateReference = (ref: string) => {
    // heuristic: structure PREFIX-14digits-4digits
    return !/^[A-Z0-9]{2,8}-\d{14}-\d{4}$/.test(ref);
};
