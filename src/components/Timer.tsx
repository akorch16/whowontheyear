import { useEffect, useRef, useState } from 'react'

// A manual countdown used for the 2-minute veto argument / counterargument.
export default function Timer({ seconds = 120 }: { seconds?: number }) {
  const [remaining, setRemaining] = useState(seconds)
  const [running, setRunning] = useState(false)
  const ref = useRef<number | null>(null)

  useEffect(() => {
    if (!running) return
    ref.current = window.setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          setRunning(false)
          return 0
        }
        return r - 1
      })
    }, 1000)
    return () => {
      if (ref.current) window.clearInterval(ref.current)
    }
  }, [running])

  const mm = Math.floor(remaining / 60)
  const ss = String(remaining % 60).padStart(2, '0')
  const done = remaining === 0

  return (
    <div className="flex items-center gap-3">
      <span className={`tabular-nums font-black text-2xl ${done ? 'text-rose-500' : 'text-gray-900'}`}>
        {mm}:{ss}
      </span>
      <button
        onClick={() => setRunning((v) => !v)}
        className="rounded-lg border border-gray-200 px-3 py-1 text-sm font-semibold hover:border-gold transition-colors"
      >
        {running ? 'Pause' : remaining === seconds ? 'Start' : 'Resume'}
      </button>
      <button
        onClick={() => { setRunning(false); setRemaining(seconds) }}
        className="rounded-lg border border-gray-200 px-3 py-1 text-sm font-semibold hover:border-gray-400 transition-colors"
      >
        Reset
      </button>
    </div>
  )
}
