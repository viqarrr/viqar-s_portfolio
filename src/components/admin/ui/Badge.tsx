import React from 'react';

export interface BadgeProps {
  status: 'draft' | 'published' | string;
  className?: string;
}

export function Badge({ status, className = '' }: BadgeProps) {
  const isPublished = status === 'published';

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold capitalize tracking-wide transition-colors ${
        isPublished
          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/80'
          : 'bg-amber-950/80 text-amber-300 border border-amber-800/80'
      } ${className}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          isPublished ? 'bg-emerald-400' : 'bg-amber-400'
        }`}
      />
      {status}
    </span>
  );
}

export default Badge;
