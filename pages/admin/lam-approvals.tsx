import React, { useEffect, useState } from 'react';
import SidebarLayout from '@/components/main/SidebarLayout';
import Heading from '@/components/forms/Heading';
import Spacing from '@/components/forms/Spacing';
import LineSeparator from '@/components/forms/LineSeparator';
import Button from '@/components/forms/Button';
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import toast from 'react-hot-toast';
import { verifyLam } from '@/services/api';

export default function LamApprovalsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const pageSize = 20;
  const [total, setTotal] = useState<number | undefined>(undefined);
  const [status, setStatus] = useState<'Pending' | 'Approved' | 'Rejected'>('Pending');

  const fetchData = async () => {
    setLoading(true);
    try {
      const API = process.env.NEXT_PUBLIC_API_URL || '';
      const res = await fetch(`${API}/business/lam?status=${encodeURIComponent(status)}&limit=${pageSize}&offset=${page*pageSize}` , { credentials: 'include' });
      const data = await res.json();
      if (res.ok) {
        setItems(Array.isArray(data?.data) ? data.data : []);
        if (typeof data?.total === 'number') setTotal(data.total);
      } else {
        throw new Error(data?.message || 'Failed to load');
      }
    } catch (e:any) {
      console.error(e);
      toast.error(e?.message || 'Failed to load LAM approvals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [page, status]);

  const handlePreview = (b: any) => {
    const API = process.env.NEXT_PUBLIC_API_URL || '';
    const path = b?.lamDocumentPath || b?.lam_document_path;
    if (!path) {
      toast.error('No LAM document to preview');
      return;
    }
    const doubleSlash = String(path).startsWith('/') ? '' : '/';
    const url = `${API}/uploads/file/${doubleSlash}${encodeURI(path)}`;
    try { window.open(url, '_blank', 'noopener,noreferrer'); } catch {}
  };

  const onApprove = async (b: any) => {
    try {
      await verifyLam(b.id, 'Approved');
      toast.success('Approved');
      fetchData();
    } catch (e) {
      toast.error('Failed to approve');
    }
  };
  const onReject = async (b: any) => {
    try {
      await verifyLam(b.id, 'Rejected');
      toast.success('Rejected');
      fetchData();
    } catch (e) {
      toast.error('Failed to reject');
    }
  };

  return (
    <SidebarLayout>
      <Heading level={3} align="left" bold>
        LAM Approvals
      </Heading>
      <Spacing size="sm" />
      <LineSeparator />
      <Spacing size="sm" />

      <div className="flex items-center gap-2 mb-3">
        <label className="text-sm text-gray-700">Status:</label>
        <select className="border rounded px-2 py-1 text-sm" value={status} onChange={(e)=>setStatus(e.target.value as any)}>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      <div className="bg-white shadow rounded-lg p-6 overflow-x-auto">
        <Table>
          <TableCaption className="sr-only">LAM Approvals</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Registration No.</TableHead>
              <TableHead>LAM No.</TableHead>
              <TableHead>LAM Document</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(!loading && items.length === 0) && (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-gray-500">No records</TableCell>
              </TableRow>
            )}
            {items.map((b: any) => (
              <TableRow key={b.id}>
                <TableCell>{b.id}</TableCell>
                <TableCell>{b.companyName || b.name}</TableCell>
                <TableCell>{b.registrationNumber}</TableCell>
                <TableCell>{b.lamNumber || '-'}</TableCell>
                <TableCell>
                  {b.lamDocumentPath || b.lam_document_path ? (
                    <Button size="sm" variant="ghost" className="!px-2 !py-1" onClick={() => handlePreview(b)}>Preview</Button>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </TableCell>
                <TableCell>{b.lamStatus || '-'}</TableCell>
                <TableCell>{b.updatedAt || b.updated_at || '-'}</TableCell>
                <TableCell className="text-right">
                  <div className="inline-flex items-center gap-2">
                    <Button size="sm" disabled={b.lamStatus==='Approved'} onClick={() => onApprove(b)}>Approve</Button>
                    <Button size="sm" variant="danger" disabled={b.lamStatus==='Rejected'} onClick={() => onReject(b)}>Reject</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={8} className="flex items-center justify-between">
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
