import { useEffect, useState } from 'react'
import { usePortfolioStore } from '../state/store'

export function LoadingScreen() {
  const loadProgress = usePortfolioStore((s) => s.loadProgress)
  const phase = usePortfolioStore((s) => s.phase)
  const [displayProgress, setDisplayProgress] = useState(0)

  useEffect(() => {
    if (phase !== 'loading') {
      setDisplayProgress(0)
      return
    }

    let raf = 0
    const animate = () => {
      setDisplayProgress((prev) => {
        const target =
          loadProgress >= 100 ? 100 : Math.max(loadProgress, Math.min(92, prev + 0.4))
        if (prev >= target) return prev
        const step = Math.max(0.35, (target - prev) * 0.1)
        return Math.min(target, prev + step)
      })
      raf = requestAnimationFrame(animate)
    }

    raf = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf)
  }, [phase, loadProgress])

  if (phase !== 'loading') return null

  const percent = Math.min(100, Math.round(displayProgress))

  return (
    <div className="loading-screen">
      <div className="loading-screen__content">
        <div className="loading-screen__logo">TINTIN Portfolio</div>
        <p className="loading-screen__subtitle">Boarding the island...</p>
        <div className="loading-screen__bar">
          <div className="loading-screen__fill" style={{ width: `${displayProgress}%` }} />
        </div>
        <p className="loading-screen__percent">{percent}%</p>
      </div>
    </div>
  )
}
