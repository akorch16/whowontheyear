import { useState } from 'react'
import { useGame } from '../store/gameStore'
import { ROUND_META } from '../game/rounds'
import MatchupControl from './MatchupControl'
import BracketScreen from './BracketScreen'

export default function PlayScreen() {
  const { state, reset } = useGame()
  const [showBracket, setShowBracket] = useState(false)

  const roundMatchups = state.matchups
    .filter((m) => m.round === state.currentRound)
    .sort((a, b) => a.index - b.index)

  const active = roundMatchups.find((m) => m.winner === null)
  const done = roundMatchups.filter((m) => m.winner !== null).length
  const meta = ROUND_META[state.currentRound]

  return (
    <div className="max-w-3xl mx-auto px-4 py-5 space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="font-black text-xl">{meta.label}</div>
          <div className="text-xs text-white/40">
            {done}/{roundMatchups.length} matchups decided ·{' '}
            {meta.voting ? 'group vote' : 'pickers rotate'}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowBracket((v) => !v)}
            className="rounded-md border border-edge px-3 py-1.5 text-sm hover:border-accent"
          >
            {showBracket ? 'Hide' : 'Bracket'}
          </button>
          <button
            onClick={() => {
              if (confirm('Start a new game? This clears the current bracket.'))
                reset()
            }}
            className="rounded-md border border-edge px-3 py-1.5 text-sm hover:border-accent2"
          >
            New
          </button>
        </div>
      </div>

      <div className="h-1.5 rounded-full bg-edge overflow-hidden">
        <div
          className="h-full bg-accent transition-all"
          style={{
            width: `${roundMatchups.length ? (done / roundMatchups.length) * 100 : 0}%`,
          }}
        />
      </div>

      {showBracket && <BracketScreen />}

      {active ? (
        <MatchupControl matchup={active} />
      ) : (
        <div className="text-center text-white/50 py-10">
          Round complete — advancing…
        </div>
      )}

      {/* Up next preview */}
      {active && roundMatchups.filter((m) => m.winner === null).length > 1 && (
        <div className="text-xs text-white/40">
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
        </div>
      )}
    </div>
  )
}
