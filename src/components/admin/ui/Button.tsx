import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'destructive' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#6c3cff]/50 disabled:opacity-40 disabled:pointer-events-none select-none active:scale-[0.98] min-h-[44px]';

  const sizeStyles = {
    sm: 'text-xs px-3.5 py-2 gap-1.5 min-w-[44px]',
    md: 'text-sm px-4.5 py-2.5 gap-2 min-w-[44px]',
    lg: 'text-base px-6 py-3 gap-2.5 min-w-[48px] rounded-2xl',
  };

  const variantStyles = {
    primary:
      'bg-[#6c3cff] hover:bg-[#5a2de0] text-white shadow-sm font-semibold',
    secondary:
      'bg-[#18171f] hover:bg-[#1f1d26] text-white',
    destructive:
      'bg-red-500/15 hover:bg-red-500/25 text-red-400 font-medium',
    ghost:
      'bg-transparent hover:bg-white/[0.06] text-[#aaa7b4] hover:text-white',
  };

  return (
    <button
      disabled={disabled || loading}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin w-4 h-4 text-current"
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
      )}
      {children}
    </button>
  );
}

export default Button;
