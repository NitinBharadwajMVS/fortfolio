import { useMemo } from 'react'
import { calcPosFromAngles } from '@react-three/drei'
import { SUN_AZIMUTH, SUN_INCLINATION } from '../data/theme'

export function Lighting() {
  const sunPosition = useMemo(() => {
    const pos = calcPosFromAngles(SUN_INCLINATION, SUN_AZIMUTH)
    return [pos.x * 400, pos.y * 400, pos.z * 400] as [number, number, number]
  }, [])

  return (
    <>
      <ambientLight intensity={0.78} />
      <directionalLight
        castShadow
        intensity={1.05}
        position={sunPosition}
        color="#fff8ee"
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={800}
        shadow-camera-left={-400}
        shadow-camera-right={400}
        shadow-camera-top={400}
        shadow-camera-bottom={-400}
      />
      <hemisphereLight args={['#c8e0ff', '#a0b8d8', 0.35]} />
    </>
  )
}
