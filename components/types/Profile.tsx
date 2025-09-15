export type Profile = {
    name: string;
    email: string;
    role?: string;
    project?: string;
    imageUrl: string;
    href?: string;
    lastSeen?: string | null;
    lastSeenDateTime?: string;
    status?: 'Pending' | 'Approved' | 'Rejected';
    createdAt?: string;
};
