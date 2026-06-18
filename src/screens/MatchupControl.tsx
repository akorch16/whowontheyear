import { useState } from 'react'
import type { Matchup } from '../types'
import { useGame } from '../store/gameStore'
import { ROUND_META } from '../game/rounds'
import Timer from '../components/Timer'

export default function MatchupControl({ matchup }: { matchup: Matchup }) {
  const { state, pickWinner, vote, useVeto } = useGame()
  const [vetoOpen, setVetoOpen] = useState(false)
  const meta = ROUND_META[matchup.round]
  const entry = (id: string | null) => (id ? state.entries[id] : null)
  const a = entry(matchup.a)
  const b = entry(matchup.b)
  const picker = state.players[state.turnIndex]
  const totalVotes = matchup.votesA + matchup.votesB

  return (
    <div className="rounded-2xl bg-white border-2 border-gray-100 p-5 sm:p-7 space-y-5 shadow-sm">
      {/* Round label + picker */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold tracking-widest uppercase text-gold-dark">
          ★ {meta.label}
        </span>
        {!meta.voting && picker && (
          <span className="text-sm font-semibold text-gray-700">
            Picking: <span className="font-black text-gray-900">{picker.name}</span>
          </span>
        )}
      </div>

      {/* Entry cards */}
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-4 items-stretch">
        <EntryCard
          label={a?.label ?? '— bye —'}
          note={a?.note}
          votes={meta.voting ? matchup.votesA : undefined}
          disabled={!a}
          onClick={() => { if (!a) return; meta.voting ? vote(matchup.id, 'a') : pickWinner(matchup.id, a.id) }}
          mode={meta.voting ? 'vote' : 'pick'}
        />
        <div className="flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border-2 border-gold flex items-center justify-center font-black text-sm text-gray-800 shadow-sm bg-white">
            VS
          </div>
        </div>
        <EntryCard
          label={b?.label ?? '— bye —'}
          note={b?.note}
          votes={meta.voting ? matchup.votesB : undefined}
          disabled={!b}
          onClick={() => { if (!b) return; meta.voting ? vote(matchup.id, 'b') : pickWinner(matchup.id, b.id) }}
          mode={meta.voting ? 'vote' : 'pick'}
        />
      </div>

      {/* Voting-round controls */}
      {meta.voting && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 font-semibold">{totalVotes} vote{totalVotes !== 1 ? 's' : ''} cast</span>
            <button
              onClick={() => setVetoOpen((v) => !v)}
              className="font-bold text-rose-500 hover:underline"
            >
              {vetoOpen ? 'Hide veto' : '⚔️ Veto / argue'}
            </button>
          </div>

          {vetoOpen && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 space-y-3">
              <p className="text-sm text-gray-700">
                2 min to argue · 2 min to counter · then vote. One veto per player, whole game.
              </p>
              <Timer seconds={120} />
              <div className="flex flex-wrap gap-2 pt-1">
                {state.players.map((p) => (
                  <button
                    key={p.id}
                    disabled={p.vetoUsed}
                    onClick={() => useVeto(p.id)}
                    className={`rounded-lg px-3 py-1 text-sm font-bold border transition-colors ${
                      p.vetoUsed
                        ? 'border-gray-200 text-gray-500 line-through bg-white'
                        : 'border-rose-300 text-rose-600 hover:bg-rose-100 bg-white'
                    }`}
                  >
                    {p.name}{p.vetoUsed ? ' · used' : ' · veto'}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Win buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              disabled={!a}
              onClick={() => a && pickWinner(matchup.id, a.id)}
              className="btn-gradient rounded-xl py-3 font-black text-sm"
            >
              {a?.label ?? 'bye'} wins ✓
            </button>
            <button
              disabled={!b}
              onClick={() => b && pickWinner(matchup.id, b.id)}
              className="btn-gradient rounded-xl py-3 font-black text-sm"
            >
              {b?.label ?? 'bye'} wins ✓
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function EntryCard({
  label, note, votes, disabled, onClick, mode,
}: {
  label: string; note?: string; votes?: number;
  disabled: boolean; onClick: () => void; mode: 'pick' | 'vote'
}) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className="text-left rounded-xl border-2 border-gray-100 bg-white px-5 py-5 hover:border-gold disabled:opacity-40 disabled:hover:border-gray-100 transition-colors group"
    >
      <div className="font-serif font-black text-xl leading-tight text-gray-900 group-hover:text-gray-800 mb-1">{label}</div>
      {note && <div className="text-xs text-gray-600 mb-2">{note}</div>}
      <div className="text-xs text-gray-500 font-semibold mt-2">
        {mode === 'vote'
          ? `${votes ?? 0} vote${votes === 1 ? '' : 's'} · tap to +1`
          : 'tap to advance'}
      </div>
    </button>
  )
}
