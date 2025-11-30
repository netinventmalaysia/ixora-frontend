import React from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from '@/utils/i18n'

/**
 * TeamMember tab content: basic user info form fields
 * Wrapped by FormWrapper (which provides react-hook-form context and handles submission).
 */
const Team: React.FC = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext()
  const { t } = useTranslation()

  return (
    <div className="space-y-6">
      {/* Applicant Name */}
      <div>
        <label htmlFor="applicantName" className="block text-sm font-medium text-gray-700">
          {t('myskb.team.fields.applicantName', 'Applicant Name')}
        </label>
      </div>

    </div>
  )
}

export default Team
