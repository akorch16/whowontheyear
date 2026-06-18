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

  // Bye handling: if one side is empty, the other auto-advances on click.
  const totalVotes = matchup.votesA + matchup.votesB

  return (
    <div className="rounded-xl bg-panel border border-edge p-4 sm:p-6 space-y-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-accent">
          {meta.label}
        </span>
        {!meta.voting && picker && (
          <span className="text-sm">
            <span className="text-white/40">Picking: </span>
            <span className="font-bold text-white">{picker.name}</span>
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-3 items-stretch">
        <Side
          label={a?.label ?? '— bye —'}
          note={a?.note}
          votes={meta.voting ? matchup.votesA : undefined}
          disabled={!a}
          onClick={() => {
            if (!a) return
            meta.voting ? vote(matchup.id, 'a') : pickWinner(matchup.id, a.id)
          }}
          mode={meta.voting ? 'vote' : 'pick'}
        />
        <div className="flex items-center justify-center text-white/30 font-black">
          VS
        </div>
        <Side
          label={b?.label ?? '— bye —'}
          note={b?.note}
          votes={meta.voting ? matchup.votesB : undefined}
          disabled={!b}
          onClick={() => {
            if (!b) return
            meta.voting ? vote(matchup.id, 'b') : pickWinner(matchup.id, b.id)
          }}
          mode={meta.voting ? 'vote' : 'pick'}
        />
      </div>

      {meta.voting && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/50">{totalVotes} votes cast</span>
            <button
              onClick={() => setVetoOpen((v) => !v)}
              className="text-accent2 font-semibold hover:underline"
            >
              {vetoOpen ? 'Hide veto' : 'Veto / argue'}
            </button>
          </div>

          {vetoOpen && (
            <div className="rounded-lg border border-accent2/40 bg-accent2/5 p-4 space-y-3">
              <p className="text-sm text-white/70">
                2 minutes to argue, 2 to counter, then vote. Each player has one
                veto for the whole game.
              </p>
              <Timer seconds={120} />
              <div className="flex flex-wrap gap-2 pt-1">
                {state.players.map((p) => (
                  <button
                    key={p.id}
                    disabled={p.vetoUsed}
                    onClick={() => useVeto(p.id)}
                    className={`rounded-md px-3 py-1 text-sm border ${
                      p.vetoUsed
                        ? 'border-edge text-white/30 line-through'
                        : 'border-accent2/60 text-white hover:bg-accent2/20'
                    }`}
                  >
                    {p.name}
                    {p.vetoUsed ? ' · used' : ' · veto'}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <button
              disabled={!a}
              onClick={() => a && pickWinner(matchup.id, a.id)}
              className="rounded-lg py-2 font-bold bg-accent text-ink disabled:bg-edge disabled:text-white/30"
            >
              {a?.label ?? 'bye'} wins
            </button>
            <button
              disabled={!b}
              onClick={() => b && pickWinner(matchup.id, b.id)}
              className="rounded-lg py-2 font-bold bg-accent text-ink disabled:bg-edge disabled:text-white/30"
            >
              {b?.label ?? 'bye'} wins
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function Side({
  label,
  note,
  votes,
  disabled,
  onClick,
  mode,
}: {
  label: string
  note?: string
  votes?: number
  disabled: boolean
  onClick: () => void
  mode: 'pick' | 'vote'
}) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className="text-left rounded-lg border border-edge bg-ink/40 px-4 py-4 hover:border-accent disabled:opacity-40 disabled:hover:border-edge transition-colors"
    >
      <div className="font-bold text-lg leading-tight">{label}</div>
      {note && <div className="text-xs text-white/40 mt-1">{note}</div>}
      <div className="text-xs text-white/40 mt-2">
        {mode === 'vote'
          ? `${votes ?? 0} vote${votes === 1 ? '' : 's'} · tap to +1`
          : 'tap to advance'}
      </div>
    </button>
  )
}
