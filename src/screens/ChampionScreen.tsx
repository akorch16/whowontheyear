import { useGame } from '../store/gameStore'

export default function ChampionScreen() {
  const { state, reset } = useGame()
  const champ = state.champion ? state.entries[state.champion] : null

  return (
    <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6">
      <div className="text-sm uppercase tracking-[0.3em] text-accent">
        Who Won The Year
      </div>
      <div className="text-6xl">🏆</div>
      <h2 className="text-4xl sm:text-5xl font-black leading-tight">
        {champ?.label ?? 'Champion'}
      </h2>
      {champ?.note && <p className="text-white/50">{champ.note}</p>}
      <p className="text-white/60">
        won the year against a field of 64. Organized chaos, settled.
      </p>
      <button
        onClick={() => reset()}
        className="rounded-lg bg-accent text-ink font-bold px-6 py-3"
      >
        Run it back
      </button>
    </div>
  )
}
