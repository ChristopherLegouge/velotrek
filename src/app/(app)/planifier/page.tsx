import dynamic from 'next/dynamic'

const MapBase = dynamic(
  () => import('@/components/map/MapBase').then(m => m.MapBase),
  { ssr: false, loading: () => <div className="h-full w-full bg-night animate-pulse" /> }
)

export default function PlanifierPage() {
  return (
    <div className="-mx-4 -mt-8 h-[calc(100vh-64px)] flex">
      <aside className="w-80 bg-white border-r border-gray-200 p-6 overflow-y-auto flex-shrink-0">
        <h1 className="font-heading text-xl font-bold text-ink mb-4">Nouveau voyage</h1>
        <p className="text-sm text-muted">
          Le module de planification arrive en Phase 2.
          La carte est prête ✅
        </p>
      </aside>
      <div className="flex-1 relative">
        <MapBase className="h-full w-full" />
      </div>
    </div>
  )
}
