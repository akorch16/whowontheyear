import { useMemo, useState } from 'react'
import { useGame, FIELD_SIZE, type SetupConfig } from '../store/gameStore'
import { shuffle } from '../game/bracket'
import {
  SEED_PLAYERS,
  SEED_ENTRIES_BASE,
  SEED_PLAYIN_PAIRS,
} from '../game/seed'

const linesOf = (s: string) =>
  s.split('\n').map((l) => l.trim()).filter(Boolean)

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

  const randomize = () => {
    setEntries(shuffle(baseList).join('\n'))
    // The previewed order is now the bracket order — don't re-shuffle at start.
    setShuffleSeeds(false)
  }

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
    <div className="max-w-2xl mx-auto px-5 py-8 space-y-7">
      <div className="border-b border-gray-100 pb-6">
        <h2 className="font-serif font-black text-3xl tracking-tight mb-1">
          Set up your bracket
        </h2>
        <p className="text-gray-600 text-sm font-semibold">
          You need exactly <span className="text-gray-700 font-bold">{FIELD_SIZE}</span> contenders —
          base entries + one winner per play-in matchup.
        </p>
      </div>

      <Section title="Players" hint="One name per line. Turn order follows this list.">
        <textarea className={ta} rows={5} value={players} onChange={(e) => setPlayers(e.target.value)} />
        <Counter ok={playersOk} label={`${playerList.length} players`} need="min 2" />
      </Section>

      <Section title="Contenders" hint="One per line. People, things, concepts — anything goes.">
        <textarea className={ta} rows={12} value={entries} onChange={(e) => setEntries(e.target.value)} />
        <div className="flex items-center justify-between gap-3">
          <Counter ok={baseList.length > 0} label={`${baseList.length} base entries`} need={`need ${FIELD_SIZE - playInPairs.length} to fill the field`} />
          <button
            type="button"
            onClick={randomize}
            disabled={baseList.length < 2}
            className="shrink-0 rounded-lg border border-gold bg-white px-3 py-1.5 text-sm font-bold text-gold-dark hover:bg-gold/10 disabled:opacity-40 transition-colors"
          >
            <span className="sm:hidden">🎲 Randomize</span><span className="hidden sm:inline">🎲 Randomize matchups</span>
          </button>
        </div>
        <p className="text-xs text-gray-500">
          Re-rolls the order so unrelated contenders face off in Round of 64. Hit it until you like the chaos.
        </p>
      </Section>

      <Section title="Play-in matchups" hint={'One per line as "A vs B". Winner of each joins the field.'}>
        <textarea className={ta} rows={4} value={playIn} onChange={(e) => setPlayIn(e.target.value)} />
        <Counter ok={playInPairs.length > 0} label={`${playInPairs.length} play-in matchups`} need="optional" />
      </Section>

      <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
        <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer select-none text-gray-700">
          <input
            type="checkbox"
            checked={shuffleSeeds}
            onChange={(e) => setShuffleSeeds(e.target.checked)}
            className="accent-gold"
          />
          Shuffle order at start (random matchups)
        </label>
        <span className={`text-sm font-black ${fieldOk ? 'text-emerald-500' : 'text-rose-400'}`}>
          Field: {fieldTotal}/{FIELD_SIZE}
        </span>
      </div>

      <button
        disabled={!canStart}
        onClick={begin}
        className="btn-gradient w-full rounded-xl py-4 font-black text-base tracking-wide"
      >
        {canStart
          ? 'Start the bracket →'
          : !playersOk
            ? 'Add at least 2 players'
            : `Need ${FIELD_SIZE} contenders (have ${fieldTotal})`}
      </button>
    </div>
  )
}

const ta =
  'w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm leading-6 outline-none focus:border-gold resize-y font-sans'

function Section({ title, hint, children }: { title: string; hint: string; children: React.ReactNode }) {
  return (
    <section className="space-y-2">
      <div>
        <h3 className="font-bold text-gray-900">{title}</h3>
        <p className="text-xs text-gray-600">{hint}</p>
      </div>
      {children}
    </section>
  )
}

function Counter({ ok, label, need }: { ok: boolean; label: string; need: string }) {
  return (
    <p className="text-xs">
      <span className={ok ? 'text-emerald-500 font-semibold' : 'text-gray-600'}>{label}</span>
      <span className="text-gray-500"> · {need}</span>
    </p>
  )
}
