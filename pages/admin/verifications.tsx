import React, { useEffect, useMemo, useState } from 'react';
import SidebarLayout from '@/components/main/SidebarLayout';
import Heading from '@/components/forms/Heading';
import Spacing from '@/components/forms/Spacing';
import LineSeparator from '@/components/forms/LineSeparator';
import Button from '@/components/forms/Button';
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { listPendingVerifications, processVerification, reviewVerification } from '@/services/api';
import toast from 'react-hot-toast';
import { EyeIcon } from '@heroicons/react/24/outline';

type Verification = any;

export default function AdminVerificationsPage() {
  const [items, setItems] = useState<Verification[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const pageSize = 20;
  const [total, setTotal] = useState<number | undefined>(undefined);

  const fetchData = async () => {
    setLoading(true);
    try {
  const resp = await listPendingVerifications({ limit: pageSize, offset: page * pageSize });
  setItems(Array.isArray(resp?.data) ? resp.data : []);
  if (typeof resp?.total === 'number') setTotal(resp.total);
    } catch (e) {
      console.error(e);
      toast.error('Failed to load verifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [page]);

  const handleReview = async (id: number, status: 'approved' | 'rejected') => {
    try {
      await reviewVerification(id, status);
      toast.success(`Verification ${status}`);
      fetchData();
    } catch (e) {
      toast.error('Failed to update verification');
    }
  };

  const handleProcess = async (id: number) => {
    try {
      await processVerification(id);
      toast.success('Processed');
      fetchData();
    } catch (e) {
      toast.error('Failed to process');
    }
  };

  const handlePreview = (v: any) => {
    const API = process.env.NEXT_PUBLIC_API_URL || '';
    const path = v?.upload?.path || (v?.upload?.folder && v?.upload?.filename ? `${v.upload.folder}/${v.upload.filename}` : undefined);
    if (!path) {
      toast.error('No document to preview');
      return;
    }
    // Build URL like: https://ixora-api.mbmb.gov.my/uploads/file//business/xxx.pdf
    const doubleSlash = path.startsWith('/') ? '' : '/';
    const url = `${API}/uploads/file/${doubleSlash}${encodeURI(path)}`;
    try { window.open(url, '_blank', 'noopener,noreferrer'); } catch {}
  };

  return (
    <SidebarLayout>
      <Heading level={3} align="left" bold>
        Document Verifications
      </Heading>
      <Spacing size="sm" />
      <LineSeparator />
      <Spacing size="sm" />

      <div className="bg-white shadow rounded-lg p-6 overflow-x-auto">
        <Table>
          <TableCaption className="sr-only">Pending Verifications</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Business</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(!loading && items.length === 0) && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-500">No pending verifications</TableCell>
              </TableRow>
            )}
            {items.map((v: any) => {
              const statusClass = v.status === 'NEEDS_REVIEW'
                ? 'bg-amber-50 text-amber-700 ring-amber-600/20'
                : v.status === 'APPROVED'
                ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
                : v.status === 'REJECTED'
                ? 'bg-rose-50 text-rose-700 ring-rose-600/20'
                : 'bg-gray-50 text-gray-700 ring-gray-600/20';
              return (
                <TableRow key={v.id}>
                  <TableCell>{v.id}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900">{v.business?.companyName || v.business?.name || v.businessId}</span>
                      <span className="text-xs text-gray-500">{v.business?.registrationNumber || '-'}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${statusClass}`}>{v.status}</span>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs text-gray-600">{v.updatedAt || v.updated_at || '-'}</div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <Button size="sm" variant="ghost" className="!px-2 !py-1" onClick={() => handlePreview(v)}>
                        <EyeIcon className="h-4 w-4 mr-1" /> Preview
                      </Button>
                      <Button size="sm" variant="secondary" className="!px-2 !py-1" onClick={() => handleProcess(v.id)}>Process</Button>
                      <Button size="sm" className="!px-2 !py-1" onClick={() => handleReview(v.id, 'approved')}>Approve</Button>
                      <Button size="sm" variant="danger" className="!px-2 !py-1" onClick={() => handleReview(v.id, 'rejected')}>Reject</Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={5} className="flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  {typeof total === 'number' ? (
                    (() => {
                      const start = page * pageSize + 1;
                      const end = Math.min(total, (page + 1) * pageSize);
                      return <span>Showing {start}-{end} of {total}</span>;
                    })()
                  ) : (
                    <span>Page {page + 1}</span>
                  )}
                </div>
                <div className="inline-flex items-center gap-2">
                  <Button size="sm" variant="secondary" disabled={page===0} onClick={() => setPage(p=>Math.max(0,p-1))}>Prev</Button>
                  <Button size="sm"
                    disabled={typeof total === 'number' ? ((page+1)*pageSize >= total) : (items.length < pageSize)}
                    onClick={() => setPage(p=>p+1)}
                  >Next</Button>
                </div>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </SidebarLayout>
  );
}
