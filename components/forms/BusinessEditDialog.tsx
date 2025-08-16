import { Dialog } from '@headlessui/react';
import { useEffect, useMemo, useState } from 'react';
import FormWrapper from './FormWrapper';
import Heading from './Heading';
import Spacing from './Spacing';
import LineSeparator from './LineSeparator';
import FormSectionHeader from './FormSectionHeader';
import InputText from './InputText';
import DatePickerField from './DatePickerField';
import SelectField from './SelectField';
import FormRow from './FormRow';
import FileUploadField from './FileUpload';
import Button from './Button';
import Toggle from './Toggle';
import toast from 'react-hot-toast';
import { updateBusiness } from '@/services/api';

const countryOptions = [
  { value: 'malaysia', label: 'Malaysia' },
];

export type BusinessEditDialogProps = {
  open: boolean;
  onClose: () => void;
  data: any | null;
  onSaved?: (updated: any) => void;
};

export default function BusinessEditDialog({ open, onClose, data, onSaved }: BusinessEditDialogProps) {
  const [submitting, setSubmitting] = useState(false);
  const [isOrganisation, setIsOrganisation] = useState(false);
  const [previewPath, setPreviewPath] = useState<string | null>(null);

  useEffect(() => {
    setIsOrganisation((data?.accountType || '').toLowerCase() === 'organisation');
  setPreviewPath(data?.certificateFilePath || null);
  }, [data]);

  const defaults = useMemo(() => {
    if (!data) return undefined;
    return {
      companyName: data.companyName || '',
      registrationNumber: data.registrationNumber || '',
      expiryDate: data.expiryDate ? new Date(data.expiryDate) : undefined,
      phone: data.phone || '',
      address: data.address || '',
      city: data.city || '',
      state: data.state || '',
      postalcode: data.postalcode || '',
      country: data.country || 'malaysia',
      certificate: data.certificateFilePath || '',
    };
  }, [data]);

  const handleSubmit = async (form: any) => {
    if (!data?.id) return;
    try {
      setSubmitting(true);
      const payload = {
        companyName: form.companyName,
        registrationNumber: form.registrationNumber,
        expiryDate: form.expiryDate ? new Date(form.expiryDate).toISOString().split('T')[0] : undefined,
        phone: form.phone,
        address: form.address,
        city: form.city,
        state: form.state,
        postalcode: form.postalcode,
        country: form.country,
        certificateFilePath: form.certificate || data.certificateFilePath,
        accountType: isOrganisation ? 'organisation' : (data.accountType || 'business'),
      };

      const updated = await updateBusiness(Number(data.id), payload);
      toast.success('Business updated');
      onSaved?.(updated);
      onClose();
    } catch (e: any) {
      console.error(e);
      toast.error(e?.response?.data?.message || 'Update failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-3xl rounded-lg bg-white p-6 shadow-xl ring-1 ring-gray-900/10">
            <div className="flex items-start justify-between">
              <Dialog.Title className="text-base font-semibold text-gray-900">Edit Business</Dialog.Title>
              <button type="button" onClick={onClose} className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-600" aria-label="Close">
                <svg viewBox="0 0 20 20" fill="currentColor" className="size-5" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 8.586 3.293 1.879 1.879 3.293 8.586 10l-6.707 6.707 1.414 1.414L10 11.414l6.707 6.707 1.414-1.414L11.414 10l6.707-6.707-1.414-1.414L10 8.586z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            <div className="mt-4">
              <FormWrapper onSubmit={handleSubmit} defaultValues={defaults}>
                <Heading level={5} align="left" bold>
                  Business Details
                </Heading>
                <Spacing size="sm" />

                <Toggle
                  label=""
                  description={isOrganisation ? 'Organisation' : 'Company'}
                  checked={isOrganisation}
                  onChange={setIsOrganisation}
                />

                <Spacing size="sm" />
                <InputText id="companyName" name="companyName" label={isOrganisation ? 'Organisation Name' : 'Company Name'} requiredMessage="Company Name is required" />
                <Spacing size="sm" />
                <InputText id="registrationNumber" name="registrationNumber" label={isOrganisation ? 'ROS Number' : 'SSM Number'} requiredMessage={`${isOrganisation ? 'ROS' : 'SSM'} Number is required`} />
                <Spacing size="sm" />
                <DatePickerField name="expiryDate" label={isOrganisation ? 'ROS Expiry Date' : 'SSM Expiry Date'} dateFormat="dd/MM/yyyy" placeholder="DD/MM/YYYY" requiredMessage="Please select your expiry certificate date" />

                <Spacing size="md" />
                <LineSeparator />

                <FormSectionHeader title="Contact Information" description="Provide your contact and address details." />
                <Spacing size="sm" />
                <InputText id="phone" name="phone" label="Company Phone Number" prefix="+60" requiredMessage="Phone number is required" />
                <Spacing size="sm" />
                <InputText id="address" name="address" label="Premise / Lot / Street Address" requiredMessage="Address is required" />
                <Spacing size="sm" />
                <FormRow columns={3}>
                  <InputText id="city" name="city" label="City" requiredMessage="City is required" />
                  <InputText id="state" name="state" label="State / Province" requiredMessage="State / Province is required" />
                  <InputText id="postalcode" name="postalcode" label="ZIP / Postal code" requiredMessage="ZIP / Postal code is required" />
                </FormRow>
                <Spacing size="sm" />
                <SelectField id="country" name="country" label="Country" options={countryOptions} requiredMessage="Country is required" />

                <Spacing size="md" />
                <LineSeparator />

                <Heading level={6} align="left" bold>
                  Certificate
                </Heading>
                <Spacing size="sm" />
                <FileUploadField
                  name="certificate"
                  label="Upload Certificate"
                  accept="image/*,application/pdf"
                  buttonText="Select File"
                  description="PNG, JPG, PDF up to 10MB"
                  onUploadSuccess={(fileUrl: string) => setPreviewPath(fileUrl)}
                />

                {/* Existing / selected certificate preview */}
                <div className="mt-3">
                  {previewPath ? (
                    <CertificatePreview path={previewPath} />
                  ) : (
                    <p className="text-xs text-gray-500">No certificate selected</p>
                  )}
                </div>

                <Spacing size="md" />
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                  <Button type="submit" variant="primary" loading={submitting}>Save Changes</Button>
                </div>
              </FormWrapper>
            </div>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
}

function CertificatePreview({ path }: { path: string }) {
  const url = buildUrl(path);
  const isImage = /\.(png|jpe?g|gif|webp|svg)$/i.test(path);
  if (isImage) {
    return (
      <a href={url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 text-indigo-600 hover:text-indigo-500">
        <img src={url} alt="Certificate" className="h-16 w-16 rounded object-cover ring-1 ring-gray-200" />
        <span className="text-sm">Open current certificate</span>
      </a>
    );
  }
  return (
    <a href={url} target="_blank" rel="noreferrer" className="text-sm text-indigo-600 hover:text-indigo-500 break-all">
      Open current certificate
    </a>
  );
}

function buildUrl(path: string) {
  if (!path) return path;
  if (/^https?:\/\//i.test(path)) return path;
  const base = process.env.NEXT_PUBLIC_API_URL || 'https://ixora-api.mbmb.gov.my';
  let normalized = String(path).replace(/^\/+/, '');
  if (!/^uploads\/file\//i.test(normalized)) {
    normalized = `uploads/file/${normalized}`;
  }
  const url = `${base}/${normalized}`;
  return url.replace(/([^:]\/)\/+/, '$1/');
}
