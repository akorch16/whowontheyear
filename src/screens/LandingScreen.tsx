import { useGame } from '../store/gameStore'
import Confetti from '../components/Confetti'

export default function LandingScreen() {
  const { goToSetup } = useGame()

  return (
    <div className="relative min-h-[calc(100vh-57px)] flex flex-col items-center justify-center px-6 py-16 overflow-hidden">
      <Confetti />

      <div className="relative z-10 text-center max-w-2xl mx-auto space-y-8">
        {/* Trophy */}
        <div className="text-7xl select-none">🏆</div>

        {/* Eyebrow */}
        <p className="text-xs font-bold tracking-[0.3em] uppercase text-gold-dark">
          ★ Annual Bracket ★
        </p>

        {/* Title */}
        <h1 className="font-serif font-black leading-none tracking-tight" style={{ fontSize: 'clamp(52px, 11vw, 96px)' }}>
          Who Won<br />
          <span className="text-gold">The Year?</span>
        </h1>

        {/* Subline */}
        <p className="text-lg text-gray-500 font-semibold max-w-md mx-auto leading-relaxed">
          64 contenders. One champion. No criteria.
          The year's most chaotic bracket starts here.
        </p>

        {/* CTA */}
        <button
          onClick={goToSetup}
          className="btn-gradient inline-flex items-center gap-3 px-10 py-4 rounded-xl text-lg font-black tracking-wide shadow-lg"
        >
          Get Started →
        </button>

        {/* Rules teaser */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-gray-400 font-semibold pt-2">
          <span>🎯 Play-in round</span>
          <span>🔄 Rotating pickers</span>
          <span>🗳️ Group vote + veto</span>
        </div>
      </div>
    </div>
  )
}
