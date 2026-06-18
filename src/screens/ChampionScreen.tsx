import { useGame } from '../store/gameStore'

export default function ChampionScreen() {
  const { state, reset } = useGame()
  const champ = state.champion ? state.entries[state.champion] : null

  return (
    <div className="max-w-xl mx-auto px-5 py-20 text-center space-y-7">
      <div className="text-xs font-bold tracking-[0.3em] uppercase text-gold-dark">
        ★ Who Won The Year ★
      </div>
      <div className="text-7xl select-none">🏆</div>
      <h2 className="font-serif font-black leading-tight tracking-tight text-gray-900"
          style={{ fontSize: 'clamp(40px, 10vw, 68px)' }}>
        {champ?.label ?? 'Champion'}
      </h2>
      {champ?.note && <p className="text-gray-400 font-semibold">{champ.note}</p>}
      <p className="text-gray-400 font-semibold text-base max-w-sm mx-auto">
        Beat a field of 64 through organized chaos.
        The year has been settled.
      </p>
      <button
        onClick={() => reset()}
        className="btn-gradient inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-black text-base"
      >
        Run it back
      </button>
    </div>
  )
}
