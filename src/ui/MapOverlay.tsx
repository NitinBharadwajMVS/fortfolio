import { usePortfolioStore } from '../state/store'
import { sections, MAP_BOUNDS } from '../data/sections'

export function MapOverlay() {
  const mapOpen = usePortfolioStore((s) => s.mapOpen)
  const setMapOpen = usePortfolioStore((s) => s.setMapOpen)
  const bus = usePortfolioStore((s) => s.bus)
  const nearbySection = usePortfolioStore((s) => s.nearbySection)

  if (!mapOpen) return null

  const mapW = MAP_BOUNDS.maxX - MAP_BOUNDS.minX
  const mapH = MAP_BOUNDS.maxZ - MAP_BOUNDS.minZ

  const toPercent = (x: number, z: number) => ({
    left: `${((x - MAP_BOUNDS.minX) / mapW) * 100}%`,
    top: `${((z - MAP_BOUNDS.minZ) / mapH) * 100}%`,
  })

  const busPos = toPercent(bus.position[0], bus.position[2])

  return (
    <div
      className="map-overlay-backdrop"
      onClick={() => setMapOpen(false)}
      role="presentation"
    >
      <div
        className="map-overlay"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Island map"
      >
        <button
          type="button"
          className="map-overlay__close"
          onClick={() => setMapOpen(false)}
          aria-label="Close map"
        >
          ✕
        </button>
        <h2 className="map-overlay__title">Island Map</h2>
        <div className="map-overlay__canvas">
          {sections.map((section) => {
            const pos = toPercent(section.position[0], section.position[2])
            return (
              <div
                key={section.id}
                className={`map-overlay__poi ${nearbySection === section.id ? 'map-overlay__poi--nearby' : ''}`}
                style={{ left: pos.left, top: pos.top }}
              >
                <span
                  className="map-overlay__poi-dot"
                  style={{ backgroundColor: section.color }}
                />
                <span className="map-overlay__poi-label">{section.label}</span>
              </div>
            )
          })}
          <div className="map-overlay__bus" style={{ left: busPos.left, top: busPos.top }} />
        </div>
        <p className="map-overlay__hint">Press M or Esc to close</p>
      </div>
    </div>
  )
}
