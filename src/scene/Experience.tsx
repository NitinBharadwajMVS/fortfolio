import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Preload, useProgress } from '@react-three/drei'
import { useEffect } from 'react'
import { usePortfolioStore } from '../state/store'
import { MapModel } from './Map'
import { BattleBus } from './BattleBus'
import { CameraRig } from './CameraRig'
import { MouseLookControls } from './MouseLookControls'
import { Lighting } from './Lighting'
import { Landmarks } from './Landmarks'
import { Effects } from './Effects'
import { SkyEnvironment } from './SkyEnvironment'
import { EdgeCloudWall } from './EdgeCloudWall'
import { SkyClouds } from './SkyClouds'

function LoadingWatcher() {
  const { progress, active } = useProgress()
  const setPhase = usePortfolioStore((s) => s.setPhase)
  const setLoadProgress = usePortfolioStore((s) => s.setLoadProgress)
  const phase = usePortfolioStore((s) => s.phase)

  useEffect(() => {
    setLoadProgress(progress)
  }, [progress, setLoadProgress])

  useEffect(() => {
    if (!active && progress >= 100 && phase === 'loading') {
      setLoadProgress(100)
      const timer = window.setTimeout(() => {
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        setPhase(reducedMotion ? 'drive' : 'intro')
      }, 900)
      return () => window.clearTimeout(timer)
    }
  }, [active, progress, phase, setPhase, setLoadProgress])

  return null
}

export function Experience() {
  return (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      camera={{ fov: 55, near: 1, far: 3000, position: [0, 120, 200] }}
      gl={{ antialias: true, powerPreference: 'high-performance', alpha: false }}
    >
      <SkyEnvironment />
      <Lighting />
      <Suspense fallback={null}>
        <MapModel />
        <EdgeCloudWall />
        <SkyClouds />
        <BattleBus />
        <Landmarks />
        <CameraRig />
        <MouseLookControls />
        <Effects />
        <LoadingWatcher />
        <Preload all />
      </Suspense>
    </Canvas>
  )
}
