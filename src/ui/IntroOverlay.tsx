import { useCallback, useEffect } from 'react'
import { usePortfolioStore } from '../state/store'
import { PORTFOLIO_NAME } from '../data/sections'

export function IntroOverlay() {
  const phase = usePortfolioStore((s) => s.phase)
  const introProgress = usePortfolioStore((s) => s.introProgress)
  const setPhase = usePortfolioStore((s) => s.setPhase)

  const dropIn = useCallback(() => {
    setPhase('drive')
  }, [setPhase])

  useEffect(() => {
    if (phase !== 'intro') return
    const timer = window.setTimeout(() => setPhase('drive'), 8000)
    return () => window.clearTimeout(timer)
  }, [phase, setPhase])

  useEffect(() => {
    if (phase !== 'intro') return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault()
        dropIn()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [phase, dropIn])

  if (phase !== 'intro') return null

  return (
    <div className={`intro-overlay ${introProgress > 0.15 ? 'intro-overlay--visible' : ''}`}>
      <div className="intro-overlay__content">
        <p className="intro-overlay__eyebrow">Welcome to</p>
        <h1 className="intro-overlay__title">{PORTFOLIO_NAME} Portfolio</h1>
        <p className="intro-overlay__tagline">Fly over the island. Drop in when ready.</p>
        <button type="button" className="btn-drop-in" onClick={dropIn}>
          Drop In
        </button>
        <p className="intro-overlay__hint">Press Space to drop in</p>
      </div>
    </div>
  )
}
