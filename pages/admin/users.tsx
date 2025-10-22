import { useEffect, useMemo, useState } from 'react';
import SidebarLayout from '@/components/main/SidebarLayout';
import Heading from '@/components/forms/Heading';
import Spacing from '@/components/forms/Spacing';
import InputText from '@/components/forms/InputText';
import Button from '@/components/forms/Button';
import SelectField from '@/components/forms/SelectField';
import { listUsers, updateUserRole } from '@/services/api';
import toast from 'react-hot-toast';

type UserRow = {
  id: number;
  email?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
};

const roleOptions = [
  { value: 'guest', label: 'Guest' },
  { value: 'personal', label: 'Personal' },
  { value: 'business', label: 'Business' },
  { value: 'consultant', label: 'Consultant' },
  { value: 'admin', label: 'Admin' },
  { value: 'superadmin', label: 'Super Admin' },
];

export default function AdminUsersPage() {
  const [rows, setRows] = useState<UserRow[]>([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);
  const [savingId, setSavingId] = useState<number | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      const { data, total: t } = await listUsers({ search, role: roleFilter || undefined, limit, offset: page * limit });
      const mapped = (Array.isArray(data) ? data : (data?.data || [])) as any[];
      const cleaned: UserRow[] = mapped.map((u) => ({
        id: Number(u.id),
        email: u.email || u.userEmail,
        name: u.name || u.fullName || u.full_name,
        firstName: u.firstName || u.first_name,
        lastName: u.lastName || u.last_name,
        role: u.role || u.userRole,
      }));
      setRows(cleaned);
      setTotal(typeof t === 'number' ? t : cleaned.length);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || e?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [page, limit]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil((total || 0) / limit)), [total, limit]);

  return (
    <SidebarLayout>
      <Heading level={3} align="left" bold>User Management</Heading>
      <Spacing size="sm" />

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
        <div className="sm:col-span-2">
          <InputText id="search" name="search" label="Search" placeholder="Name or Email" value={search}
            onChange={(e: any) => setSearch(e.target.value)} />
        </div>
        <div className="sm:col-span-1">
          <SelectField id="roleFilter" name="roleFilter" label="Role" options={[{ value: '', label: 'All' }, ...roleOptions]} value={roleFilter}
            onChange={(e: any) => setRoleFilter(e.target.value)} />
        </div>
        <div className="sm:col-span-1 flex gap-2">
          <Button onClick={() => { setPage(0); load(); }} loading={loading}>Filter</Button>
          <Button variant="secondary" onClick={() => { setSearch(''); setRoleFilter(''); setPage(0); load(); }}>Reset</Button>
        </div>
      </div>

      <Spacing size="md" />

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th className="px-4 py-2" />
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rows.map((u) => {
              const fullName = u.name || `${u.firstName || ''} ${u.lastName || ''}`.trim();
              return (
                <tr key={u.id}>
                  <td className="px-4 py-2 text-sm">{u.id}</td>
                  <td className="px-4 py-2 text-sm">{fullName || '-'}</td>
                  <td className="px-4 py-2 text-sm">{u.email || '-'}</td>
                  <td className="px-4 py-2 text-sm">
                    <SelectField id={`role-${u.id}`} name={`role-${u.id}`} label="" options={roleOptions} value={u.role || ''}
                      onChange={(e: any) => setRows((prev) => prev.map((r) => r.id === u.id ? { ...r, role: e.target.value } : r))} />
                  </td>
                  <td className="px-4 py-2 text-right">
                    <Button size="sm" loading={savingId === u.id} onClick={async () => {
                      try {
                        setSavingId(u.id);
                        await updateUserRole(u.id, rows.find(r => r.id === u.id)?.role || '');
                        toast.success('Role updated');
                        // If we updated the current logged-in user, update localStorage and broadcast change
                        const currentId = Number(localStorage.getItem('userId'));
                        if (currentId === u.id) {
                          try { localStorage.setItem('userRole', rows.find(r => r.id === u.id)?.role || ''); } catch {}
                          window.dispatchEvent(new Event('ixora:userchange'));
                        }
                      } catch (e: any) {
                        toast.error(e?.response?.data?.message || e?.message || 'Failed to update role');
                      } finally {
                        setSavingId(null);
                      }
                    }}>Save</Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Spacing size="md" />
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">Page {page + 1} of {totalPages}</div>
        <div className="flex gap-2">
          <Button variant="secondary" disabled={page <= 0} onClick={() => setPage((p) => Math.max(0, p - 1))}>Prev</Button>
          <Button variant="secondary" disabled={page + 1 >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
        </div>
      </div>
    </SidebarLayout>
  );
}
