import { useGame } from '../store/gameStore'
import { ROUND_META } from '../game/rounds'
import type { RoundKey } from '../types'

export default function BracketScreen() {
  const { state } = useGame()
  const label = (id: string | null) => id ? state.entries[id]?.label ?? '?' : '—'

  const roundsPresent = Array.from(new Set(state.matchups.map((m) => m.round))) as RoundKey[]

  return (
    <div className="overflow-x-auto pb-2 -mx-5 px-5">
      <div className="flex gap-3 min-w-max">
        {roundsPresent.map((round) => {
          const ms = state.matchups
            .filter((m) => m.round === round)
            .sort((a, b) => a.index - b.index)
          return (
            <div key={round} className="w-40 shrink-0 space-y-1.5">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gold-dark sticky top-0 bg-white py-1">
                {ROUND_META[round].label}
              </h3>
              {ms.map((m) => (
                <div key={m.id} className="rounded-lg border border-gray-100 bg-white text-xs overflow-hidden">
                  {(['a', 'b'] as const).map((side) => {
                    const id = m[side]
                    const isWinner = m.winner && m.winner === id
                    return (
                      <div
                        key={side}
                        className={`px-2 py-1.5 truncate ${side === 'a' ? 'border-b border-gray-50' : ''} ${
                          isWinner
                            ? 'text-gold-dark font-black'
                            : m.winner
                              ? 'text-gray-300 line-through'
                              : 'text-gray-700 font-semibold'
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
