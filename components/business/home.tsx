import React from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import LayoutWithoutSidebar from 'todo/components/main/LayoutWithoutSidebar'
import Heading from 'todo/components/forms/Heading'
import LineSeparator from 'todo/components/forms/LineSeparator'
import Spacing from 'todo/components/forms/Spacing'
import FormWrapper from 'todo/components/forms/FormWrapper'
import FormSectionHeader from 'todo/components/forms/FormSectionHeader'

const BusinessEnrollmentHome: React.FC = () => {
  const methods = useForm()

  const enrollmentSteps = [
    'Register Business Details',
    'Verify Company Info',
    'Invite Team Members',
    'Assign Roles to Each Member',
    'Start Using the Platform for Transactions & Management',
  ]

  const benefits = [
    'Streamlined business registration process',
    'Role-based access for secure management',
    'Team collaboration with granular permissions',
    'Real-time transaction tracking and reporting',
    'Centralized platform for all state services',
  ]

  return (
    <FormProvider {...methods}>
      <LayoutWithoutSidebar shiftY="-translate-y-8">
        <Heading level={2} align="left" bold>
          🏢 Business Enrollment
        </Heading>

        <Spacing size="lg" />

        <FormSectionHeader
          title="Welcome to Business Enrollment"
          description="Please provide the required information to register your business account. The initial registrant will be designated as the account administrator. Once the business account has been verified, you can invite team members by email and assign roles accordingly."
        />

        <Spacing size="lg" />
        <FormSectionHeader
          title="Objective"
          description="To enable businesses to access and manage state-level services through a single, secure, and collaborative digital platform."
        />

        <Spacing size="lg" />
        <FormSectionHeader
          title="Enrollment Steps"
          description=""
        />
        <ul className="list-decimal list-inside text-sm text-gray-700 space-y-1 pl-4">
          {enrollmentSteps.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ul>

        <Spacing size="lg" />
        <FormSectionHeader
          title="Key Benefits"
          description=""
        />
        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 pl-4">
          {benefits.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>

        <Spacing size="lg" />
        <LineSeparator />
      </LayoutWithoutSidebar>
    </FormProvider>
  )
}

export default BusinessEnrollmentHome
