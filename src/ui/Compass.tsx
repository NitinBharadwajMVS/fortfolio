import { useEffect, useRef } from 'react'
import { busTransformRef } from '../scene/busTransformRef'
import { cameraLookRef } from '../scene/cameraLookRef'

const PX_PER_DEG = 3.2
const VISIBLE_RANGE = 70
const CARDINALS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'] as const

function shortestDelta(a: number, b: number): number {
  return ((a - b + 540) % 360) - 180
}

function rotationToHeadingDeg(rotation: number): number {
  const deg = (Math.atan2(Math.sin(rotation), -Math.cos(rotation)) * 180) / Math.PI
  return ((deg % 360) + 360) % 360
}

function headingToCardinal(deg: number): string {
  const index = Math.round(deg / 45) % 8
  return CARDINALS[index]
}

export function Compass() {
  const windowRef = useRef<HTMLDivElement>(null)
  const readoutRef = useRef<HTMLDivElement>(null)
  const marksRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const marksEl = marksRef.current
    if (!marksEl) return

    const markElements: {
      el: HTMLDivElement
      degree: number
      isMajor: boolean
    }[] = []

    for (let deg = 0; deg < 360; deg += 15) {
      const isMajor = deg % 45 === 0
      const el = document.createElement('div')
      el.className = isMajor ? 'compass__mark compass__mark--major' : 'compass__mark'
      if (isMajor) {
        const label = document.createElement('span')
        label.className = 'compass__mark-label'
        label.textContent = headingToCardinal(deg)
        el.appendChild(label)
      } else {
        const label = document.createElement('span')
        label.className = 'compass__mark-degree'
        label.textContent = String(deg)
        el.appendChild(label)
      }
      marksEl.appendChild(el)
      markElements.push({ el, degree: deg, isMajor })
    }

    let raf = 0
    const tick = () => {
      // heading is based on bus rotation and camera look yaw
      const totalRotation = busTransformRef.rotation - cameraLookRef.yaw
      const headingDeg = rotationToHeadingDeg(totalRotation)
      const centerX = (windowRef.current?.clientWidth ?? 0) / 2

      if (readoutRef.current) {
        readoutRef.current.textContent = `${headingToCardinal(headingDeg)} ${Math.round(headingDeg)}`
      }

      for (const mark of markElements) {
        const delta = shortestDelta(mark.degree, headingDeg)
        const x = centerX + delta * PX_PER_DEG
        const dist = Math.abs(delta)
        const visible = dist <= VISIBLE_RANGE
        const fade = visible ? Math.max(0.25, 1 - dist / VISIBLE_RANGE) : 0
        const scale = mark.isMajor ? 1 + (1 - dist / VISIBLE_RANGE) * 0.35 : 1

        mark.el.style.transform = `translateX(${x}px) translateX(-50%) scale(${visible ? scale : 1})`
        mark.el.style.opacity = String(fade)
      }

      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="compass" aria-hidden="true">
      <div className="compass__window" ref={windowRef}>
        <div className="compass__marks" ref={marksRef} />
        <div className="compass__center-tick" />
        <div className="compass__readout" ref={readoutRef}>
          N 0
        </div>
      </div>
    </div>
  )
}
