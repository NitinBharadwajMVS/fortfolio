import { usePortfolioStore } from '../state/store'
import { sections, MAP_BOUNDS } from '../data/sections'
import { useSiteStats } from '../hooks/useSiteStats'

function ClockIcon() {
  return (
    <svg className="minimap__icon" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M12 7v5l3 2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function PeopleIcon() {
  return (
    <svg className="minimap__icon" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="9" cy="8" r="3" fill="currentColor" />
      <path
        d="M3 19c0-3.3 2.7-5 6-5s6 1.7 6 5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="17" cy="9" r="2.5" fill="currentColor" />
      <path
        d="M14 19c0.2-2.2 1.8-3.5 4-3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg className="minimap__icon" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 20.5s-7-4.6-7-10a4 4 0 0 1 7-2.5 4 4 0 0 1 7 2.5c0 5.4-7 10-7 10z"
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function Minimap() {
  const bus = usePortfolioStore((s) => s.bus)
  const nearbySection = usePortfolioStore((s) => s.nearbySection)
  const { elapsed, visitors, likes, liked, toggleLike } = useSiteStats()

  const mapW = MAP_BOUNDS.maxX - MAP_BOUNDS.minX
  const mapH = MAP_BOUNDS.maxZ - MAP_BOUNDS.minZ

  const toPercent = (x: number, z: number) => ({
    left: `${((x - MAP_BOUNDS.minX) / mapW) * 100}%`,
    top: `${((z - MAP_BOUNDS.minZ) / mapH) * 100}%`,
  })

  const busPos = toPercent(bus.position[0], bus.position[2])

  return (
    <div className="minimap-widget">
      <div className="minimap">
        <div className="minimap__canvas">
          {sections.map((section) => {
            const pos = toPercent(section.position[0], section.position[2])
            return (
              <div
                key={section.id}
                className={`minimap__poi ${nearbySection === section.id ? 'minimap__poi--nearby' : ''}`}
                style={{ left: pos.left, top: pos.top, backgroundColor: section.color }}
                title={section.label}
              />
            )
          })}
          <div className="minimap__bus" style={{ left: busPos.left, top: busPos.top }} />
        </div>
      </div>
      <div className="minimap__stats">
        <div className="minimap__stat">
          <span className="minimap__icon-wrap">
            <ClockIcon />
          </span>
          <span>{elapsed}</span>
        </div>
        <div className="minimap__stat">
          <span className="minimap__icon-wrap">
            <PeopleIcon />
          </span>
          <span>{visitors}</span>
        </div>
        <button
          type="button"
          className={`minimap__stat minimap__like ${liked ? 'minimap__like--active' : ''}`}
          onClick={toggleLike}
          aria-label={liked ? 'Unlike this site' : 'Like this site'}
          aria-pressed={liked}
        >
          <span className="minimap__icon-wrap">
            <HeartIcon filled={liked} />
          </span>
          <span>{likes}</span>
        </button>
      </div>
    </div>
  )
}
