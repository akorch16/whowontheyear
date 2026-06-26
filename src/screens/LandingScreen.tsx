import { useGame } from '../store/gameStore'
import Confetti from '../components/Confetti'

export default function LandingScreen() {
  const { goToSetup } = useGame()

  return (
    <div className="relative min-h-[calc(100vh-57px)] flex flex-col items-center justify-center px-6 py-4 overflow-hidden bg-white">
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
          style={{ fontSize: 'clamp(48px, 10vw, 76px)' }}
        >
          Who <span style={{ color: '#F5C518' }}>Won</span><br />The Year
        </h1>

        {/* Subline */}
        <p className="text-center text-base text-gray-600 font-semibold mb-6 max-w-xl mx-auto leading-relaxed">
          <span className="whitespace-nowrap">64 contenders. Head to head match ups. One champion.</span><br />No criteria. Just organized chaos.
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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

function RuleCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white px-4 py-4 text-center shadow-sm">
      <div className="text-2xl mb-2">{icon}</div>
      <div className="font-bold text-gray-800 text-sm mb-1">{title}</div>
      <div className="text-xs text-gray-600 leading-relaxed">{desc}</div>
    </div>
  )
}
