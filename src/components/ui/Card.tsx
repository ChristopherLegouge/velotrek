import { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export function Card({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('rounded-xl bg-white shadow-sm border border-gray-100 p-5', className)}
      {...props}
    >
      {children}
    </div>
  )
}
