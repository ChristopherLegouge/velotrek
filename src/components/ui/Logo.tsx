import Link from 'next/link'
import { cn } from '@/lib/utils'

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn('font-heading text-2xl font-bold tracking-tight', className)}>
      Velo<span className="text-action">Trek</span>
    </Link>
  )
}
