export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-night flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="font-heading text-3xl font-bold text-white tracking-tight">
            Velo<span className="text-action">Trek</span>
          </h1>
          <p className="mt-2 text-muted text-sm">Voyages à vélo personnalisés</p>
        </div>
        <div className="bg-white rounded-2xl p-8 shadow-xl">{children}</div>
      </div>
    </div>
  )
}
