import React from 'react';

export default function UserAvatar({ name, className = '' }) {
  const initial = name?.trim().charAt(0).toUpperCase() || '?';

  return (
    <span
      aria-label={name ? `${name} avatar` : 'User avatar'}
      className={`flex items-center justify-center rounded-full bg-forest-100 text-forest-800 font-bold ${className}`}
    >
      {initial}
    </span>
  );
}
