import { useEffect } from 'react'

interface Props {
  playerName: string
  onDone: () => void
}

export default function VetoSplash({ playerName, onDone }: Props) {
  // Auto-dismiss after 2.2s
  useEffect(() => {
    const t = setTimeout(onDone, 2200)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 cursor-pointer"
      onClick={onDone}
    >
      <div className="relative flex flex-col items-center select-none">

        {/* Trump figure holding document */}
        <div className="relative mb-2" style={{ fontSize: 0 }}>
          {/* Body */}
          <div className="relative flex flex-col items-center">
            {/* Head */}
            <div
              className="rounded-full bg-[#F4A460] border-4 border-[#c8852a] flex items-center justify-center mb-0 z-10"
              style={{ width: 80, height: 80 }}
            >
              {/* Hair */}
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 bg-[#DAA520] rounded-t-full"
                style={{ width: 76, height: 30, borderRadius: '50% 50% 0 0' }}
              />
              {/* Eyes */}
              <div className="absolute flex gap-3" style={{ top: 34, left: '50%', transform: 'translateX(-50%)' }}>
                <div className="w-3 h-3 rounded-full bg-[#3a2a1a]" />
                <div className="w-3 h-3 rounded-full bg-[#3a2a1a]" />
              </div>
              {/* Mouth — pursed */}
              <div
                className="absolute bg-[#c0704a] rounded-sm"
                style={{ width: 22, height: 6, top: 52, left: '50%', transform: 'translateX(-50%)' }}
              />
            </div>

            {/* Suit */}
            <div
              className="bg-[#1a1a2e] rounded-b-lg relative flex items-start justify-center pt-2"
              style={{ width: 100, height: 80 }}
            >
              {/* Tie */}
              <div className="absolute bg-[#cc0000]" style={{ width: 14, height: 52, top: 4, left: '50%', transform: 'translateX(-50%)', clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 50% 85%, 0% 100%)' }} />
              {/* Arms holding doc */}
              <div className="absolute flex gap-1" style={{ bottom: -8, left: -18 }}>
                <div className="bg-[#1a1a2e] rounded" style={{ width: 18, height: 50, transform: 'rotate(-10deg)', transformOrigin: 'top' }} />
              </div>
              <div className="absolute" style={{ bottom: -8, right: -18 }}>
                <div className="bg-[#1a1a2e] rounded" style={{ width: 18, height: 50, transform: 'rotate(10deg)', transformOrigin: 'top' }} />
              </div>
            </div>

            {/* Document being held up */}
            <div
              className="bg-white border-2 border-gray-300 rounded shadow-lg flex items-center justify-center relative overflow-hidden"
              style={{ width: 110, height: 85, marginTop: -10 }}
            >
              {/* Fake document lines */}
              {[12, 20, 28, 36, 44, 52, 60, 68].map(y => (
                <div key={y} className="absolute bg-gray-200 rounded" style={{ width: '80%', height: 3, top: y, left: '10%' }} />
              ))}
              {/* Navy folder edge */}
              <div className="absolute inset-0 border-4 border-[#1a2a4a] rounded pointer-events-none" />
            </div>
          </div>
        </div>

        {/* VETO stamp — slams in */}
        <div
          className="absolute"
          style={{
            top: 80,
            left: '50%',
            transform: 'translateX(-50%)',
            animation: 'vetoSlam 0.25s cubic-bezier(0.17,0.67,0.35,1.2) 0.3s both',
          }}
        >
          <div
            style={{
              border: '6px solid #cc0000',
              borderRadius: 8,
              padding: '6px 18px',
              transform: 'rotate(-12deg)',
              background: 'transparent',
            }}
          >
            <span
              style={{
                fontFamily: 'Impact, Arial Black, sans-serif',
                fontSize: 52,
                color: '#cc0000',
                letterSpacing: 6,
                textShadow: '2px 2px 0 rgba(180,0,0,0.3)',
                display: 'block',
                lineHeight: 1,
              }}
            >
              VETO
            </span>
          </div>
        </div>

        {/* Player name below */}
        <p className="text-white font-black text-lg mt-6 tracking-wide drop-shadow-lg">
          {playerName} played their veto!
        </p>
        <p className="text-white/60 text-xs mt-1">tap to dismiss</p>
      </div>

      <style>{`
        @keyframes vetoSlam {
          from { opacity: 0; transform: translateX(-50%) scale(3) rotate(-12deg); }
          to   { opacity: 1; transform: translateX(-50%) scale(1) rotate(-12deg); }
        }
      `}</style>
    </div>
  )
}
