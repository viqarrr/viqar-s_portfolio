import React from 'react';

export interface BadgeProps {
  status: 'draft' | 'published' | string;
  className?: string;
}

export function Badge({ status, className = '' }: BadgeProps) {
  const isPublished = status === 'published';

  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold capitalize tracking-wide transition-all select-none ${
        isPublished
          ? 'bg-emerald-500/15 text-emerald-300'
          : 'bg-amber-500/15 text-amber-300'
      } ${className}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          isPublished ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]' : 'bg-amber-400'
        }`}
      />
      {status}
    </span>
  );
}

export default Badge;
