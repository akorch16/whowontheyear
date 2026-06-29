import { useState, useEffect, useCallback } from 'react'
import { useGame } from '../store/gameStore'
import Confetti from '../components/Confetti'
import { SEED_ENTRIES_BASE, SEED_PLAYIN_PAIRS } from '../game/seed'

const ALL_LABELS: string[] = [
  ...SEED_PLAYIN_PAIRS.flat(),
  ...SEED_ENTRIES_BASE,
]

function randomPick(exclude?: string): string {
  let pick: string
  do {
    pick = ALL_LABELS[Math.floor(Math.random() * ALL_LABELS.length)]
  } while (pick === exclude)
  return pick
}

export default function LandingScreen() {
  const { goToSetup } = useGame()

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 py-4 overflow-hidden bg-white">
      <Confetti />

      <div className="relative z-10 w-full max-w-2xl mx-auto">

        {/* Trophy */}
        <div className="text-center mb-3">
          <span className="text-5xl select-none">🏆</span>
        </div>

        {/* Eyebrow */}
        <p className="text-center text-xs font-bold tracking-[0.35em] uppercase mb-2" style={{ color: '#C9A000' }}>
          ★ The 2026 Bracket ★
        </p>

        {/* Main title */}
        <h1
          className="font-serif font-black text-center leading-[0.95] tracking-tight mb-4"
          style={{ fontSize: 'clamp(40px, 10vw, 76px)' }}
        >
          Who <span style={{ color: '#F5C518' }}>Won</span>{' '}
          <br className="sm:hidden" />The Year
        </h1>

        {/* Subline */}
        <p className="text-center text-sm sm:text-base text-gray-600 font-semibold mb-6 max-w-xl mx-auto leading-relaxed">
          64 contenders. One champion.<br />No criteria. Just organized chaos.
        </p>

        {/* Animated VS preview */}
        <RotatingMatchup />
        <p className="text-center text-xs text-gray-400 font-semibold tracking-wide mt-2 mb-8">
          64 contenders · no criteria · just chaos
        </p>

        {/* CTA button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={goToSetup}
            className="btn-gradient px-12 py-4 rounded-xl text-lg font-black tracking-wide shadow-xl"
          >
            Get Started →
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-xs font-bold tracking-widest uppercase text-gray-500">how it works</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        {/* Rules cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10">
          <RuleCard
            icon="🎯"
            title="Play-In Round"
            desc="Topical matchups fight for the last spots in the field of 64."
          />
          <RuleCard
            icon="🔄"
            title="Rotating Pickers"
            desc="R64 & R32: each player takes turns picking the winner. No vote."
          />
          <RuleCard
            icon="⚔️"
            title="Vote + Veto"
            desc="Sweet 16 onward: group vote. Each player gets one veto all game."
          />
        </div>

      </div>
    </div>
  )
}

function RotatingMatchup() {
  const [a, setA] = useState(() => randomPick())
  const [b, setB] = useState(() => randomPick(a))
  const [visA, setVisA] = useState(true)
  const [visB, setVisB] = useState(true)

  const cycle = useCallback(() => {
    setVisA(false)
    setTimeout(() => {
      setA((prev) => randomPick(prev))
      setVisA(true)
    }, 300)
    setTimeout(() => setVisB(false), 150)
    setTimeout(() => {
      setB((prev) => randomPick(prev))
      setVisB(true)
    }, 450)
  }, [])

  useEffect(() => {
    const interval = setInterval(cycle, 2200)
    return () => clearInterval(interval)
  }, [cycle])

  return (
    <div className="flex items-stretch gap-3 sm:gap-4">
      {/* Side A */}
      <div
        className="flex-1 rounded-2xl border-2 border-gray-100 bg-white px-4 py-5 flex items-center justify-center min-h-[80px] shadow-sm transition-all duration-300"
        style={{ opacity: visA ? 1 : 0, transform: visA ? 'translateY(0)' : 'translateY(-6px)' }}
      >
        <span className="font-serif font-black text-base sm:text-lg text-gray-900 text-center leading-tight line-clamp-2">{a}</span>
      </div>

      {/* VS badge */}
      <div className="flex items-center justify-center shrink-0">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-gold bg-white flex items-center justify-center font-black text-xs sm:text-sm text-gray-800 shadow-sm">
          VS
        </div>
      </div>

      {/* Side B */}
      <div
        className="flex-1 rounded-2xl border-2 border-gray-100 bg-white px-4 py-5 flex items-center justify-center min-h-[80px] shadow-sm transition-all duration-300"
        style={{ opacity: visB ? 1 : 0, transform: visB ? 'translateY(0)' : 'translateY(6px)' }}
      >
        <span className="font-serif font-black text-base sm:text-lg text-gray-900 text-center leading-tight line-clamp-2">{b}</span>
      </div>
    </div>
  )
}

function RuleCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white px-4 py-4 text-center shadow-sm">
      <div className="text-2xl mb-2">{icon}</div>
      <div className="font-bold text-gray-800 text-sm mb-1">{title}</div>
      <div className="text-xs text-gray-600 leading-relaxed">{desc}</div>
    </div>
  )
}
