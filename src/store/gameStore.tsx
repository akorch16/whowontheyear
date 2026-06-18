import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  type ReactNode,
} from 'react'
import type { Entry, EntryId, GameState, Matchup, Player } from '../types'
import {
  buildPlayIn,
  buildRoundMatchups,
  makeEntry,
  nextMainRound,
  roundComplete,
  roundWinners,
  shuffle,
} from '../game/bracket'
import { MAIN_ROUNDS } from '../game/rounds'

const STORAGE_KEY = 'wwty.game.v1'
export const FIELD_SIZE = 64

export interface SetupConfig {
  playerNames: string[]
  baseEntries: { label: string; note?: string }[]
  playInPairs: [string, string][]
  shuffleSeeds: boolean
}

type Action =
  | { type: 'GO_TO_SETUP' }
  | { type: 'START'; config: SetupConfig }
  | { type: 'PICK_WINNER'; matchupId: string; winner: EntryId }
  | { type: 'VOTE'; matchupId: string; side: 'a' | 'b' }
  | { type: 'USE_VETO'; playerId: string }
  | { type: 'RESET' }
  | { type: 'LOAD'; state: GameState }

function emptyState(): GameState {
  return {
    phase: 'landing',
    entries: {},
    players: [],
    turnIndex: 0,
    rounds: MAIN_ROUNDS,
    currentRound: 'r64',
    matchups: [],
    champion: null,
  }
}

function startGame(config: SetupConfig): GameState {
  const entries: Record<EntryId, Entry> = {}
  const register = (label: string, note?: string): EntryId => {
    const e = makeEntry(label, note)
    entries[e.id] = e
    return e.id
  }

  const players: Player[] = config.playerNames
    .map((n) => n.trim())
    .filter(Boolean)
    .map((name, i) => ({ id: `p${i}`, name, vetoUsed: false }))

  const baseIds = config.baseEntries
    .filter((e) => e.label.trim())
    .map((e) => register(e.label, e.note))

  const playInMatchups: Matchup[] = []
  config.playInPairs
    .filter(([a, b]) => a.trim() && b.trim())
    .forEach(([a, b]) => {
      const ida = register(a)
      const idb = register(b)
      playInMatchups.push(...buildPlayIn([[ida, idb]]))
    })

  const hasPlayIn = playInMatchups.length > 0

  if (hasPlayIn) {
    // Wait on play-in; round of 64 is generated once play-in winners are known.
    return {
      ...emptyState(),
      phase: 'play',
      entries,
      players,
      currentRound: 'play-in',
      matchups: playInMatchups,
    }
  }

  const seeds = config.shuffleSeeds ? shuffle(baseIds) : baseIds
  return {
    ...emptyState(),
    phase: 'play',
    entries,
    players,
    currentRound: 'r64',
    matchups: buildRoundMatchups('r64', padTo(seeds, FIELD_SIZE)),
  }
}

function padTo(ids: EntryId[], size: number): (EntryId | null)[] {
  const out: (EntryId | null)[] = [...ids]
  while (out.length < size) out.push(null)
  return out.slice(0, size)
}

function advanceRotation(state: GameState): number {
  if (state.players.length === 0) return 0
  return (state.turnIndex + 1) % state.players.length
}

function applyWinner(state: GameState, matchupId: string, winner: EntryId): GameState {
  const matchups = state.matchups.map((m) =>
    m.id === matchupId ? { ...m, winner } : m,
  )
  let next: GameState = { ...state, matchups }

  const round = state.matchups.find((m) => m.id === matchupId)?.round
  if (!round) return next

  // Advance the picker rotation only for non-voting rounds.
  if (round === 'play-in' || round === 'r64' || round === 'r32') {
    next = { ...next, turnIndex: advanceRotation(next) }
  }

  if (!roundComplete(matchups, round)) return next

  // Round finished — generate the next round.
  if (round === 'play-in') {
    // Play-in winners join the base field (the entries not used in play-in).
    const playInIds = new Set(
      matchups.filter((m) => m.round === 'play-in').flatMap((m) => [m.a, m.b]),
    )
    const baseIds = Object.keys(next.entries).filter((id) => !playInIds.has(id))
    const playInWinners = roundWinners(matchups, 'play-in')
    const field = [...baseIds, ...playInWinners]
    const seeds = field // play-in already adds variety; seed in entry order
    return {
      ...next,
      currentRound: 'r64',
      matchups: [
        ...matchups,
        ...buildRoundMatchups('r64', padTo(seeds, FIELD_SIZE)),
      ],
      turnIndex: 0,
    }
  }

  const nextRound = nextMainRound(round)
  const winners = roundWinners(matchups, round)
  if (!nextRound) {
    return { ...next, phase: 'champion', champion: winners[0] ?? null }
  }
  return {
    ...next,
    currentRound: nextRound,
    matchups: [...matchups, ...buildRoundMatchups(nextRound, winners)],
    turnIndex: 0,
  }
}

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'GO_TO_SETUP':
      return { ...emptyState(), phase: 'setup' }
    case 'START':
      return startGame(action.config)
    case 'PICK_WINNER':
      return applyWinner(state, action.matchupId, action.winner)
    case 'VOTE': {
      const matchups = state.matchups.map((m) =>
        m.id === action.matchupId
          ? action.side === 'a'
            ? { ...m, votesA: m.votesA + 1 }
            : { ...m, votesB: m.votesB + 1 }
          : m,
      )
      return { ...state, matchups }
    }
    case 'USE_VETO':
      return {
        ...state,
        players: state.players.map((p) =>
          p.id === action.playerId ? { ...p, vetoUsed: true } : p,
        ),
      }
    case 'RESET':
      return emptyState()
    case 'LOAD':
      return action.state
    default:
      return state
  }
}

function load(): GameState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as GameState
  } catch {
    /* ignore corrupt storage */
  }
  return emptyState()
}

interface Store {
  state: GameState
  goToSetup: () => void
  start: (config: SetupConfig) => void
  pickWinner: (matchupId: string, winner: EntryId) => void
  vote: (matchupId: string, side: 'a' | 'b') => void
  useVeto: (playerId: string) => void
  reset: () => void
}

const GameContext = createContext<Store | null>(null)

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, load)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      /* storage may be unavailable (private mode) */
    }
  }, [state])

  const store: Store = {
    state,
    goToSetup: () => dispatch({ type: 'GO_TO_SETUP' }),
    start: (config) => dispatch({ type: 'START', config }),
    pickWinner: (matchupId, winner) =>
      dispatch({ type: 'PICK_WINNER', matchupId, winner }),
    vote: (matchupId, side) => dispatch({ type: 'VOTE', matchupId, side }),
    useVeto: (playerId) => dispatch({ type: 'USE_VETO', playerId }),
    reset: () => dispatch({ type: 'RESET' }),
  }

  return <GameContext.Provider value={store}>{children}</GameContext.Provider>
}

export function useGame(): Store {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame must be used within GameProvider')
  return ctx
}
