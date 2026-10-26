import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, helperText, error, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold text-[#aaa7b4] uppercase tracking-wider">
            {label}
            {props.required && <span className="text-[#6c3cff] ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`w-full min-h-[44px] px-4 py-3 bg-white/[0.04] hover:bg-white/[0.06] focus:bg-white/[0.08] text-sm text-white placeholder-[#5d5a67] rounded-xl outline-none ring-1 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed ${
            error
              ? 'ring-red-500/80 focus:ring-red-500'
              : 'ring-white/10 focus:ring-2 focus:ring-[#6c3cff]'
          } ${className}`}
          {...props}
        />
        {error && <p className="text-xs text-red-400 font-medium mt-1">{error}</p>}
        {!error && helperText && <p className="text-xs text-[#5d5a67] mt-1">{helperText}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, helperText, error, className = '', id, rows = 3, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold text-[#aaa7b4] uppercase tracking-wider">
            {label}
            {props.required && <span className="text-[#6c3cff] ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          rows={rows}
          className={`w-full px-4 py-3 bg-white/[0.04] hover:bg-white/[0.06] focus:bg-white/[0.08] text-sm text-white placeholder-[#5d5a67] rounded-xl outline-none ring-1 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed ${
            error
              ? 'ring-red-500/80 focus:ring-red-500'
              : 'ring-white/10 focus:ring-2 focus:ring-[#6c3cff]'
          } ${className}`}
          {...props}
        />
        {error && <p className="text-xs text-red-400 font-medium mt-1">{error}</p>}
        {!error && helperText && <p className="text-xs text-[#5d5a67] mt-1">{helperText}</p>}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

export default Input;
