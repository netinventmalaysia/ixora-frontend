import React from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import LayoutWithoutSidebar from 'todo/components/main/LayoutWithoutSidebar'
import Heading from 'todo/components/forms/Heading'
import Spacing from 'todo/components/forms/Spacing'
import FormSectionHeader from 'todo/components/forms/FormSectionHeader'

const VendorHubHome: React.FC = () => {
  const methods = useForm()

  // Vendor Hub onboarding steps
  const enrollmentSteps = [
    'Register your company or vendor details',
    'Upload and verify supporting documents (SSM, certificates, etc.)',
    'Pay the Annual Digital Service Fee to activate your MBMB Vendor status',
    'Receive your official E-Certificate (with QR verification) in IXORA',
    'Access the Vendor Hub to check work status, LO, claims, and real-time notifications',
  ]

  // Main benefits for registered vendors
  const benefits = [
    '24/7 online access to work status, payments, and official announcements',
    'Automatic verification for active vendors (no manual checks required)',
    'Smart notifications via WhatsApp, email, and app alerts',
    'Save time and travel costs (estimated RM350–RM500 per year per vendor)',
    'Ready to receive LO inactive vendors will be auto-blocked',
  ]

  return (
    <FormProvider {...methods}>
      <LayoutWithoutSidebar shiftY="-translate-y-8">
        <Heading level={2} align="left" bold>
          🏢 Vendor Hub Registration
        </Heading>

        <Spacing size="lg" />

        <FormSectionHeader
          title="Welcome to IXORA Vendor Hub"
          description="Complete your vendor registration to gain official access to MBMB’s digital modules including work status, notifications, and active vendor verification. 
          The first person to register will be the company administrator. 
          Once verified, you can invite team members and manage projects linked with MBMB."
        />

        <Spacing size="lg" />
        <FormSectionHeader
          title="Objective"
          description="To simplify and digitalize vendor management for MBMB ensuring faster, transparent, and auditable services including work tracking, claims, LO, and official communication through IXORA."
        />

        <Spacing size="lg" />
        <FormSectionHeader
          title="Registration Steps"
          description=""
        />
        <ul className="list-decimal list-inside text-sm text-gray-700 space-y-1 pl-4">
          {enrollmentSteps.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ul>

        <Spacing size="lg" />
        <FormSectionHeader
          title="Main Benefits"
          description=""
        />
        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 pl-4">
          {benefits.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>

        <Spacing size="lg" />
        <FormSectionHeader
          title="Important Note"
          description="Only Active Vendors are eligible to receive LO. Your account will be automatically blocked if the Annual Digital Service Fee is not paid."
        />
      </LayoutWithoutSidebar>
    </FormProvider>
  )
}

export default VendorHubHome