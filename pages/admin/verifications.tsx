import React, { useEffect, useMemo, useState } from 'react';
import SidebarLayout from '@/components/main/SidebarLayout';
import Heading from '@/components/forms/Heading';
import Spacing from '@/components/forms/Spacing';
import LineSeparator from '@/components/forms/LineSeparator';
import Button from '@/components/forms/Button';
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { listPendingVerifications, processVerification, reviewVerification } from '@/services/api';
import toast from 'react-hot-toast';

type Verification = any;

export default function AdminVerificationsPage() {
  const [items, setItems] = useState<Verification[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const pageSize = 20;

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await listPendingVerifications({ limit: pageSize, offset: page * pageSize });
      setItems(Array.isArray(data) ? data : []);
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
            {items.map((v: any) => (
              <TableRow key={v.id}>
                <TableCell>{v.id}</TableCell>
                <TableCell>{v.business?.name || v.business_id}</TableCell>
                <TableCell className="capitalize">{v.status}</TableCell>
                <TableCell>{v.updatedAt || v.updated_at || '-'}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button size="sm" onClick={() => handleProcess(v.id)}>Process</Button>
                  <Button size="sm" variant="secondary" onClick={() => handleReview(v.id, 'approved')}>Approve</Button>
                  <Button size="sm" variant="danger" onClick={() => handleReview(v.id, 'rejected')}>Reject</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={5} className="text-right space-x-2">
                <Button size="sm" variant="secondary" disabled={page===0} onClick={() => setPage(p=>Math.max(0,p-1))}>Prev</Button>
                <Button size="sm" onClick={() => setPage(p=>p+1)}>Next</Button>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </SidebarLayout>
  );
}
