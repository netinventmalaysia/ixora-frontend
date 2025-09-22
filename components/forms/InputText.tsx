import React, { ComponentType, SVGProps, useState, ReactNode } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export type InputTextProps = {
  id: string;
  name: string;
  label: string;
  placeholder?: string;
  prefix?: string;
  requiredMessage?: string;
  colSpan?: string;
  type?: "text" | "password" | "number" | "email";
  showHint?: boolean;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  rightElement?: ReactNode;
  disabled?: boolean;
  readOnly?: boolean;
};

export default function InputText({
  id,
  name,
  label,
  placeholder,
  prefix,
  requiredMessage,
  colSpan = "sm:col-span-3",
  type = "text",
  showHint = false,
  icon,
  rightElement,
  disabled = false,
  readOnly = false,
}: InputTextProps) {
  const {
    register,
    formState: { errors },
    control,
  } = useFormContext();

  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const isEmail = type === "email";
  const isIdentificationField = name === "identificationNumber";

  //Watch the identification type only if relevant
  let selectedIdType: string | null = null;
  if (typeof window !== 'undefined' && isIdentificationField) {
    try {
      selectedIdType = useWatch({ control, name: "identificationType" });
    } catch (e) {
      selectedIdType = null;
    }
  }

  //Validation for password field
  const passwordValidation = {
    required: requiredMessage || "Password is required",
    minLength: { value: 7, message: "Password must be at least 7 characters" },
    validate: (value: string) => {
      if (!/[A-Z]/.test(value)) return "Must include uppercase letter";
      if (!/[a-z]/.test(value)) return "Must include lowercase letter";
      if (!/[^A-Za-z0-9]/.test(value)) return "Must include a symbol";
      return true;
    },
  };

  // Validation for email field
  const emailValidation = {
    required: requiredMessage || "Email is required",
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Please enter a valid email address",
    },
  };

  // Validation for identificationNumber field
  const identificationValidation = {
    required: requiredMessage || "Identification number is required",
    validate: (value: string) => {
      if (!value) return "Identification number is required";

      switch (selectedIdType) {
        case "new_ic":
          return /^\d{12}$/.test(value) || "New IC must be 12 digits";
        case "old_ic":
          return /^\d{8,9}$/.test(value) || "Old IC must be 8–9 digits";
        case "passport":
          return /^[A-Z0-9]{6,9}$/i.test(value) || "Passport must be 6–9 alphanumeric characters";
        case "tentera":
          return value.length >= 4 || "Tentera number must be at least 4 characters";
        default:
          return true;
      }
    },
  };

  // Select the correct validation rule
  const validationRules = isPassword
    ? passwordValidation
    : isEmail
      ? emailValidation
      : isIdentificationField
        ? identificationValidation
        : requiredMessage
          ? { required: requiredMessage }
          : {};

  const IconComponent = icon;

  return (
    <div className={`w-full ${colSpan}`}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-900">
        {label}{requiredMessage && <span className="ml-0.5 text-red-600">*</span>}
      </label>

      <div className="mt-2">
  <div className="flex items-center rounded-md bg-white pl-3 pr-2 outline-1 outline-gray-300 focus-within:outline-2 focus-within:outline-indigo-600">
          {prefix && (
            <span className="shrink-0 text-sm text-gray-500">{prefix}</span>
          )}

          <input
            id={id}
            type={isPassword && showPassword ? "text" : type}
            {...register(name, validationRules)}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly}
            className="block w-full grow py-1.5 pl-1 pr-1 text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
          />

          {isPassword ? (
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="ml-2 text-gray-500 hover:text-gray-700"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          ) : IconComponent ? (
            <span className="ml-2 text-gray-400">
              <IconComponent className="h-5 w-5" />
            </span>
          ) : null}

          {rightElement && <span className="ml-2">{rightElement}</span>}
        </div>

        {isPassword && showHint && (
          <p className="mt-1 text-xs text-gray-500">
            Use at least 7 characters, uppercase, lowercase, and symbol.
          </p>
        )}

        {errors[name] && (
          <p className="mt-1 text-sm text-red-500">
            {errors[name]?.message as string}
          </p>
        )}
      </div>
    </div>
  );
}
