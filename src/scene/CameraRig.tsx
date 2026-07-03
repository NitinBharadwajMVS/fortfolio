import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { usePortfolioStore } from '../state/store'
import { damp } from '../utils/damp'
import { busTransformRef } from './busTransformRef'
import { cameraLookRef } from './cameraLookRef'

const INTRO_DISTANCE = 95
const INTRO_ELEVATION = 0.35
const DRIVE_DISTANCE = 78
const DRIVE_ELEVATION = 0.32

function sphericalOffset(
  azimuth: number,
  elevation: number,
  distance: number,
  target: THREE.Vector3,
) {
  const cosElev = Math.cos(elevation)
  return new THREE.Vector3(
    target.x + distance * cosElev * Math.sin(azimuth),
    target.y + distance * Math.sin(elevation),
    target.z + distance * cosElev * Math.cos(azimuth),
  )
}

export function CameraRig() {
  const { camera } = useThree()
  const phase = usePortfolioStore((s) => s.phase)

  const smoothPos = useRef(new THREE.Vector3())
  const smoothLookAt = useRef(new THREE.Vector3())
  const initialized = useRef(false)

  useFrame((_, delta) => {
    const busPos = busTransformRef.position
    const rot = busTransformRef.rotation

    const distance = phase === 'intro' ? INTRO_DISTANCE : DRIVE_DISTANCE
    const baseElevation = phase === 'intro' ? INTRO_ELEVATION : DRIVE_ELEVATION

    const lookYaw = phase === 'intro' ? 0 : cameraLookRef.yaw
    const lookPitch = phase === 'intro' ? 0 : cameraLookRef.pitch

    const azimuth = rot + Math.PI + lookYaw
    const elevation = baseElevation + lookPitch

    const targetPos = sphericalOffset(azimuth, elevation, distance, busPos)
    const lookAtPoint = new THREE.Vector3(busPos.x, busPos.y - 4, busPos.z)

    if (!initialized.current) {
      smoothPos.current.copy(targetPos)
      smoothLookAt.current.copy(lookAtPoint)
      initialized.current = true
    }

    smoothPos.current.x = damp(smoothPos.current.x, targetPos.x, 6, delta)
    smoothPos.current.y = damp(smoothPos.current.y, targetPos.y, 6, delta)
    smoothPos.current.z = damp(smoothPos.current.z, targetPos.z, 6, delta)

    smoothLookAt.current.x = damp(smoothLookAt.current.x, lookAtPoint.x, 8, delta)
    smoothLookAt.current.y = damp(smoothLookAt.current.y, lookAtPoint.y, 8, delta)
    smoothLookAt.current.z = damp(smoothLookAt.current.z, lookAtPoint.z, 8, delta)

    camera.position.copy(smoothPos.current)
    camera.lookAt(smoothLookAt.current)
  })

  return null
}
