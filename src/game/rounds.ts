import type { RoundKey, RoundMeta } from '../types'

// Voting begins at the Sweet 16 per the house rules; earlier rounds rotate pickers.
export const ROUND_META: Record<RoundKey, RoundMeta> = {
  'play-in': { key: 'play-in', label: 'Play-In', voting: false },
  r64: { key: 'r64', label: 'Round of 64', voting: false },
  r32: { key: 'r32', label: 'Round of 32', voting: false },
  sweet16: { key: 'sweet16', label: 'Sweet 16', voting: true },
  elite8: { key: 'elite8', label: 'Elite 8', voting: true },
  final4: { key: 'final4', label: 'Final 4', voting: true },
  final: { key: 'final', label: 'Championship', voting: true },
}

// The main bracket order once the field of 64 is set.
export const MAIN_ROUNDS: RoundKey[] = [
  'r64',
  'r32',
  'sweet16',
  'elite8',
  'final4',
  'final',
]
