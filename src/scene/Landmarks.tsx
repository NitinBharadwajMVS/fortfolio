import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, Billboard, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { sections, INTERACT_RADIUS } from '../data/sections'
import { usePortfolioStore } from '../state/store'
import { prepareLaserBeam } from './prepareLaserBeam'

useGLTF.preload('/models/laser_beam_v2.glb')

function tintBeam(object: THREE.Object3D, color: string) {
  const tint = new THREE.Color(color)
  object.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      const mats = Array.isArray(child.material) ? child.material : [child.material]
      mats.forEach((mat) => {
        if (mat instanceof THREE.MeshStandardMaterial) {
          mat.color.lerp(tint, 0.5)
          mat.emissive.lerp(tint, 0.35)
          mat.emissiveIntensity = 0.4
        }
      })
    }
  })
}

function setBeamOpacity(object: THREE.Object3D, opacity: number) {
  object.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      const mats = Array.isArray(child.material) ? child.material : [child.material]
      mats.forEach((mat) => {
        mat.opacity = opacity
      })
    }
  })
}

function LandmarkMarker({
  section,
  active,
  nearby,
  beamTemplate,
}: {
  section: (typeof sections)[number]
  active: boolean
  nearby: boolean
  beamTemplate: THREE.Object3D
}) {
  const beamRef = useRef<THREE.Group>(null)
  const ringRef = useRef<THREE.Mesh>(null)
  const beamClone = useMemo(() => {
    const clone = beamTemplate.clone(true)
    tintBeam(clone, section.color)
    return clone
  }, [beamTemplate, section.color])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (beamRef.current) {
      const scale = nearby ? 1.2 + Math.sin(t * 4) * 0.08 : 1
      beamRef.current.scale.set(scale, 1, scale)
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.5
      ringRef.current.position.y = 2 + Math.sin(t * 2) * 0.5
    }
    setBeamOpacity(beamClone, nearby ? 0.55 : 0.25)
  })

  return (
    <group position={section.position}>
      <group ref={beamRef}>
        <primitive object={beamClone} />
      </group>
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 2, 0]}>
        <ringGeometry args={[12, 16, 32]} />
        <meshBasicMaterial color={section.color} transparent opacity={nearby ? 0.9 : 0.5} side={THREE.DoubleSide} />
      </mesh>
      <Billboard follow lockX={false} lockY lockZ={false}>
        <Html
          center
          distanceFactor={120}
          style={{ pointerEvents: 'none', userSelect: 'none' }}
        >
          <div
            className={`landmark-label ${nearby ? 'landmark-label--nearby' : ''} ${active ? 'landmark-label--active' : ''}`}
            style={{ borderColor: section.color, boxShadow: nearby ? `0 0 24px ${section.color}` : undefined }}
          >
            <span className="landmark-label__icon">{section.icon}</span>
            <span className="landmark-label__text">{section.label}</span>
          </div>
        </Html>
      </Billboard>
    </group>
  )
}

export function Landmarks() {
  const { scene } = useGLTF('/models/laser_beam_v2.glb')
  const beamTemplate = useMemo(() => prepareLaserBeam(scene), [scene])
  const nearbySection = usePortfolioStore((s) => s.nearbySection)
  const activeSection = usePortfolioStore((s) => s.activeSection)
  const bus = usePortfolioStore((s) => s.bus)

  return (
    <group>
      {sections.map((section) => {
        const dx = bus.position[0] - section.position[0]
        const dz = bus.position[2] - section.position[2]
        const dist = Math.sqrt(dx * dx + dz * dz)
        const nearby = nearbySection === section.id || dist < INTERACT_RADIUS
        return (
          <LandmarkMarker
            key={section.id}
            section={section}
            active={activeSection === section.id}
            nearby={nearby}
            beamTemplate={beamTemplate}
          />
        )
      })}
    </group>
  )
}
