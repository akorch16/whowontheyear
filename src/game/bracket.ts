import type { Entry, EntryId, Matchup, RoundKey } from '../types'
import { MAIN_ROUNDS } from './rounds'

let idCounter = 0
const uid = (prefix: string) => `${prefix}_${Date.now().toString(36)}_${idCounter++}`

export function makeEntry(label: string, note?: string): Entry {
  return { id: uid('e'), label: label.trim(), note: note?.trim() || undefined }
}

export function shuffle<T>(arr: T[]): T[] {
  const out = [...arr]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

/** Build the matchups for a round, pairing the given entry slots top-to-bottom. */
export function buildRoundMatchups(round: RoundKey, slots: (EntryId | null)[]): Matchup[] {
  const matchups: Matchup[] = []
  for (let i = 0; i < slots.length; i += 2) {
    matchups.push({
      id: uid('m'),
      round,
      index: i / 2,
      a: slots[i] ?? null,
      b: slots[i + 1] ?? null,
      winner: null,
      votesA: 0,
      votesB: 0,
    })
  }
  return matchups
}

/**
 * Create the play-in round from a list of play-in matchup pairs. Each winning
 * entry fills the corresponding play-in slot in the round of 64.
 */
export function buildPlayIn(pairs: [EntryId, EntryId][]): Matchup[] {
  return pairs.map((pair, i) => ({
    id: uid('m'),
    round: 'play-in' as RoundKey,
    index: i,
    a: pair[0],
    b: pair[1],
    winner: null,
    votesA: 0,
    votesB: 0,
  }))
}

/** True when every matchup in the round has a winner. */
export function roundComplete(matchups: Matchup[], round: RoundKey): boolean {
  const rm = matchups.filter((m) => m.round === round)
  return rm.length > 0 && rm.every((m) => m.winner !== null)
}

/** Winners of a round, ordered by matchup index, ready to seed the next round. */
export function roundWinners(matchups: Matchup[], round: RoundKey): EntryId[] {
  return matchups
    .filter((m) => m.round === round)
    .sort((a, b) => a.index - b.index)
    .map((m) => m.winner)
    .filter((w): w is EntryId => w !== null)
}

/** The round that follows `round` in the main bracket, or null if it's the final. */
export function nextMainRound(round: RoundKey): RoundKey | null {
  const idx = MAIN_ROUNDS.indexOf(round)
  if (idx === -1 || idx === MAIN_ROUNDS.length - 1) return null
  return MAIN_ROUNDS[idx + 1]
}
