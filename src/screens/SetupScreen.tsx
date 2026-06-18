import { useMemo, useState } from 'react'
import { useGame, FIELD_SIZE, type SetupConfig } from '../store/gameStore'
import {
  SEED_PLAYERS,
  SEED_ENTRIES_BASE,
  SEED_PLAYIN_PAIRS,
} from '../game/seed'

const linesOf = (s: string) =>
  s
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)

export default function SetupScreen() {
  const { start } = useGame()
  const [players, setPlayers] = useState(SEED_PLAYERS.join('\n'))
  const [entries, setEntries] = useState(SEED_ENTRIES_BASE.join('\n'))
  const [playIn, setPlayIn] = useState(
    SEED_PLAYIN_PAIRS.map(([a, b]) => `${a} vs ${b}`).join('\n'),
  )
  const [shuffleSeeds, setShuffleSeeds] = useState(true)

  const playerList = useMemo(() => linesOf(players), [players])
  const baseList = useMemo(() => linesOf(entries), [entries])
  const playInPairs = useMemo<[string, string][]>(
    () =>
      linesOf(playIn)
        .map((l) => l.split(/\s+vs\.?\s+/i))
        .filter((p) => p.length === 2)
        .map((p) => [p[0].trim(), p[1].trim()] as [string, string]),
    [playIn],
  )

  const fieldTotal = baseList.length + playInPairs.length
  const fieldOk = fieldTotal === FIELD_SIZE
  const playersOk = playerList.length >= 2
  const canStart = fieldOk && playersOk

  const begin = () => {
    const config: SetupConfig = {
      playerNames: playerList,
      baseEntries: baseList.map((label) => ({ label })),
      playInPairs,
      shuffleSeeds,
    }
    start(config)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      <p className="text-white/60 text-sm">
        Set up this year's field. The bracket needs exactly{' '}
        <b className="text-white">{FIELD_SIZE}</b> contenders — base entries plus
        one winner from each play-in matchup.
      </p>

      <Section
        title="Players"
        hint="One name per line. Turn order follows this list in the pick rounds."
      >
        <textarea
          className={taClass}
          rows={5}
          value={players}
          onChange={(e) => setPlayers(e.target.value)}
        />
        <Counter ok={playersOk} label={`${playerList.length} players`} need="min 2" />
      </Section>

      <Section
        title="Base entries"
        hint="One per line. People, things, concepts — anything goes."
      >
        <textarea
          className={taClass}
          rows={12}
          value={entries}
          onChange={(e) => setEntries(e.target.value)}
        />
      </Section>

      <Section
        title="Play-in matchups (optional)"
        hint={'One per line as "A vs B". The winner of each joins the field.'}
      >
        <textarea
          className={taClass}
          rows={4}
          value={playIn}
          onChange={(e) => setPlayIn(e.target.value)}
        />
        <Counter
          ok={playInPairs.length > 0}
          label={`${playInPairs.length} play-in matchups`}
          need="optional"
        />
      </Section>

      <div className="flex items-center justify-between rounded-lg bg-panel border border-edge px-4 py-3">
        <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
          <input
            type="checkbox"
            checked={shuffleSeeds}
            onChange={(e) => setShuffleSeeds(e.target.checked)}
          />
          Shuffle the bracket seeding
        </label>
        <span
          className={`text-sm font-semibold ${fieldOk ? 'text-emerald-400' : 'text-accent2'}`}
        >
          Field: {fieldTotal}/{FIELD_SIZE}
        </span>
      </div>

      <button
        disabled={!canStart}
        onClick={begin}
        className="w-full rounded-lg py-3 font-bold text-ink bg-accent disabled:bg-edge disabled:text-white/40 transition-colors"
      >
        {canStart
          ? 'Start the bracket'
          : !playersOk
            ? 'Add at least 2 players'
            : `Need ${FIELD_SIZE} contenders (have ${fieldTotal})`}
      </button>
    </div>
  )
}

const taClass =
  'w-full rounded-lg bg-panel border border-edge px-3 py-2 text-sm leading-6 outline-none focus:border-accent resize-y'

function Section({
  title,
  hint,
  children,
}: {
  title: string
  hint: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-2">
      <div>
        <h2 className="font-bold">{title}</h2>
        <p className="text-xs text-white/40">{hint}</p>
      </div>
      {children}
    </section>
  )
}

function Counter({ ok, label, need }: { ok: boolean; label: string; need: string }) {
  return (
    <p className="text-xs">
      <span className={ok ? 'text-emerald-400' : 'text-white/50'}>{label}</span>
      <span className="text-white/30"> · {need}</span>
    </p>
  )
}
