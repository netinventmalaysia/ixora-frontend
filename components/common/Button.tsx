import { ButtonHTMLAttributes, ReactNode } from 'react';
import classNames from 'classnames';

type ButtonProps = {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({ children, variant = 'primary', className, ...props }: ButtonProps) {
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
      className={classNames(baseStyle, variantStyle[variant], className)}
    >
      {children}
    </button>
  );
}
