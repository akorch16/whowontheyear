import { useEffect } from 'react'

interface Props {
  playerName: string
  winnerLabel: string
  onDone: () => void
}

// Drop the photo at public/trump-veto.jpg — served at this URL (handles the
// /whowontheyear/ base path automatically).
const TRUMP_IMG = `${import.meta.env.BASE_URL}trump-veto.jpg`

export default function VetoSplash({ playerName, winnerLabel, onDone }: Props) {
  // Auto-dismiss after 5s
  useEffect(() => {
    const t = setTimeout(onDone, 5000)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 cursor-pointer"
      onClick={onDone}
    >
      <div className="relative max-w-2xl w-full mx-4 select-none">

        {/* Header */}
        <p className="text-center text-white font-black text-lg sm:text-2xl tracking-wide drop-shadow-lg mb-3 uppercase">
          {playerName} vetoed {winnerLabel}
        </p>

        {/* Trump photo (dark fallback box if the image is missing) */}
        <div
          className="w-full rounded-xl shadow-2xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900"
          style={{ minHeight: 280 }}
        >
          <img
            src={TRUMP_IMG}
            alt="Veto"
            className="w-full h-auto object-cover"
            style={{ maxHeight: '70vh' }}
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
          />
        </div>

        {/* VETO stamp — slams in over the photo */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ animation: 'vetoSlam 0.25s cubic-bezier(0.17,0.67,0.35,1.2) 0.25s both' }}
        >
          <div
            style={{
              border: '10px solid #cc0000',
              borderRadius: 12,
              padding: '10px 40px',
              transform: 'rotate(-12deg)',
              background: 'rgba(255,255,255,0.06)',
              boxShadow: '0 0 0 4px rgba(204,0,0,0.15)',
            }}
          >
            <span
              style={{
                fontFamily: 'Impact, "Arial Black", sans-serif',
                fontSize: 'clamp(64px, 16vw, 140px)',
                color: '#cc0000',
                letterSpacing: 10,
                textShadow: '3px 3px 0 rgba(120,0,0,0.4)',
                display: 'block',
                lineHeight: 1,
              }}
            >
              VETO
            </span>
          </div>
        </div>

        {/* Player name */}
        <p className="absolute -bottom-12 left-0 right-0 text-center text-white font-black text-xl tracking-wide drop-shadow-lg">
          {playerName} played their veto!
        </p>
        <p className="absolute -bottom-[4.5rem] left-0 right-0 text-center text-white/60 text-xs">
          tap to dismiss
        </p>
      </div>

      <style>{`
        @keyframes vetoSlam {
          from { opacity: 0; transform: scale(3); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  )
}
