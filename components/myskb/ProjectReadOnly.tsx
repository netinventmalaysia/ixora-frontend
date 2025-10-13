import React from 'react';
import FormSectionHeader from '@/components/forms/FormSectionHeader';
import FormRow from '@/components/forms/FormRow';
import LineSeparator from '@/components/forms/LineSeparator';

type OwnerInfo = { name?: string; email?: string; user_id?: number };

type Props = {
  data: Record<string, any>;
  businessName?: string;
  owners?: OwnerInfo[];
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

const ProjectReadOnly: React.FC<Props> = ({ data, businessName, owners = [] }) => {
  const buildings: Array<any> = Array.isArray(data?.buildings) ? data.buildings : [];
  const ownersDisplay = owners.length
    ? owners.map((o, i) => (
        <div key={i} className="text-sm text-gray-900">
          {o.name || o.email || `User #${o.user_id}`}
        </div>
      ))
    : (Array.isArray(data?.owners_user_ids) && data.owners_user_ids.length
        ? (<div className="text-sm text-gray-900">{data.owners_user_ids.join(', ')}</div>)
        : (<div className="text-sm text-gray-500">—</div>)
      );

  return (
    <div className="bg-white shadow rounded-lg p-5">
      <FormSectionHeader title="Ownership Information" description="Project and owner context" />
      <div className="mt-4">
        <FormRow columns={3}>
          <Field label="Business" value={businessName || (data?.business_id ? `#${data.business_id}` : '—')} />
          <Field label="Project Owners" value={<div className="space-y-1">{ownersDisplay}</div>} />
        </FormRow>
      </div>

      <LineSeparator />

      <FormSectionHeader title="Project Information" description="Submitted project details" />
      <div className="mt-4">
        <FormRow columns={3}>
          <Field label="Project Title" value={data?.projectTitle} />
          <Field label="Country" value={data?.country} />
          <Field label="Processing Fees" value={currency(data?.processingFees)} />
        </FormRow>
        <FormRow columns={1}>
          <Field label="Project Address" value={formatAddress(data)} colSpan="sm:col-span-9" />
        </FormRow>
      </div>

      <LineSeparator />

      <FormSectionHeader title="Land Information" description="Submitted land details" />
      <div className="mt-4">
        <FormRow columns={3}>
          <Field label="Subdistrict / Town / City Area" value={data?.landAddress} />
          <Field label="Lot / Plot Number" value={data?.lotNumber} />
          <Field label="Land Status" value={data?.landStatus} />
          <Field label="Type of Grant" value={data?.typeGrant} />
          <Field label="Specific Conditions" value={data?.spesificCondition} />
          <Field label="Land Area (m2)" value={data?.landArea} />
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
                    <td className="px-3 py-2 text-sm text-gray-900">{b?.name || '—'}</td>
                    <td className="px-3 py-2 text-sm text-gray-900">{Number(b?.openArea ?? 0)}</td>
                    <td className="px-3 py-2 text-sm text-gray-900">{Number(b?.closeArea ?? 0)}</td>
                    <td className="px-3 py-2 text-sm text-gray-900">{currency(b?.processingFee)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectReadOnly;
