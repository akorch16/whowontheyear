import { useGame } from '../store/gameStore'
import { ROUND_META } from '../game/rounds'
import type { Matchup, RoundKey } from '../types'

// ── Layout constants ──────────────────────────────────────────────────────────
const SLOT   = 52          // px per base row unit (height of one R64 slot)
const CARD_H = 44          // px height of a matchup card
const COL_W  = 108         // px width of a round column
const ARM_W  = 14          // px gap (connector arm space) between columns
const HDR_H  = 22          // px height of round label row
const TOTAL_H = 16 * SLOT  // 832px bracket body height

function colX(col: number) { return col * (COL_W + ARM_W) }
const TOTAL_W = colX(10) + COL_W  // 11 columns (0-10)

// Vertical center of matchup at local index j for a given round.
// j is 0-based within the half-bracket (0 = top of the left or right half).
function cardCenter(round: RoundKey, j: number): number {
  switch (round) {
    case 'r64':     return (j + 0.5) * SLOT
    case 'r32':     return (2 * j + 1) * SLOT
    case 'sweet16': return (4 * j + 2) * SLOT
    case 'elite8':  return (8 * j + 4) * SLOT
    case 'final4':  return 8 * SLOT
    case 'final':   return 8 * SLOT
    default:        return TOTAL_H / 2
  }
}

// ── Column configs ─────────────────────────────────────────────────────────────
// col = column index 0-10 (0=left R64, 5=Championship, 10=right R64)
// si  = first global matchup index in this half
// n   = number of matchups in this half
type ColCfg = { round: RoundKey; si: number; n: number; col: number }

const LEFT: ColCfg[] = [
  { round: 'r64',     si: 0,  n: 16, col: 0 },
  { round: 'r32',     si: 0,  n: 8,  col: 1 },
  { round: 'sweet16', si: 0,  n: 4,  col: 2 },
  { round: 'elite8',  si: 0,  n: 2,  col: 3 },
  { round: 'final4',  si: 0,  n: 1,  col: 4 },
]

const CENTER: ColCfg = { round: 'final', si: 0, n: 1, col: 5 }

// Right side columns go from center outward (col 6=F4, col 10=R64).
const RIGHT: ColCfg[] = [
  { round: 'final4',  si: 1,  n: 1,  col: 6  },
  { round: 'elite8',  si: 2,  n: 2,  col: 7  },
  { round: 'sweet16', si: 4,  n: 4,  col: 8  },
  { round: 'r32',     si: 8,  n: 8,  col: 9  },
  { round: 'r64',     si: 16, n: 16, col: 10 },
]

const ALL_COLS = [...LEFT, CENTER, ...RIGHT]

// Build real or placeholder matchup list for a column (always fills all n slots).
function colMatchups(cfg: ColCfg, allMatchups: Matchup[]): Matchup[] {
  const real = allMatchups.filter(
    m => m.round === cfg.round && m.index >= cfg.si && m.index < cfg.si + cfg.n
  )
  return Array.from({ length: cfg.n }, (_, j) => {
    const idx = cfg.si + j
    return real.find(m => m.index === idx) ?? {
      id: `ph-${cfg.round}-${idx}`,
      round: cfg.round, index: idx,
      a: null, b: null, winner: null, votesA: 0, votesB: 0,
    }
  })
}

// ── SVG connector lines ────────────────────────────────────────────────────────
type Line = { x1: number; y1: number; x2: number; y2: number }

function buildLines(): Line[] {
  const lines: Line[] = []

  // Left side: each round feeds the next (going right toward center)
  for (let i = 0; i < LEFT.length - 1; i++) {
    const cur = LEFT[i], nxt = LEFT[i + 1]
    const midX = colX(cur.col) + COL_W + ARM_W / 2
    for (let j = 0; j < nxt.n; j++) {
      const yA = cardCenter(cur.round, j * 2)
      const yB = cardCenter(cur.round, j * 2 + 1)
      const yN = cardCenter(nxt.round, j)
      lines.push({ x1: colX(cur.col) + COL_W, y1: yA, x2: midX,           y2: yA })
      lines.push({ x1: colX(cur.col) + COL_W, y1: yB, x2: midX,           y2: yB })
      lines.push({ x1: midX,                   y1: yA, x2: midX,           y2: yB })
      lines.push({ x1: midX,                   y1: yN, x2: colX(nxt.col),  y2: yN })
    }
  }

  // Left F4 → Championship (horizontal, same vertical center)
  const yFinal = cardCenter('final', 0)
  lines.push({ x1: colX(4) + COL_W, y1: yFinal, x2: colX(5),     y2: yFinal })
  // Championship → Right F4
  lines.push({ x1: colX(5) + COL_W, y1: yFinal, x2: colX(6),     y2: yFinal })

  // Right side: outer rounds feed inner (going left toward center)
  for (let i = 0; i < RIGHT.length - 1; i++) {
    const inner = RIGHT[i], outer = RIGHT[i + 1]
    const midX = colX(inner.col) + COL_W + ARM_W / 2
    for (let j = 0; j < inner.n; j++) {
      const yA = cardCenter(outer.round, j * 2)
      const yB = cardCenter(outer.round, j * 2 + 1)
      const yI = cardCenter(inner.round, j)
      lines.push({ x1: colX(outer.col),          y1: yA, x2: midX,                    y2: yA })
      lines.push({ x1: colX(outer.col),          y1: yB, x2: midX,                    y2: yB })
      lines.push({ x1: midX,                      y1: yA, x2: midX,                    y2: yB })
      lines.push({ x1: midX,                      y1: yI, x2: colX(inner.col) + COL_W, y2: yI })
    }
  }

  return lines
}

const LINES = buildLines()

// ── Component ─────────────────────────────────────────────────────────────────
export default function BracketScreen() {
  const { state } = useGame()
  const { matchups, entries } = state

  if (!matchups.some(m => m.round === 'r64')) {
    return (
      <div className="py-8 text-center text-sm text-gray-600 font-semibold">
        Bracket not yet started
      </div>
    )
  }

  const label = (id: string | null) => (id ? entries[id]?.label ?? '?' : 'TBD')

  return (
    <div className="overflow-x-auto -mx-5 px-5 pb-4">
      <div style={{ width: TOTAL_W, position: 'relative', userSelect: 'none' }}>

        {/* Round headers */}
        <div style={{ height: HDR_H, position: 'relative' }}>
          {ALL_COLS.map(cfg => (
            <div
              key={`h-${cfg.col}`}
              style={{ position: 'absolute', left: colX(cfg.col), width: COL_W, textAlign: 'center' }}
              className="text-[9px] font-bold uppercase tracking-widest text-gold-dark leading-[22px]"
            >
              {ROUND_META[cfg.round].label}
            </div>
          ))}
        </div>

        {/* Bracket body */}
        <div style={{ position: 'relative', height: TOTAL_H }}>

          {/* SVG connector lines */}
          <svg
            style={{ position: 'absolute', inset: 0, width: TOTAL_W, height: TOTAL_H, pointerEvents: 'none' }}
          >
            {LINES.map((l, i) => (
              <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke="#e5e7eb" strokeWidth={1.5} />
            ))}
          </svg>

          {/* Matchup cards */}
          {ALL_COLS.flatMap(cfg =>
            colMatchups(cfg, matchups).map((m, j) => {
              const top = cardCenter(cfg.round, j) - CARD_H / 2
              const left = colX(cfg.col)
              const aWin = m.winner !== null && m.winner === m.a
              const bWin = m.winner !== null && m.winner === m.b
              const decided = m.winner !== null

              return (
                <div
                  key={m.id}
                  style={{ position: 'absolute', top, left, width: COL_W, height: CARD_H }}
                  className="border border-gray-200 rounded bg-white overflow-hidden"
                >
                  <div
                    className={`px-1.5 truncate flex items-center border-b border-gray-100 ${
                      aWin    ? 'font-black text-[#C9A000] bg-yellow-50'
                      : decided ? 'text-gray-500 line-through'
                      : 'text-gray-700 font-semibold'
                    }`}
                    style={{ height: CARD_H / 2, fontSize: 10 }}
                  >
                    {label(m.a)}
                  </div>
                  <div
                    className={`px-1.5 truncate flex items-center ${
                      bWin    ? 'font-black text-[#C9A000] bg-yellow-50'
                      : decided ? 'text-gray-500 line-through'
                      : 'text-gray-700 font-semibold'
                    }`}
                    style={{ height: CARD_H / 2, fontSize: 10 }}
                  >
                    {label(m.b)}
                  </div>
                </div>
              )
            })
          )}

        </div>
      </div>
    </div>
  )
}
