import React from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import LayoutWithoutSidebar from 'todo/components/main/LayoutWithoutSidebar'
import Heading from 'todo/components/forms/Heading'
import LineSeparator from 'todo/components/forms/LineSeparator'
import Spacing from 'todo/components/forms/Spacing'
import FormWrapper from 'todo/components/forms/FormWrapper'
import FormSectionHeader from 'todo/components/forms/FormSectionHeader'

const Home: React.FC = () => {
  const methods = useForm()

  const flowSteps = [
    'Consultant Login',
    'Register Owner / Company',
    'Create Project & Link to Owner',
    'Submit Application to MBMB',
    'MBMB Review & Approve',
    'Pay Fee',
    'Generate Award Letter',
  ]

  const benefits = [
    'Centralized project and consultant management',
    'Digital tracking of approvals and payments',
    'Automatic generation of award letters',
    'Transparent communication between consultants and MBMB',
    'Audit-friendly with document traceability',
  ]

  return (
    <FormProvider {...methods}>
      <LayoutWithoutSidebar shiftY="-translate-y-0">
          <Heading level={2} align="left" bold>
            🏗️ MYSKB - Sistem Kawalan Bangunan
          </Heading>

          <Spacing size="lg" />

          <FormSectionHeader
            title="What is MYSKB?"
            description="MYSKB is a digital system developed to streamline and digitize the building control process under the supervision of Majlis Bandaraya Melaka Bersejarah (MBMB). This system empowers appointed consultants to manage construction projects efficiently while complying with MBMB’s regulations."
          />

          <Spacing size="lg" />
          <FormSectionHeader
            title="Objective"
            description="To centralize and digitalize the management of building project registrations, approvals, and fee payments through a traceable platform—bridging consultants, project owners, and MBMB administrators."
          />

          <Spacing size="lg" />
          <FormSectionHeader
            title="System Flow"
            description=""
          />
          <ul className="list-decimal list-inside text-sm text-gray-700 space-y-1 pl-4">
            {flowSteps.map((step, index) => (
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

export default Home
