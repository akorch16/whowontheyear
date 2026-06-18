import { useGame } from '../store/gameStore'
import { ROUND_META } from '../game/rounds'
import type { RoundKey } from '../types'

// Compact, scrollable column-per-round overview of the whole bracket.
export default function BracketScreen() {
  const { state } = useGame()
  const label = (id: string | null) =>
    id ? state.entries[id]?.label ?? '?' : '—'

  const roundsPresent = Array.from(
    new Set(state.matchups.map((m) => m.round)),
  ) as RoundKey[]

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-4 min-w-max px-1">
        {roundsPresent.map((round) => {
          const ms = state.matchups
            .filter((m) => m.round === round)
            .sort((a, b) => a.index - b.index)
          return (
            <div key={round} className="w-44 shrink-0 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-accent/80 sticky top-0">
                {ROUND_META[round].label}
              </h3>
              {ms.map((m) => (
                <div
                  key={m.id}
                  className="rounded-md border border-edge bg-panel text-xs overflow-hidden"
                >
                  {(['a', 'b'] as const).map((side) => {
                    const id = m[side]
                    const isWinner = m.winner && m.winner === id
                    return (
                      <div
                        key={side}
                        className={`px-2 py-1.5 truncate ${
                          side === 'a' ? 'border-b border-edge' : ''
                        } ${
                          isWinner
                            ? 'text-accent font-bold'
                            : m.winner
                              ? 'text-white/30 line-through'
                              : 'text-white/80'
                        }`}
                      >
                        {label(id)}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}
