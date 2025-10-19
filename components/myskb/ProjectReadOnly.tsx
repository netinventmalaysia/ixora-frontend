import React from 'react';
import FormSectionHeader from '@/components/forms/FormSectionHeader';
import FormRow from '@/components/forms/FormRow';
import LineSeparator from '@/components/forms/LineSeparator';

type OwnerInfo = { name?: string; email?: string; user_id?: number };

type Props = {
  data: Record<string, any>;
};

const Field: React.FC<{ label: string; value?: React.ReactNode; colSpan?: string }> = ({ label, value, colSpan = 'sm:col-span-3' }) => (
  <div className={`w-full ${colSpan}`}>
    <div className="text-xs text-gray-500">{label}</div>
    <div className="mt-1 text-sm text-gray-900 break-words">{value ?? '—'}</div>
  </div>
);

const formatAddress = (d: any) => {
  const parts = [d?.address, d?.city, d?.state, d?.postalcode].filter(Boolean);
  return parts.length ? parts.join(', ') : '—';
};

const currency = (n: any) => {
  const v = Number(n);
  if (Number.isNaN(v)) return '—';
  return `RM ${v.toFixed(2)}`;
};

const humanize = (s?: string) => {
  if (!s) return '—';
  return s
    .toString()
    .replace(/[_\s]+/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

const StatusBadge: React.FC<{ status?: string }> = ({ status }) => {
  const s = (status || '').toLowerCase();
  const map: Record<string, string> = {
    submitted: 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200',
    approved: 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-200',
    pending_payment: 'bg-amber-50 text-amber-800 ring-1 ring-inset ring-amber-200',
    paid: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200',
    rejected: 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-200',
    draft: 'bg-gray-50 text-gray-700 ring-1 ring-inset ring-gray-200',
  };
  const cls = map[s] || 'bg-gray-50 text-gray-700 ring-1 ring-inset ring-gray-200';
  return <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${cls}`}>{humanize(status)}</span>;
};

const ProjectReadOnly: React.FC<Props> = ({ data = [] as any }) => {
  const buildings: Array<any> = Array.isArray(data?.data?.buildings) ? data.data.buildings : [];
  const ownersDisplay = Array.isArray(data?.owners) && data.owners.length > 0
    ? data.owners.map((o: OwnerInfo, i: number) => (
        <div key={i} className="text-sm text-gray-900 flex flex-col">
          <span>{o.name || '—'}</span>
          {o.email ? <span className="text-xs text-gray-500">{o.email}</span> : null}
        </div>
      ))
    : <div className="text-sm text-gray-500">—</div>;

  const businessLabel = (data?.business?.name
    || (typeof data?.business_id === 'number' ? `#${data.business_id}` : undefined)
  ) ?? '—';

  const submittedOn = data?.created_at ? new Date(data.created_at) : null;
  const submittedOnStr = submittedOn && !isNaN(submittedOn.getTime()) ? submittedOn.toLocaleString() : '—';
  const updatedOn = data?.updated_at ? new Date(data.updated_at) : null;
  const updatedOnStr = updatedOn && !isNaN(updatedOn.getTime()) ? updatedOn.toLocaleString() : '—';

  const totalProcessing = (() => {
    const direct = Number(data?.data?.processingFees);
    if (!Number.isNaN(direct) && direct > 0) return direct;
    if (Array.isArray(buildings) && buildings.length > 0) {
      const sum = buildings.reduce((acc: number, b: any) => acc + Number(b?.processingFee || 0), 0);
      return sum;
    }
    return NaN;
  })();

  const buildingMetrics = (() => {
    const count = buildings.length;
    const openArea = buildings.reduce((acc: number, b: any) => acc + Number(b?.openArea || 0), 0);
    const closeArea = buildings.reduce((acc: number, b: any) => acc + Number(b?.closeArea || 0), 0);
    return { count, openArea, closeArea };
  })();

  const review = (() => {
    const r = data?.data?._review;
    const reviewedAt = r?.at || data?.reviewed_at || undefined;
    const reviewer = r?.reviewerUserId || data?.reviewer_user_id || undefined;
    const reason = r?.reason || data?.review_reason || undefined;
    const status = r?.status || data?.status || undefined;
    return { reviewedAt, reviewer, reason, status };
  })();

  // --- attachments ---
  const isPdf = (p?: string) => !!p && /\.pdf$/i.test(p);
  const isImage = (p?: string) => !!p && /\.(png|jpe?g|gif|bmp|webp|svg)$/i.test(p);
  const buildUploadUrl = (p?: string) => {
    if (!p) return '';
    if (/^https?:\/\//i.test(p)) return p;
    const base = (process.env.NEXT_PUBLIC_API_URL || 'https://ixora-api.mbmb.gov.my').replace(/\/$/, '');
    let path = String(p).replace(/^\/+/, '');
    if (!/^uploads\/file\//i.test(path)) path = `uploads/file/${path}`;
    return `${base}/${path}`;
  };
  const attachments: Array<{ key: string; label: string; path?: string }> = [
    { key: 'statutoryDeclarationFile', label: 'Statutory Declaration' },
    { key: 'landHeirDeclarationFile', label: 'Land Heir Declaration' },
    { key: 'rentalAgreementFile', label: 'Rental Agreement' },
  ].map((k) => ({ ...k, path: data?.data?.[k.key] as string | undefined })).filter((a) => !!a.path);
  const paymentRef = data?.data?.paymentReference || data?.payment_reference || data?.billing?.reference || data?.reference || '';

  return (
    <div className="bg-white shadow rounded-lg p-5">
      <FormSectionHeader title="Overview" description="Project summary and ownership context" />
      <div className="mt-4">
        <FormRow columns={3}>
          <Field label="Project ID" value={typeof data?.id === 'number' ? `#${data.id}` : '—'} />
          <Field label="Business" value={businessLabel} />
          <Field label="Status" value={<StatusBadge status={data?.status} />} />
        </FormRow>
        <FormRow columns={3}>
          <Field label="Project Owners" value={<div className="space-y-1">{ownersDisplay}</div>} />
          <Field label="Submitted On" value={submittedOnStr} />
          <Field label="Last Updated" value={updatedOnStr} />
        </FormRow>
      </div>

      <LineSeparator />

      <FormSectionHeader title="Project Information" description="Submitted project details" />
      <div className="mt-4">
        <FormRow columns={3}>
          <Field label="Project Title" value={data?.data.projectTitle} />
          <Field label="Country" value={data?.data.country} />
          <Field label="Processing Fees" value={currency(data?.data.processingFees)} />
        </FormRow>
        <FormRow columns={1}>
          <Field label="Project Address" value={formatAddress(data?.data)} colSpan="sm:col-span-9" />
        </FormRow>
      </div>

      <LineSeparator />

      <FormSectionHeader title="Land Information" description="Submitted land details" />
      <div className="mt-4">
        <FormRow columns={3}>
          <Field label="Subdistrict / Town / City Area" value={data?.data?.landAddress} />
          <Field label="Lot / Plot Number" value={data?.data?.lotNumber} />
          <Field label="Land Status" value={data?.data?.landStatus} />
          <Field label="Type of Grant" value={data?.data?.typeGrant} />
          <Field label="Specific Conditions" value={data?.data?.spesificCondition} />
          <Field label="Land Area (m2)" value={data?.data?.landArea} />
        </FormRow>
      </div>

      <LineSeparator />

      <FormSectionHeader title="Proposed Usage" description="Submitted buildings and areas" />
      <div className="mt-4">
        {buildings.length === 0 ? (
          <div className="text-sm text-gray-500">No buildings submitted</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Name/Type</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Open Area (m2)</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Close Area (m2)</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Processing Fee</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {buildings.map((b, idx) => (
                  <tr key={idx} className="bg-white">
                    <td className="px-3 py-2 text-sm text-gray-900">{b?.buildingUse || '—'}</td>
                    <td className="px-3 py-2 text-sm text-gray-900">{Number(b?.openArea ?? 0)}</td>
                    <td className="px-3 py-2 text-sm text-gray-900">{Number(b?.closeArea ?? 0)}</td>
                    <td className="px-3 py-2 text-sm text-gray-900">{currency(b?.processingFee)}</td>
                  </tr>
                ))}
                <tr>
                  <td className="px-3 py-2 text-sm font-semibold text-gray-900">Totals ({buildingMetrics.count} building{buildingMetrics.count === 1 ? '' : 's'})</td>
                  <td className="px-3 py-2 text-sm font-semibold text-gray-900">{Number(buildingMetrics.openArea)}</td>
                  <td className="px-3 py-2 text-sm font-semibold text-gray-900">{Number(buildingMetrics.closeArea)}</td>
                  <td className="px-3 py-2 text-sm font-semibold text-gray-900">{currency(totalProcessing)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
          {/* Payment Summary */}
          {['pending_payment', 'paid'].includes(String(data?.status || '').toLowerCase()) && (
            <>
              <LineSeparator />
              <FormSectionHeader title="Payment" description="Payment summary" />
              <div className="mt-4">
                <FormRow columns={3}>
                  <Field label="Payment Status" value={<StatusBadge status={data?.status} />} />
                  <Field label="Amount" value={currency(totalProcessing)} />
                  <Field label="Reference" value={paymentRef || '—'} />
                </FormRow>
              </div>
            </>
          )}

      </div>

      {/* Review / Audit */}
      {(review?.reviewedAt || review?.reason) && (
        <>
          <LineSeparator />
          <FormSectionHeader title="Review" description="Administrative review outcome" />
          <div className="mt-4">
            <FormRow columns={3}>
              <Field label="Reviewed Status" value={<StatusBadge status={review?.status} />} />
              <Field label="Reviewed On" value={review?.reviewedAt ? new Date(review.reviewedAt).toLocaleString() : '—'} />
              <Field label="Reviewer" value={review?.reviewer ? `User #${review.reviewer}` : '—'} />
            </FormRow>
            {review?.reason ? (
              <FormRow columns={1}>
                <Field label="Reason" value={review?.reason} colSpan="sm:col-span-9" />
              </FormRow>
            ) : null}
          </div>
        </>
      )}

      {/* Attachments */}
      <LineSeparator />
      <FormSectionHeader title="Attachments" description="Uploaded supporting documents" />
      <div className="mt-4 space-y-4">
        {attachments.length === 0 ? (
          <div className="text-sm text-gray-500">No attachments uploaded</div>
        ) : (
          attachments.map((att, i) => {
            const url = buildUploadUrl(att.path);
            return (
              <div key={i} className="border rounded-md p-3 bg-gray-50">
                <div className="text-sm font-medium text-gray-900 mb-2">{att.label}</div>
                {isPdf(att.path) ? (
                  <div>
                    <div className="h-64 w-full border rounded bg-white overflow-hidden">
                      <iframe src={url} className="w-full h-full" title={`${att.label} preview`} />
                    </div>
                    <a href={url} target="_blank" rel="noreferrer" className="text-xs text-indigo-600 hover:underline mt-2 inline-block">Open PDF in new tab</a>
                  </div>
                ) : isImage(att.path) ? (
                  <div className="flex items-center gap-3">
                    <img src={url} alt={`${att.label} preview`} className="h-24 w-auto rounded border bg-white" />
                    <a href={url} target="_blank" rel="noreferrer" className="text-xs text-indigo-600 hover:underline">Open image</a>
                  </div>
                ) : (
                  <a href={url} target="_blank" rel="noreferrer" className="text-xs text-indigo-600 hover:underline">Open file</a>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ProjectReadOnly;
