'use client'

import Link from 'next/link'
import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { deleteTrip, duplicateTrip, togglePublic } from '@/actions/trips'

interface TripCardProps {
  id: string
  title: string
  status: 'draft' | 'active' | 'completed'
  stageCount: number
  totalDistanceKm: number
  createdAt: string
  isPublic: boolean
}

const STATUS_LABELS   = { draft: 'Brouillon', active: 'En cours', completed: 'Terminé' }
const STATUS_VARIANTS = { draft: 'default', active: 'info', completed: 'success' } as const

export function TripCard({
  id, title, status, stageCount, totalDistanceKm, createdAt, isPublic,
}: TripCardProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function handleDuplicate() {
    startTransition(async () => {
      const newId = await duplicateTrip(id)
      router.refresh()
      if (newId) router.push(`/planifier/${newId}`)
    })
  }

  function handleDelete() {
    if (!confirm(`Supprimer "${title}" ? Cette action est irréversible.`)) return
    startTransition(async () => { await deleteTrip(id) })
  }

  function handleTogglePublic() {
    startTransition(async () => {
      await togglePublic(id, !isPublic)
      router.refresh()
    })
  }

  function handleCopyLink() {
    const url = `${window.location.origin}/trip/${id}`
    navigator.clipboard.writeText(url)
    alert('Lien copié !')
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-3 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <Link href={`/planifier/${id}`} className="font-heading font-bold text-ink hover:text-blue transition-colors">
          {title}
        </Link>
        <Badge variant={STATUS_VARIANTS[status]}>{STATUS_LABELS[status]}</Badge>
      </div>

      <div className="flex items-center gap-4 text-sm text-muted flex-wrap">
        <span>{stageCount} étape{stageCount !== 1 ? 's' : ''}</span>
        {totalDistanceKm > 0 && <span>{totalDistanceKm.toFixed(1)} km</span>}
        <span>{new Date(createdAt).toLocaleDateString('fr-FR')}</span>
        {isPublic && (
          <button className="text-blue hover:underline text-xs" onClick={handleCopyLink}>
            📋 Copier le lien
          </button>
        )}
      </div>

      <div className="flex gap-2 pt-1 flex-wrap">
        <Link href={`/planifier/${id}`}>
          <Button variant="secondary" size="sm">Modifier</Button>
        </Link>
        <Button variant="ghost" size="sm" onClick={handleTogglePublic} loading={isPending}>
          {isPublic ? '🔒 Rendre privé' : '🌍 Partager'}
        </Button>
        <Button variant="ghost" size="sm" onClick={handleDuplicate}>
          Dupliquer
        </Button>
        <Button variant="danger" size="sm" onClick={handleDelete}>
          Supprimer
        </Button>
      </div>
    </div>
  )
}
