import { useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import Heading from '../forms/Heading';
import Spacing from '../forms/Spacing';
import LayoutWithoutSidebar from '../main/LayoutWithoutSidebar';
import SelectField from '../forms/SelectField';
import InputText from '../forms/InputText';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Button from '../forms/Button';
import ProfileRow from '../forms/ProfileRow';
import ProfileActionMenu from '../forms/ProfileActionMenu';
import { Profile } from '@/components/types/Profile';
import toast from 'react-hot-toast';
import { inviteOwnership, listOwnerships, removeOwnership, updateOwnership, fetchMyBusinesses } from '@/services/api';
import FilterTabs from '../forms/FilterTabs';
import { Tab } from '../forms/Tab';

export default function Ownership() {
    const methods = useForm();
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [currentTab, setCurrentTab] = useState<string>('All');
    const [businessId, setBusinessId] = useState<number | null>(null);
    const [ownerIdByEmail, setOwnerIdByEmail] = useState<Record<string, number>>({});
    const [businessOptions, setBusinessOptions] = useState<{ value: number; label: string }[]>([]);

    // Normalize API error into a readable string for toasts
    const getErrMsg = (err: any, fallback = 'Something went wrong') => {
        const src = err?.response?.data?.message ?? err?.message ?? err;
        if (!src) return fallback;
        if (typeof src === 'string') return src;
        // Handle NestJS-like { message: string[] }
        if (Array.isArray(src)) return src.join(', ');
        if (typeof src?.message === 'string') return src.message;
        if (Array.isArray(src?.message)) return src.message.join(', ');
        try {
            const s = JSON.stringify(src);
            return s.length > 200 ? fallback : s;
        } catch {
            return fallback;
        }
    };

    // Dynamic tab counts from current profiles
    const tabOptions = useMemo<Tab[]>(() => {
        const pending = profiles.filter((p) => p.status === 'Pending').length;
        const approved = profiles.filter((p) => p.status === 'Approved').length;
        return [
            { name: 'All', href: '#' },
            { name: 'Request', href: '#', badge: String(pending), badgeColor: 'yellow' },
            { name: 'Approved', href: '#', badge: String(approved), badgeColor: 'green' },
        ];
    }, [profiles]);

    // Load ownerships when business changes
    useEffect(() => {
        if (!businessId) return;
        listOwnerships({ business_id: businessId, limit: 50, offset: 0 })
            .then(({ data }) => {
                const idMap: Record<string, number> = {};
                const mapped: Profile[] = (data || []).map((o: any) => {
                    if (o?.email && typeof o?.id === 'number') idMap[String(o.email).toLowerCase()] = o.id;
                    return {
                        name: o.name || o.email,
                        email: o.email,
                        role: o.role || undefined,
                        project: o.project || undefined,
                        imageUrl: o.avatar_url || 'https://avatars.githubusercontent.com/u/0?v=4',
                        lastSeen: o.last_seen_iso ? 'recently' : null,
                        lastSeenDateTime: o.last_seen_iso || undefined,
                        status: o.status,
                        createdAt: o.created_at,
                    } as Profile;
                });
                setProfiles(mapped);
                setOwnerIdByEmail(idMap);
            })
            .catch((e: any) => toast.error(getErrMsg(e, 'Failed to load owners')));
    }, [businessId]);

    // Load businesses for select (exclude withdrawn)
    useEffect(() => {
        fetchMyBusinesses()
            .then((data: any) => {
                if (!data || (Array.isArray(data) && data.length === 0)) return;
                const isWithdrawn = (item: any) => {
                    const direct = item && (item.status || item.state || item.applicationStatus || item.statusName || item.currentStatus || item.application_status || item.status_name || item.current_status);
                    if (typeof direct === 'string') {
                        return String(direct).toLowerCase() === 'withdrawn';
                    }
                    for (const [k, v] of Object.entries(item || {})) {
                        if (typeof v === 'string' && /withdrawn/i.test(String(v))) return true;
                    }
                    return false;
                };
                const options = (data as any[])
                    .filter((biz) => !isWithdrawn(biz))
                    .map((biz) => ({ value: biz.id, label: biz.name || biz.companyName || `#${biz.id}` }));
                setBusinessOptions(options);
            })
            .catch((err: any) => {
                console.error('Failed to fetch businesses for ownership select', err);
                toast.error('Failed to load your businesses');
            });
    }, []);

    const filteredProfiles = useMemo(() => {
        const arr = profiles.filter((profile) => {
            if (currentTab === 'All') return true;
            if (currentTab === 'Request') return profile.status === 'Pending';
            if (currentTab === 'Approved') return profile.status === 'Approved';
            return false;
        });
        return arr.sort((a, b) => {
            const rank = (s?: string) => (s === 'Pending' ? 0 : s === 'Approved' ? 1 : 2);
            const rA = rank(a.status);
            const rB = rank(b.status);
            if (rA !== rB) return rA - rB;
            const tA = (a.createdAt || a.lastSeenDateTime) ? new Date(a.createdAt || a.lastSeenDateTime!).getTime() : 0;
            const tB = (b.createdAt || b.lastSeenDateTime) ? new Date(b.createdAt || b.lastSeenDateTime!).getTime() : 0;
            return tB - tA; // newest first
        });
    }, [profiles, currentTab]);

    async function doSearch(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): Promise<void> {
        event.preventDefault();
        const email = String(methods.getValues('search') || '').trim();
        if (!email) {
            toast('Enter an email to invite');
            return;
        }
        if (!businessId) {
            toast('Select a business first');
            return;
        }
        try {
            const res = await inviteOwnership({ business_id: businessId, email });
            const o = res.created;
            const item: Profile = {
                name: o.name || o.email,
                email: o.email,
                role: o.role || undefined,
                project: o.project || undefined,
                imageUrl: o.avatar_url || 'https://avatars.githubusercontent.com/u/0?v=4',
                lastSeen: o.last_seen_iso ? 'recently' : null,
                lastSeenDateTime: o.last_seen_iso || undefined,
                status: o.status,
                createdAt: o.created_at,
            };
            setProfiles((prev) => {
                const exists = prev.find((p) => p.email.toLowerCase() === item.email.toLowerCase());
                return exists ? prev.map((p) => (p.email.toLowerCase() === item.email.toLowerCase() ? item : p)) : [item, ...prev];
            });
            if (typeof o?.id === 'number' && o?.email) {
                setOwnerIdByEmail((m) => ({ ...m, [String(o.email).toLowerCase()]: o.id }));
            }
            if (res.user_exists) {
                toast.success('User linked. Application-only access granted.');
            } else if (res.invited) {
                toast.success('Invitation email sent.');
            } else {
                toast.success('Invite processed.');
            }
        } catch (e: any) {
            toast.error(getErrMsg(e, 'Failed to invite'));
        }
    }

    return (
        <FormProvider {...methods}>
            <LayoutWithoutSidebar shiftY="-translate-y-0">
                <Heading level={5} align="left" bold>
                    Project Ownership Management
                </Heading>
                <Spacing size="lg" />
                <SelectField
                    id="businessName"
                    name="businessName"
                    label="Business Name"
                    options={businessOptions}
                    onChange={(e) => setBusinessId(Number(e.target.value))}
                />
                <Spacing size="lg" />

                <InputText
                    id="search"
                    name="search"
                    label="Add project owner"
                    type="email"
                    placeholder="Search by registered email address"
                    icon={MagnifyingGlassIcon}
                    rightElement={
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="bg-transparent shadow-none px-3 py-1 text-sm text-indigo-600 hover:bg-indigo-50"
                            onClick={doSearch}
                        >
                            Invite
                        </Button>
                    }
                />

                <Spacing size="lg" />
                <FilterTabs tabs={tabOptions} currentTab={currentTab} onTabChange={(tab) => setCurrentTab(tab.name)} />

                <ProfileRow
                    profile={filteredProfiles}
                    onlineLabel={currentTab === 'Request' ? 'Pending' : undefined}
                    actions={(profile) => (
                        <ProfileActionMenu
                            profile={profile}
                            actions={[
                                ...(profile.status === 'Pending'
                                    ? [
                                            {
                                                label: 'Approve',
                                                onClick: async () => {
                                                    const id = ownerIdByEmail[profile.email.toLowerCase()];
                                                    if (!id) {
                                                        toast.error('Missing ownership id');
                                                        return;
                                                    }
                                                    try {
                                                        await updateOwnership(id, { status: 'Approved' });
                                                        setProfiles((prev) =>
                                                            prev.map((p) =>
                                                                p.email.toLowerCase() === profile.email.toLowerCase() ? { ...p, status: 'Approved' } : p,
                                                            ),
                                                        );
                                                        toast.success('Approved');
                                                    } catch (e: any) {
                                                        toast.error(getErrMsg(e, 'Failed to approve'));
                                                    }
                                                },
                                            },
                                        ]
                                    : []),
                                {
                                    label: 'Remove',
                                    onClick: async () => {
                                        const id = ownerIdByEmail[profile.email.toLowerCase()];
                                        if (!id) {
                                            toast.error('Missing ownership id');
                                            return;
                                        }
                                        try {
                                            await removeOwnership(id);
                                            setProfiles((prev) => prev.filter((p) => p.email.toLowerCase() !== profile.email.toLowerCase()));
                                            setOwnerIdByEmail((m) => {
                                                const n = { ...m };
                                                delete n[profile.email.toLowerCase()];
                                                return n;
                                            });
                                            toast.success('Removed');
                                        } catch (e: any) {
                                            toast.error(getErrMsg(e, 'Failed to remove'));
                                        }
                                    },
                                    danger: true,
                                },
                            ]}
                        />
                    )}
                />
            </LayoutWithoutSidebar>
        </FormProvider>
    );
}