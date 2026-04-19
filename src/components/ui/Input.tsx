import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-ink">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'min-h-[44px] w-full rounded-lg border border-gray-300 px-3 py-2',
            'text-base text-ink placeholder:text-muted',
            'focus:outline-none focus:ring-2 focus:ring-blue focus:border-transparent',
            'disabled:bg-gray-100 disabled:cursor-not-allowed',
            error && 'border-action focus:ring-action',
            className,
          )}
          {...props}
        />
        {error && <p className="text-sm text-action">{error}</p>}
      </div>
    )
  },
)
Input.displayName = 'Input'
