import FormWrapper from "todo/components/forms/FormWrapper";
import Button from 'todo/components/forms/Button';
import FormSectionHeader from '@/components/forms/FormSectionHeader';
import FormActions from "todo/components/forms/FormActions";
import InputWithPrefix from "todo/components/forms/InputText";
import Spacing from "todo/components/forms/Spacing";
import LineSeparator from "todo/components/forms/LineSeparator";
import FormRow from "todo/components/forms/FormRow";
import { countryOptions } from "todo/components/data/SelectionList";
import SelectField from "todo/components/forms/SelectField";
import CheckboxGroupField from "todo/components/forms/CheckboxGroupField";
import { emailNotificationOptions2 } from "todo/components/data/CheckList";
import ConfirmDialog from "todo/components/forms/ConfirmDialog";
import router from "next/router";
import { useEffect, useMemo, useState } from "react";
import RadioGroupField from "todo/components/forms/RadioGroupField";
import { radioButtonList } from "todo/components/data/RadioList";
import toast from 'react-hot-toast';
import DatePickerField from "todo/components/forms/DatePickerField";
import LayoutWithoutSidebar from "../main/LayoutWithoutSidebar";
import FileUploadField from "../forms/FileUpload";
import { fetchMyBusinesses, submitLam } from '@/services/api';
export default function LoginPage() {

    const [showCancelDialog, setShowCancelDialog] = useState(false);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [businesses, setBusinesses] = useState<any[]>([]);
    const [selectedBusinessId, setSelectedBusinessId] = useState<number | null>(null);
    const [selectedBusiness, setSelectedBusiness] = useState<any | null>(null);

    useEffect(() => {
        let mounted = true;
        fetchMyBusinesses()
            .then((list: any[]) => { if (mounted) setBusinesses(Array.isArray(list) ? list : []) })
            .catch(() => { if (mounted) setBusinesses([]) });
        return () => { mounted = false };
    }, []);

    useEffect(() => {
        if (!selectedBusinessId) { setSelectedBusiness(null); return; }
        const pick = businesses.find((b) => Number(b.id) === Number(selectedBusinessId));
        setSelectedBusiness(pick || null);
    }, [selectedBusinessId, businesses]);

    const handleSubmit = async (data: any) => {
        try {
            setLoading(true);
            if (!selectedBusiness) throw new Error('Please select a business first');
            // Prevent resubmission client-side if already approved
            const status = String(selectedBusiness?.lamStatus || selectedBusiness?.lam_status || '').toLowerCase();
            if (status === 'approved') throw new Error('LAM already approved for this business');
            // Save LAM number on business for now; backend exposes a dedicated endpoint we could call directly if desired
            const lamNumber: string = data?.aim || '';
            const lamDocumentPath: string = data?.lamDocument || '';
            if (!lamNumber) throw new Error('LAM number is required');
            await submitLam(selectedBusiness.id, { lamNumber, lamDocumentPath });
            setSubmitted(true);
            toast.success('LAM submitted for review');
        } catch (e: any) {
            toast.error(e?.message || 'Failed to submit LAM');
        } finally {
            setLoading(false);
        }
    };

    return (
      <LayoutWithoutSidebar shiftY="-translate-y-0">
                        {!submitted ? (
                        <FormWrapper onSubmit={handleSubmit}>
                <FormSectionHeader title="Consultant Onboard" description="This registration enables businesses to be officially recognized as consultants authorized to manage temporary building permits through the MYSKB system. It enhances their capability to oversee and coordinate building-related submissions on behalf of project owners." />
                <Spacing size="lg" />
                {businesses.length === 0 && (
                    <div className="mb-4 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
                        You don't have any registered businesses yet. Please register your business first in the Business module, then return here to submit your LAM details.
                        <a href="/business" className="ml-2 underline">Go to Business Registration →</a>
                    </div>
                )}
             
                {/* Business selector required before LAM submission */}
                <SelectField
                    id="business_id"
                    name="business_id"
                    label="Business"
                    options={businesses.map((b) => ({
                        value: b.id,
                        label: `${b.name || b.companyName || b.company_name || 'Business'}${(b.registrationNumber || b.registration_number) ? ` • ${b.registrationNumber || b.registration_number}` : ''}`
                    }))}
                    requiredMessage="Business is required"
                    onChange={(e) => setSelectedBusinessId(Number(e.target.value))}
                />
                <Spacing size="md" />

                                        <InputWithPrefix
                                            id="aim"
                                            name="aim"
                                            label="LAM (Lembaga Arkitek Malaysia)"
                                            placeholder="Enter your LAM (Lembaga Arkitek Malaysia)"
                                        />
                                        <Spacing size="sm" />
                                        <FileUploadField
                                            name="lamDocument"
                                            label="LAM Document (PDF)"
                                            description="PDF up to 10MB"
                                            accept="application/pdf"
                                            folder="myskb/lam"
                                            requiredMessage="Please upload your LAM document (PDF)"
                                        />
                   
         
                <FormActions>
                    <Button type="button" variant="ghost" onClick={() => setShowCancelDialog(true)}>Cancel</Button>
                    <Button type="submit" variant="primary" loading={loading} disabled={!selectedBusiness || String(selectedBusiness?.lamStatus || selectedBusiness?.lam_status || '').toLowerCase() === 'approved'}>
                        {String(selectedBusiness?.lamStatus || selectedBusiness?.lam_status || '').toLowerCase() === 'approved' ? 'Already Approved' : 'Submit'}
                    </Button>
                </FormActions>


                        </FormWrapper>
                        ) : (
                            <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-lg p-6 text-center">
                                <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-green-50 border border-green-200 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6 text-green-600">
                                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-7 9a.75.75 0 01-1.129.06l-3-3a.75.75 0 111.06-1.06l2.39 2.389 6.48-8.325a.75.75 0 011.056-.116z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900">LAM submission received</h3>
                                <p className="mt-2 text-gray-600">Your application is waiting for review. We'll email you once we complete the review with either an approval or a rejection.</p>
                                <div className="mt-4 text-sm text-gray-500">
                                    <p>Business: <span className="font-medium text-gray-900">{selectedBusiness?.name || selectedBusiness?.companyName || selectedBusiness?.company_name}</span></p>
                                    {selectedBusiness?.registrationNumber || selectedBusiness?.registration_number ? (
                                        <p>Registration No.: <span className="font-medium text-gray-900">{selectedBusiness?.registrationNumber || selectedBusiness?.registration_number}</span></p>
                                    ) : null}
                                </div>
                                <div className="mt-6 flex gap-2 justify-center">
                                    <Button type="button" variant="primary" onClick={() => router.push('/myskb/home')}>Go to MySKB Home</Button>
                                    <Button type="button" variant="ghost" onClick={() => setSubmitted(false)}>Submit another</Button>
                                </div>
                            </div>
                        )}
            

            <ConfirmDialog
                open={showCancelDialog}
                title="Discard changes?"
                description="Your unsaved changes will be lost. Are you sure you want to leave this form?"
                confirmText="Yes, discard"
                cancelText="Stay"
                onCancel={() => setShowCancelDialog(false)}
                onConfirm={() => {
                    setShowCancelDialog(false);
                    router.push('/form'); // or reset form
                }}
            />

            </LayoutWithoutSidebar>

  
    );
}

