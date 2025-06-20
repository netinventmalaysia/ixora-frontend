import React from 'react';
import clsx from 'clsx';

export type BadgeProps = {
  label: string;
  color?: 'gray' | 'red' | 'yellow' | 'green' | 'blue' | 'indigo' | 'purple' | 'pink';
};

const colorClassMap = {
  gray: {
    bg: 'bg-gray-100',
    text: 'text-gray-600',
    dot: 'fill-gray-400',
  },
  red: {
    bg: 'bg-red-100',
    text: 'text-red-700',
    dot: 'fill-red-500',
  },
  yellow: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    dot: 'fill-yellow-500',
  },
  green: {
    bg: 'bg-green-100',
    text: 'text-green-700',
    dot: 'fill-green-500',
  },
  blue: {
    bg: 'bg-blue-100',
    text: 'text-blue-700',
    dot: 'fill-blue-500',
  },
  indigo: {
    bg: 'bg-indigo-100',
    text: 'text-indigo-700',
    dot: 'fill-indigo-500',
  },
  purple: {
    bg: 'bg-purple-100',
    text: 'text-purple-700',
    dot: 'fill-purple-500',
  },
  pink: {
    bg: 'bg-pink-100',
    text: 'text-pink-700',
    dot: 'fill-pink-500',
  },
};

const Badge: React.FC<BadgeProps> = ({ label, color = 'red' }) => {
  const classes = colorClassMap[color];

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-x-1.5 rounded-full px-1.5 py-0.5 text-xs font-medium',
        classes.bg,
        classes.text
      )}
    >

      {label}
    </span>
  );
};

export default Badge;
