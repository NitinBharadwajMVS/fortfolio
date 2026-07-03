import { useCallback, useEffect, useRef, useState } from 'react'
import { usePortfolioStore } from '../state/store'
import { sections } from '../data/sections'
import { useJoystickControls, useKeyboardControls } from '../controls/useBusControls'
import { Minimap } from './Minimap'
import { SectionPanel } from './SectionPanel'
import { Compass } from './Compass'
import { MapOverlay } from './MapOverlay'

interface Toast {
  id: number
  text: string
}

export function HUD() {
  const phase = usePortfolioStore((s) => s.phase)
  const nearbySection = usePortfolioStore((s) => s.nearbySection)
  const activeSection = usePortfolioStore((s) => s.activeSection)
  const mapOpen = usePortfolioStore((s) => s.mapOpen)
  const openSection = usePortfolioStore((s) => s.openSection)
  const closeSection = usePortfolioStore((s) => s.closeSection)
  const toggleMap = usePortfolioStore((s) => s.toggleMap)
  const setMapOpen = usePortfolioStore((s) => s.setMapOpen)
  const joystickRef = useRef<HTMLDivElement>(null)
  const thankCountRef = useRef(0)
  const toastIdRef = useRef(0)
  const [toasts, setToasts] = useState<Toast[]>([])

  useJoystickControls(joystickRef, phase === 'drive')
  useKeyboardControls(phase === 'drive')

  const thankBusDriver = useCallback(() => {
    thankCountRef.current += 1
    const count = thankCountRef.current
    const id = ++toastIdRef.current
    const text =
      count === 1 ? 'Thanks for the ride, bus driver!' : `Thanks for the ride! (x${count})`

    setToasts((prev) => [...prev, { id, text }])
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3000)
  }, [])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Escape' && mapOpen) {
        setMapOpen(false)
        return
      }
      if (e.code === 'Escape' && phase === 'panel') {
        closeSection()
      }
      if (e.code === 'KeyM' && (phase === 'drive' || phase === 'panel')) {
        toggleMap()
      }
      if (e.code === 'KeyB' && phase === 'drive') {
        thankBusDriver()
      }
      if (e.code === 'KeyE' && phase === 'drive' && nearbySection) {
        openSection(nearbySection)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [
    phase,
    nearbySection,
    mapOpen,
    openSection,
    closeSection,
    toggleMap,
    setMapOpen,
    thankBusDriver,
  ])

  const nearby = sections.find((s) => s.id === nearbySection)

  return (
    <>
      {(phase === 'drive' || phase === 'panel') && (
        <>
          <div className="hud">
            <Compass />
            <div className="hud__controls-panel">
              <ul className="hud__controls-list">
                <li>
                  <span>Double-click</span> to look
                </li>
                <li>
                  <span>WASD / Arrows</span> to fly
                </li>
                <li>
                  <span>E</span> to interact
                </li>
                <li>
                  <span>M</span> to open map
                </li>
                <li>
                  <span>B</span> to thank the bus driver
                </li>
                <li>
                  <span>Esc</span> to close
                </li>
              </ul>
            </div>
            {phase === 'drive' && nearby && (
              <button
                type="button"
                className="hud__interact"
                style={{ borderColor: nearby.color, boxShadow: `0 0 20px ${nearby.color}55` }}
                onClick={() => openSection(nearby.id)}
              >
                Press E — Explore {nearby.label}
              </button>
            )}
            <Minimap />
          </div>
          <div className="toast-stack" aria-live="polite">
            {toasts.map((toast) => (
              <div key={toast.id} className="toast">
                <span className="toast__icon" aria-hidden="true">
                  🚌
                </span>
                <span>{toast.text}</span>
              </div>
            ))}
          </div>
          <div ref={joystickRef} className="joystick-zone" aria-hidden="true" />
        </>
      )}

      <MapOverlay />

      {phase === 'panel' && activeSection && (
        <SectionPanel sectionId={activeSection} onClose={closeSection} />
      )}
    </>
  )
}
