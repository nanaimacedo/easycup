'use client';

import { FieldError } from 'react-hook-form';

interface FormFieldProps {
  label: string;
  error?: FieldError;
  children: React.ReactNode;
  required?: boolean;
  hint?: string;
}

export default function FormField({ label, error, children, required, hint }: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-[var(--color-text)]">
        {label}
        {required && <span className="text-[var(--color-error)] ml-0.5">*</span>}
      </label>
      {hint && <p className="text-xs text-[var(--color-text-muted)]">{hint}</p>}
      {children}
      {error && (
        <p className="text-xs text-[var(--color-error)] mt-1 animate-fade-in">{error.message}</p>
      )}
    </div>
  );
}

export function Input({
  className = '',
  hasError,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { hasError?: boolean }) {
  return (
    <input
      className={`
        w-full px-3 py-2.5 rounded-lg border text-sm
        bg-white transition-all duration-200
        placeholder:text-[var(--color-text-muted)]
        focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)]/20 focus:border-[var(--color-border-focus)]
        ${hasError ? 'border-[var(--color-error)] ring-2 ring-[var(--color-error)]/10' : 'border-[var(--color-border)]'}
        ${className}
      `}
      {...props}
    />
  );
}

export function Select({
  className = '',
  hasError,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { hasError?: boolean }) {
  return (
    <select
      className={`
        w-full px-3 py-2.5 rounded-lg border text-sm
        bg-white transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)]/20 focus:border-[var(--color-border-focus)]
        ${hasError ? 'border-[var(--color-error)] ring-2 ring-[var(--color-error)]/10' : 'border-[var(--color-border)]'}
        ${className}
      `}
      {...props}
    >
      {children}
    </select>
  );
}

export function Checkbox({
  label,
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; error?: FieldError }) {
  return (
    <div>
      <label className="flex items-start gap-3 cursor-pointer group">
        <input
          type="checkbox"
          className="mt-1 w-4 h-4 rounded border-[var(--color-border)] text-[var(--color-primary)] focus:ring-[var(--color-primary)] cursor-pointer"
          {...props}
        />
        <span className="text-sm text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors">
          {label}
        </span>
      </label>
      {error && (
        <p className="text-xs text-[var(--color-error)] mt-1 ml-7 animate-fade-in">{error.message}</p>
      )}
    </div>
  );
}
