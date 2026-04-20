import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-night">
      <header className="px-4 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <span className="font-heading text-2xl font-bold text-white tracking-tight">
          Velo<span className="text-action">Trek</span>
        </span>
        <div className="flex gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm" className="text-white border-white/20 hover:bg-white/10">
              Se connecter
            </Button>
          </Link>
          <Link href="/register"><Button size="sm">Commencer</Button></Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-24 text-center space-y-8">
        <h1 className="font-heading text-5xl md:text-6xl font-bold text-white leading-tight">
          Planifie ton prochain<br />
          <span className="text-blue">voyage à vélo</span>
        </h1>
        <p className="text-gray-300 text-xl max-w-2xl mx-auto">
          Trace ta route, calcule distance et dénivelé, importe tes fichiers GPX,
          et documente chaque étape de ton aventure.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/register"><Button size="lg">Créer mon itinéraire →</Button></Link>
          <Link href="/explorer">
            <Button variant="ghost" size="lg" className="text-white border-white/20 hover:bg-white/10">
              Explorer les voyages
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-6 mt-16 text-center">
          {[
            { icon: '🗺️', label: 'Routing cycliste', desc: 'Calcul automatique via Mapbox' },
            { icon: '📍', label: 'Import GPX', desc: 'Compatible avec Komoot et Strava' },
            { icon: '📓', label: 'Carnet de voyage', desc: 'Documente chaque étape' },
          ].map(({ icon, label, desc }) => (
            <div key={label} className="space-y-2">
              <div className="text-4xl">{icon}</div>
              <div className="font-heading font-bold text-white">{label}</div>
              <div className="text-sm text-gray-400">{desc}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
