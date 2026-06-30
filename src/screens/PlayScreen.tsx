import { useState } from 'react'
import { useGame } from '../store/gameStore'
import { ROUND_META } from '../game/rounds'
import MatchupControl from './MatchupControl'
import BracketScreen from './BracketScreen'
import RoundCompleteSplash from '../components/RoundCompleteSplash'

export default function PlayScreen() {
  const { state, reset, clearCompletedRound } = useGame()
  const [showBracket, setShowBracket] = useState(false)

  const roundMatchups = state.matchups
    .filter((m) => m.round === state.currentRound)
    .sort((a, b) => a.index - b.index)

  const active = roundMatchups.find((m) => m.winner === null)
  const done = roundMatchups.filter((m) => m.winner !== null).length
  const meta = ROUND_META[state.currentRound]
  const pct = roundMatchups.length ? (done / roundMatchups.length) * 100 : 0

  return (
    <div className="max-w-2xl mx-auto px-5 py-7 space-y-5">
      {/* Round header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-serif font-black text-xl sm:text-2xl tracking-tight">{meta.label}</h2>
          <p className="text-xs text-gray-600 font-semibold mt-0.5">
            {done}/{roundMatchups.length} matchups · {meta.voting ? 'group vote' : 'rotating pickers'}
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => setShowBracket((v) => !v)}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-semibold hover:border-gold transition-colors"
          >
            {showBracket ? 'Hide' : 'Bracket'}
          </button>
          <button
            onClick={() => { if (confirm('Start a new game? This clears the current bracket.')) reset() }}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-semibold hover:border-rose-300 transition-colors text-gray-700"
          >
            New
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #F5C518, #C9A000)' }}
        />
      </div>

      {showBracket && <BracketScreen />}

      {active ? (
        <MatchupControl matchup={active} />
      ) : (
        <div className="text-center text-gray-600 py-12 font-semibold">
          Round complete — advancing…
        </div>
      )}

      {/* Up next */}
      {active && roundMatchups.filter((m) => m.winner === null).length > 1 && (
        <p className="text-xs text-gray-500 font-semibold line-clamp-2">
          Up next:{' '}
          {roundMatchups
            .filter((m) => m.winner === null && m.id !== active.id)
            .slice(0, 3)
            .map((m) => {
              const a = m.a ? state.entries[m.a]?.label : 'bye'
              const b = m.b ? state.entries[m.b]?.label : 'bye'
              return `${a} vs ${b}`
            })
            .join('  ·  ')}
        </p>
      )}

      {state.completedRound && (
        <RoundCompleteSplash
          round={state.completedRound}
          onDone={clearCompletedRound}
        />
      )}
    </div>
  )
}
