import { useEffect } from 'react'
import type { RoundKey } from '../types'

const LABELS: Record<RoundKey, string> = {
  'play-in':  'Play-In Round',
  'r64':      'Round of 64',
  'r32':      'Round of 32',
  'sweet16':  'Sweet 16',
  'elite8':   'Elite 8',
  'final4':   'Final Four',
  'final':    'Championship',
}

interface Props {
  round: RoundKey
  onDone: () => void
}

export default function RoundCompleteSplash({ round, onDone }: Props) {
  useEffect(() => {
    const t = setTimeout(onDone, 5000)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center cursor-pointer select-none"
      style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}
      onClick={onDone}
    >
      <div
        className="text-center px-6"
        style={{ animation: 'splashIn 0.4s cubic-bezier(0.17,0.67,0.35,1.2) both' }}
      >
        <div className="text-6xl mb-6">🏆</div>
        <p
          className="font-black uppercase tracking-widest mb-3"
          style={{ color: '#C9A000', fontSize: 'clamp(11px, 3vw, 14px)', letterSpacing: '0.3em' }}
        >
          {LABELS[round]}
        </p>
        <h2
          className="font-serif font-black text-white leading-none"
          style={{ fontSize: 'clamp(42px, 12vw, 96px)' }}
        >
          Complete!
        </h2>
        <div className="mt-6 flex justify-center gap-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full"
              style={{
                background: '#F5C518',
                animation: `dot 5s linear both`,
                animationDelay: `${i * 0.15}s`,
              }}
            />
          ))}
        </div>
      </div>
      <p className="absolute bottom-8 text-white/40 text-xs font-semibold tracking-widest uppercase">
        tap to continue
      </p>

      <style>{`
        @keyframes splashIn {
          from { opacity: 0; transform: scale(0.85) translateY(20px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes dot {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50%       { opacity: 1;   transform: scale(1.4); }
        }
      `}</style>
    </div>
  )
}
