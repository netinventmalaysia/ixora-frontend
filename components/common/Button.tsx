import { ButtonHTMLAttributes, ReactNode } from 'react';
import classNames from 'classnames';

type ButtonProps = {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  loading?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({ children, variant = 'primary', loading = false, className, ...props }: ButtonProps) {
  const baseStyle = 'inline-flex justify-center items-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2';
  
  const variantStyle = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline-indigo-600',
    secondary: 'text-gray-900 bg-white border border-gray-300 hover:bg-gray-50',
    danger: 'bg-red-600 text-white hover:bg-red-500 focus-visible:outline-red-600',
    ghost: 'text-gray-900 hover:bg-gray-100',
  };

  return (
    <button
      {...props}
      disabled={props.disabled || loading}
      className={classNames(baseStyle, variantStyle[variant], className)}
    >
      {loading ? (
        <svg
          className="animate-spin h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          />
        </svg>
      ) : (
        children
      )}
    </button>
  );
}
