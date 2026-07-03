import { useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import {
  EDGE_CLOUD_RING_OFFSETS,
  EDGE_CLOUD_RINGS,
  EDGE_CLOUDS_PER_RING,
} from '../data/theme'
import { mapGroundRef } from './mapGroundRef'

useGLTF.preload('/models/cloud_test.glb')

const TARGET_CLOUD_WIDTH = 32

function prepareCloudMesh(scene: THREE.Object3D): THREE.Object3D {
  const clone = scene.clone(true)
  const box = new THREE.Box3().setFromObject(clone)
  const size = box.getSize(new THREE.Vector3())
  const maxDim = Math.max(size.x, size.y, size.z)
  const scale = maxDim > 0 ? TARGET_CLOUD_WIDTH / maxDim : 1
  clone.scale.setScalar(scale)

  clone.updateMatrixWorld(true)
  const scaledBox = new THREE.Box3().setFromObject(clone)
  const center = scaledBox.getCenter(new THREE.Vector3())
  clone.position.sub(center)
  clone.position.y -= scaledBox.min.y

  clone.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.castShadow = false
      child.receiveShadow = false
      const mats = Array.isArray(child.material) ? child.material : [child.material]
      mats.forEach((mat) => {
        mat.transparent = true
        mat.depthWrite = false
        mat.side = THREE.DoubleSide
      })
    }
  })

  return clone
}

function seededRandom(seed: number) {
  const x = Math.sin(seed * 127.1) * 43758.5453
  return x - Math.floor(x)
}

function buildInstances(radius: number, groundY: number) {
  const result: {
    position: [number, number, number]
    rotation: [number, number, number]
    scale: number
  }[] = []

  let seed = 1
  for (let ring = 0; ring < EDGE_CLOUD_RINGS; ring++) {
    const offset = EDGE_CLOUD_RING_OFFSETS[ring] ?? 30 + ring * 80
    const ringRadius = radius + offset
    const yLift = ring === 0 ? 8 : 14 + seededRandom(seed++) * 12

    for (let i = 0; i < EDGE_CLOUDS_PER_RING; i++) {
      const angle = (i / EDGE_CLOUDS_PER_RING) * Math.PI * 2
      const jitter = (seededRandom(seed++) - 0.5) * 0.25
      const r = ringRadius + (seededRandom(seed++) - 0.5) * 20
      const x = Math.cos(angle + jitter) * r
      const z = Math.sin(angle + jitter) * r
      const scaleVar = 0.9 + seededRandom(seed++) * 0.2
      const outwardYaw = angle + Math.PI

      result.push({
        position: [x, groundY + yLift, z],
        rotation: [0, outwardYaw + (seededRandom(seed++) - 0.5) * 0.4, 0],
        scale: scaleVar,
      })
    }
  }

  return result
}

export function EdgeCloudWall() {
  const { scene } = useGLTF('/models/cloud_test.glb')
  const cloudTemplate = useMemo(() => prepareCloudMesh(scene), [scene])

  const [metrics, setMetrics] = useState({
    radius: mapGroundRef.mapRadiusXZ,
    groundY: mapGroundRef.groundY,
  })

  useFrame(() => {
    if (
      mapGroundRef.mapRadiusXZ !== metrics.radius ||
      mapGroundRef.groundY !== metrics.groundY
    ) {
      setMetrics({
        radius: mapGroundRef.mapRadiusXZ,
        groundY: mapGroundRef.groundY,
      })
    }
  })

  const instances = useMemo(
    () => buildInstances(metrics.radius, metrics.groundY),
    [metrics.radius, metrics.groundY],
  )

  return (
    <group>
      {instances.map((inst, i) => (
        <group key={i} position={inst.position} rotation={inst.rotation} scale={inst.scale}>
          <primitive object={cloudTemplate.clone(true)} />
        </group>
      ))}
    </group>
  )
}
