import { buildVase } from '@/geometry/buildVase'
import { DEFAULT_PARAMS } from '@/config/parameters'

// Stage 2: the algorithm exists. No 3D yet — we prove it works with numbers and tests.
export default function App() {
  const { stats } = buildVase(DEFAULT_PARAMS)
  return (
    <main className="min-h-dvh grid place-items-center bg-paper text-ink p-8">
      <div className="max-w-xl">
        <h1 className="font-display text-6xl">Vessel</h1>
        <p className="mt-4 text-ink-muted">The algorithm runs. Default vase:</p>
        <pre className="mt-4 font-mono text-sm">{JSON.stringify(stats, null, 2)}</pre>
      </div>
    </main>
  )
}
