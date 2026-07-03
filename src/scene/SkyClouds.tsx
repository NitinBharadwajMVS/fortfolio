import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Cloud, Clouds as CloudVolume } from '@react-three/drei'
import * as THREE from 'three'

const SKY_CLOUD_CLUSTERS = [
  { position: [-180, 240, -120] as [number, number, number], bounds: [16, 5, 12] as [number, number, number], speed: 0.12, opacity: 0.45, seed: 1.2 },
  { position: [200, 280, 80] as [number, number, number], bounds: [18, 6, 14] as [number, number, number], speed: 0.1, opacity: 0.4, seed: 2.5 },
  { position: [-60, 320, 200] as [number, number, number], bounds: [20, 6, 15] as [number, number, number], speed: 0.14, opacity: 0.42, seed: 3.8 },
  { position: [120, 200, -220] as [number, number, number], bounds: [14, 4, 11] as [number, number, number], speed: 0.11, opacity: 0.38, seed: 4.6 },
  { position: [-260, 260, 60] as [number, number, number], bounds: [17, 5, 13] as [number, number, number], speed: 0.13, opacity: 0.44, seed: 5.4 },
]

export function SkyClouds() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.004
    }
  })

  return (
    <group ref={groupRef}>
      <CloudVolume material={THREE.MeshLambertMaterial} limit={200}>
        {SKY_CLOUD_CLUSTERS.map((cluster, i) => (
          <Cloud
            key={i}
            position={cluster.position}
            bounds={cluster.bounds}
            speed={cluster.speed}
            opacity={cluster.opacity}
            volume={8}
            segments={20}
            seed={cluster.seed}
            fade={30}
            color="#f4f8ff"
          />
        ))}
      </CloudVolume>
    </group>
  )
}
