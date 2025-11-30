import FormWrapper from 'todo/components/forms/FormWrapper';
import Button from 'todo/components/forms/Button';
import FormSectionHeader from '@/components/forms/FormSectionHeader';
import FormActions from 'todo/components/forms/FormActions';
import InputWithPrefix from 'todo/components/forms/InputText';
import Spacing from 'todo/components/forms/Spacing';
import LineSeparator from 'todo/components/forms/LineSeparator';
import FormRow from 'todo/components/forms/FormRow';
import { countryOptions } from 'todo/components/data/SelectionList';
import SelectField from 'todo/components/forms/SelectField';
import CheckboxGroupField from 'todo/components/forms/CheckboxGroupField';
import { emailNotificationOptions2 } from 'todo/components/data/CheckList';
import ConfirmDialog from 'todo/components/forms/ConfirmDialog';
import router from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import RadioGroupField from 'todo/components/forms/RadioGroupField';
import { radioButtonList } from 'todo/components/data/RadioList';
import toast from 'react-hot-toast';
import DatePickerField from 'todo/components/forms/DatePickerField';
import LayoutWithoutSidebar from '../main/LayoutWithoutSidebar';
import FileUploadField from '../forms/FileUpload';
import { fetchMyBusinesses, submitLam } from '@/services/api';
import { useTranslation } from '@/utils/i18n';
export default function LoginPage() {
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [selectedBusinessId, setSelectedBusinessId] = useState<number | null>(
    null
  );
  const [selectedBusiness, setSelectedBusiness] = useState<any | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    let mounted = true;
    fetchMyBusinesses()
      .then((list: any[]) => {
        if (mounted) setBusinesses(Array.isArray(list) ? list : []);
      })
      .catch(() => {
        if (mounted) setBusinesses([]);
      });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedBusinessId) {
      setSelectedBusiness(null);
      return;
    }
    const pick = businesses.find(
      (b) => Number(b.id) === Number(selectedBusinessId)
    );
    setSelectedBusiness(pick || null);
  }, [selectedBusinessId, businesses]);

  // Preselect default business from localStorage
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && selectedBusinessId == null) {
        const saved = localStorage.getItem('activeBusinessId');
        if (saved) {
          const id = Number(saved);
          if (!Number.isNaN(id)) setSelectedBusinessId(id);
        }
      }
    } catch {}
    const onChange = () => {
      try {
        const saved =
          typeof window !== 'undefined'
            ? localStorage.getItem('activeBusinessId')
            : null;
        if (saved) {
          const id = Number(saved);
          if (!Number.isNaN(id)) setSelectedBusinessId(id);
        }
      } catch {}
    };
    if (typeof window !== 'undefined')
      window.addEventListener(
        'ixora:businessChange',
        onChange as EventListener
      );
    return () => {
      if (typeof window !== 'undefined')
        window.removeEventListener(
          'ixora:businessChange',
          onChange as EventListener
        );
    };
  }, [selectedBusinessId]);

  const handleSubmit = async (data: any) => {
    try {
      setLoading(true);
      if (!selectedBusiness)
        throw new Error(
          t(
            'myskb.registration.errors.selectBusiness',
            'Please select a business first'
          )
        );
      // Prevent resubmission client-side if already approved
      const status = String(
        selectedBusiness?.lamStatus || selectedBusiness?.lam_status || ''
      ).toLowerCase();
      if (status === 'approved')
        throw new Error(
          t(
            'myskb.registration.errors.alreadyApproved',
            'LAM already approved for this business'
          )
        );
      // Save LAM number on business for now; backend exposes a dedicated endpoint we could call directly if desired
      const lamNumber: string = data?.aim || '';
      const lamDocumentPath: string = data?.lamDocument || '';
      if (!lamNumber)
        throw new Error(
          t('myskb.registration.errors.lamRequired', 'LAM number is required')
        );
      await submitLam(selectedBusiness.id, { lamNumber, lamDocumentPath });
      setSubmitted(true);
      toast.success(
        t('myskb.registration.toast.submitted', 'LAM submitted for review')
      );
    } catch (e: any) {
      toast.error(
        e?.message ||
          t('myskb.registration.toast.failed', 'Failed to submit LAM')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <LayoutWithoutSidebar shiftY="-translate-y-0">
      {!submitted ? (
        <FormWrapper onSubmit={handleSubmit}>
          <FormSectionHeader
            title={t('myskb.registration.header.title', 'Consultant Onboard')}
            description={t(
              'myskb.registration.header.description',
              'This registration enables businesses to be officially recognized as consultants authorized to manage temporary building permits through the MYSKB system. It enhances their capability to oversee and coordinate building-related submissions on behalf of project owners.'
            )}
          />
          <Spacing size="lg" />
          {businesses.length === 0 && (
            <div className="mb-4 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
              {t(
                'myskb.registration.emptyBusinesses',
                "You don't have any registered businesses yet. Please register your business first in the Business module, then return here to submit your LAM details."
              )}
              <a href="/business" className="ml-2 underline">
                {t(
                  'myskb.registration.goToBusiness',
                  'Go to Business Registration →'
                )}
              </a>
            </div>
          )}

          {/* Business selector required before LAM submission */}
          <SelectField
            id="business_id"
            name="business_id"
            label={t('myskb.registration.businessLabel', 'Business')}
            options={businesses.map((b) => ({
              value: b.id,
              label: `${
                b.name || b.companyName || b.company_name || 'Business'
              }${
                b.registrationNumber || b.registration_number
                  ? ` • ${b.registrationNumber || b.registration_number}`
                  : ''
              }`,
            }))}
            requiredMessage={t(
              'myskb.registration.errors.businessRequired',
              'Business is required'
            )}
            onChange={(e) => {
              const id = Number(e.target.value);
              setSelectedBusinessId(id);
              try {
                if (typeof window !== 'undefined') {
                  localStorage.setItem('activeBusinessId', String(id));
                  window.dispatchEvent(new Event('ixora:businessChange'));
                }
              } catch {}
            }}
          />
          <Spacing size="md" />

          <InputWithPrefix
            id="aim"
            name="aim"
            label={t(
              'myskb.registration.lamLabel',
              'LAM (Lembaga Arkitek Malaysia)'
            )}
            placeholder={t(
              'myskb.registration.lamPlaceholder',
              'Enter your LAM (Lembaga Arkitek Malaysia)'
            )}
          />
          <Spacing size="sm" />
          <FileUploadField
            name="lamDocument"
            label={t('myskb.registration.documentLabel', 'LAM Document (PDF)')}
            description={t(
              'myskb.registration.documentDescription',
              'PDF up to 10MB'
            )}
            accept="application/pdf"
            folder="myskb/lam"
            requiredMessage={t(
              'myskb.registration.documentRequired',
              'Please upload your LAM document (PDF)'
            )}
          />

          <FormActions>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowCancelDialog(true)}
            >
              {t('common.actions.cancel', 'Cancel')}
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              disabled={
                !selectedBusiness ||
                String(
                  selectedBusiness?.lamStatus ||
                    selectedBusiness?.lam_status ||
                    ''
                ).toLowerCase() === 'approved'
              }
            >
              {String(
                selectedBusiness?.lamStatus ||
                  selectedBusiness?.lam_status ||
                  ''
              ).toLowerCase() === 'approved'
                ? t('myskb.registration.alreadyApproved', 'Already Approved')
                : t('common.actions.submit', 'Submit')}
            </Button>
          </FormActions>
        </FormWrapper>
      ) : (
        <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-lg p-6 text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-green-50 border border-green-200 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-6 w-6 text-green-600"
            >
              <path
                fillRule="evenodd"
                d="M16.704 4.153a.75.75 0 01.143 1.052l-7 9a.75.75 0 01-1.129.06l-3-3a.75.75 0 111.06-1.06l2.39 2.389 6.48-8.325a.75.75 0 011.056-.116z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900">
            {t('myskb.registration.success.title', 'LAM submission received')}
          </h3>
          <p className="mt-2 text-gray-600">
            {t(
              'myskb.registration.success.description',
              "Your application is waiting for review. We'll email you once we complete the review with either an approval or a rejection."
            )}
          </p>
          <div className="mt-4 text-sm text-gray-500">
            <p>
              {t('myskb.registration.success.business', 'Business')}:{' '}
              <span className="font-medium text-gray-900">
                {selectedBusiness?.name ||
                  selectedBusiness?.companyName ||
                  selectedBusiness?.company_name}
              </span>
            </p>
            {selectedBusiness?.registrationNumber ||
            selectedBusiness?.registration_number ? (
              <p>
                {t(
                  'myskb.registration.success.registrationNo',
                  'Registration No.'
                )}
                :{' '}
                <span className="font-medium text-gray-900">
                  {selectedBusiness?.registrationNumber ||
                    selectedBusiness?.registration_number}
                </span>
              </p>
            ) : null}
          </div>
          <div className="mt-6 flex gap-2 justify-center">
            <Button
              type="button"
              variant="primary"
              onClick={() => router.push('/myskb/home')}
            >
              {t('myskb.registration.success.goHome', 'Go to MySKB Home')}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setSubmitted(false)}
            >
              {t('myskb.registration.success.submitAnother', 'Submit another')}
            </Button>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={showCancelDialog}
        title={t('myskb.registration.confirmDiscard.title', 'Discard changes?')}
        description={t(
          'myskb.registration.confirmDiscard.description',
          'Your unsaved changes will be lost. Are you sure you want to leave this form?'
        )}
        confirmText={t(
          'myskb.registration.confirmDiscard.confirm',
          'Yes, discard'
        )}
        cancelText={t('myskb.registration.confirmDiscard.cancel', 'Stay')}
        onCancel={() => setShowCancelDialog(false)}
        onConfirm={() => {
          setShowCancelDialog(false);
          router.push('/form'); // or reset form
        }}
      />
    </LayoutWithoutSidebar>
  );
}
