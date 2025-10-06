import SidebarLayout from '@/components/main/SidebarLayout';
import Heading from 'todo/components/forms/Heading';
import Spacing from 'todo/components/forms/Spacing';
import Hyperlink from 'todo/components/forms/Hyperlink';
import { useEffect, useState } from 'react';

export default function PaymentStatusPage() {
  const [reference, setReference] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('pending');

  useEffect(() => {
    // If gateway redirects with ?ref=... we capture it
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const ref = params.get('ref') || params.get('reference');
      if (ref) setReference(ref);
      // Placeholder: real implementation would poll a /billings/status?reference=REF endpoint
      // For now we just leave it as 'pending' and instruct user.
    }
  }, []);

  return (
    <SidebarLayout>
      <div className="w-full max-w-xl mx-auto py-10">
        <Heading level={2} align="left" bold>Payment Status</Heading>
        <Spacing size="md" />
        <p className="text-sm text-gray-700 dark:text-gray-300">This is a temporary page while real payment status retrieval is being integrated.</p>
        <Spacing size="sm" />
        <ul className="list-disc pl-5 text-sm space-y-1 text-gray-700 dark:text-gray-300">
          <li>If you completed payment, you should receive an email receipt shortly.</li>
          <li>You may safely close this page or return to the dashboard.</li>
          <li>Once the status API is available, this page will auto-refresh and display success / failed states.</li>
        </ul>
        <Spacing size="md" />
        {reference && <p className="text-xs text-gray-500">Reference: <span className="font-mono">{reference}</span></p>}
        <p className="text-xs text-gray-500">Current status: {status}</p>
        <Spacing size="lg" />
        <div className="flex gap-4">
          <Hyperlink href="/dashboard" bold inline>Return to Dashboard</Hyperlink>
          <Hyperlink href="/" inline>Home</Hyperlink>
        </div>
      </div>
    </SidebarLayout>
  );
}
