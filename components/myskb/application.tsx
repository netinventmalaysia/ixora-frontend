import React from 'react'
import { useFormContext } from 'react-hook-form'

/**
 * MyApplication tab content: basic user info form fields
 * Wrapped by FormWrapper (which provides react-hook-form context and handles submission).
 */
const Application: React.FC = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  return (
    <div className="space-y-6">
      {/* Applicant Name */}
      <div>
        <label htmlFor="applicantName" className="block text-sm font-medium text-gray-700">
          Applicant Name
        </label>
      </div>

    </div>
  )
}

export default Application
