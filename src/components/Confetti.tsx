import { useEffect, useRef } from 'react'

const COLORS = ['#FF3CAC', '#2BD9FE', '#784BA0', '#F5C518', '#FF9F43']
const COUNT = 60

export default function Confetti() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = ref.current
    if (!container) return
    const pieces: HTMLSpanElement[] = []
    for (let i = 0; i < COUNT; i++) {
      const s = document.createElement('span')
      const size = Math.random() * 8 + 4
      const tall = Math.random() > 0.5
      s.style.cssText = `
        position:absolute;
        left:${Math.random() * 100}%;
        top:${-Math.random() * 200}px;
        width:${size}px;
        height:${tall ? size * 2.5 : size}px;
        background:${COLORS[Math.floor(Math.random() * COLORS.length)]};
        border-radius:${Math.random() > 0.5 ? '50%' : '2px'};
        opacity:0.6;
        animation:wwty-fall ${4 + Math.random() * 6}s ${Math.random() * 5}s linear infinite;
      `
      container.appendChild(s)
      pieces.push(s)
    }
    return () => pieces.forEach((p) => p.remove())
  }, [])

  return (
    <>
      <style>{`
        @keyframes wwty-fall {
          0%   { transform: translateY(-20px) rotate(0deg);   opacity: 0; }
          10%  { opacity: 0.6; }
          90%  { opacity: 0.4; }
          100% { transform: translateY(110vh) rotate(600deg); opacity: 0; }
        }
      `}</style>
      <div
        ref={ref}
        style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}
      />
    </>
  )
}
