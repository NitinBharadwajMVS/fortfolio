import { Experience } from './scene/Experience'
import { LoadingScreen } from './ui/LoadingScreen'
import { IntroOverlay } from './ui/IntroOverlay'
import { HUD } from './ui/HUD'
import { usePortfolioStore } from './state/store'

export default function App() {
  const phase = usePortfolioStore((s) => s.phase)

  return (
    <div className="app">
      <div className={`scene-shell ${phase === 'loading' ? 'scene-shell--hidden' : ''}`}>
        <Experience />
      </div>
      <LoadingScreen />
      <IntroOverlay />
      <HUD />
    </div>
  )
}
