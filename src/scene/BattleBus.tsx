import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { usePortfolioStore } from '../state/store'
import {
  BUS_CONFIG,
  MAP_BOUNDS,
  INTERACT_RADIUS,
  sections,
} from '../data/sections'
import { clampBusPosition } from '../controls/useBusControls'
import { useInputStore } from '../state/inputStore'
import { damp } from '../utils/damp'
import { busTransformRef } from './busTransformRef'
import { prepareBusModel } from './prepareBusModel'

useGLTF.preload('/models/battle_bus.glb')

const INTRO_PATH = [
  new THREE.Vector3(-300, 120, -250),
  new THREE.Vector3(-100, 110, -50),
  new THREE.Vector3(100, 100, 80),
  new THREE.Vector3(250, 95, 200),
]

export function BattleBus() {
  const groupRef = useRef<THREE.Group>(null)
  const { scene } = useGLTF('/models/battle_bus.glb')
  const phase = usePortfolioStore((s) => s.phase)
  const setBus = usePortfolioStore((s) => s.setBus)
  const setIntroProgress = usePortfolioStore((s) => s.setIntroProgress)
  const setNearbySection = usePortfolioStore((s) => s.setNearbySection)
  const nearbySection = usePortfolioStore((s) => s.nearbySection)
  const input = useInputStore((s) => s.input)

  const busModel = useMemo(() => prepareBusModel(scene), [scene])

  const state = useRef({
    position: new THREE.Vector3(0, BUS_CONFIG.height, 0),
    rotation: 0,
    forwardSpeed: 0,
    turnRate: 0,
    introT: 0,
    uiSyncTimer: 0,
  })

  useFrame((_, delta) => {
    if (!groupRef.current) return
    const s = state.current

    if (phase === 'intro') {
      s.introT = Math.min(1, s.introT + delta * 0.12)
      setIntroProgress(s.introT)

      const segments = INTRO_PATH.length - 1
      const scaled = s.introT * segments
      const idx = Math.min(Math.floor(scaled), segments - 1)
      const localT = scaled - idx
      s.position.lerpVectors(INTRO_PATH[idx], INTRO_PATH[idx + 1], localT)
      s.rotation = Math.atan2(
        INTRO_PATH[idx + 1].x - INTRO_PATH[idx].x,
        INTRO_PATH[idx + 1].z - INTRO_PATH[idx].z,
      )
    } else if (phase === 'drive' || phase === 'panel') {
      if (phase === 'drive') {
        const speedMultiplier = input.sprint ? 1.4 : 1.0
        const targetForward = input.forward * BUS_CONFIG.speed * speedMultiplier
        const targetTurn = input.turn * BUS_CONFIG.turnSpeed
        s.forwardSpeed = damp(s.forwardSpeed, targetForward, BUS_CONFIG.forwardDamping, delta)
        s.turnRate = damp(s.turnRate, targetTurn, BUS_CONFIG.turnDamping, delta)

        s.rotation += s.turnRate * delta
        s.position.x += Math.sin(s.rotation) * s.forwardSpeed * delta
        s.position.z += Math.cos(s.rotation) * s.forwardSpeed * delta
        const clamped = clampBusPosition(s.position.x, s.position.z, MAP_BOUNDS)
        s.position.x = clamped.x
        s.position.z = clamped.z
      }
      s.position.y = BUS_CONFIG.height

      let nearest: (typeof sections)[number]['id'] | null = null
      let nearestDist = Infinity
      for (const section of sections) {
        const dx = s.position.x - section.position[0]
        const dz = s.position.z - section.position[2]
        const dist = Math.sqrt(dx * dx + dz * dz)
        if (dist < INTERACT_RADIUS && dist < nearestDist) {
          nearest = section.id
          nearestDist = dist
        }
      }
      if (nearest !== nearbySection) {
        setNearbySection(nearest)
      }
    }

    groupRef.current.position.copy(s.position)
    groupRef.current.rotation.y = s.rotation

    busTransformRef.position.copy(s.position)
    busTransformRef.rotation = s.rotation

    s.uiSyncTimer += delta
    if (s.uiSyncTimer >= 0.1) {
      s.uiSyncTimer = 0
      setBus({
        position: [s.position.x, s.position.y, s.position.z],
        rotation: s.rotation,
      })
    }
  })

  return (
    <group ref={groupRef}>
      {/* Bus-local lights — follow the bus and brighten it vs the rest of the scene */}
      <pointLight intensity={1.8} distance={100} decay={2} color="#fff6ea" position={[0, 14, 0]} />
      <pointLight intensity={0.9} distance={80} decay={2} color="#dce8ff" position={[0, 10, -22]} />
      <primitive object={busModel} />
    </group>
  )
}
