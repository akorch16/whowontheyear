// Core domain types for Who Won The Year.

export type EntryId = string

export interface Entry {
  id: EntryId
  label: string
  note?: string
}

export interface Player {
  id: string
  name: string
  vetoUsed: boolean
}

// Round identifiers in play order. "play-in" feeds slots into the round of 64.
export type RoundKey =
  | 'play-in'
  | 'r64'
  | 'r32'
  | 'sweet16'
  | 'elite8'
  | 'final4'
  | 'final'

export interface RoundMeta {
  key: RoundKey
  label: string
  /** true => group vote + veto; false => rotating single-picker. */
  voting: boolean
}

export interface Matchup {
  id: string
  round: RoundKey
  /** index of this matchup within its round (0-based, top to bottom). */
  index: number
  a: EntryId | null
  b: EntryId | null
  winner: EntryId | null
  /** votes per side, only meaningful in voting rounds. */
  votesA: number
  votesB: number
}

export type Phase = 'setup' | 'play' | 'champion'

export interface GameState {
  phase: Phase
  entries: Record<EntryId, Entry>
  players: Player[]
  /** whose turn it is in pick rounds (index into players). */
  turnIndex: number
  rounds: RoundKey[]
  currentRound: RoundKey
  matchups: Matchup[]
  champion: EntryId | null
}
