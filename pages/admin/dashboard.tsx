import React from 'react';
import SidebarLayout from '@/components/main/SidebarLayout';
import Heading from '@/components/forms/Heading';
import Spacing from '@/components/forms/Spacing';
import HyperText from '@/components/forms/HyperText';
import Button from '@/components/forms/Button';
import { useRouter } from 'next/router';

export default function AdminDashboard() {
  const router = useRouter();
  return (
    <SidebarLayout>
      <Heading level={3} align="left" bold>Admin Panel</Heading>
      <Spacing size="sm" />
      <HyperText>Manage users, reports, and document verifications.</HyperText>
      <Spacing size="md" />
      <div className="flex gap-3">
        <Button onClick={() => router.push('/admin/verifications')}>Document Verifications</Button>
        <Button variant="secondary" onClick={() => router.push('/admin/push-test')}>Push Notification Test</Button>
      </div>
    </SidebarLayout>
  );
}
