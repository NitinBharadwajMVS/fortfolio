import { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { MAP_BOUNDS } from '../data/sections'
import { mapGroundRef } from './mapGroundRef'

useGLTF.preload('/models/map_with_edges.glb')

export function MapModel() {
  const { scene } = useGLTF('/models/map_with_edges.glb')

  const { clone, mapScale, mapOffset } = useMemo(() => {
    const clone = scene.clone(true)
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })

    const box = new THREE.Box3().setFromObject(clone)
    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())

    const targetSize = MAP_BOUNDS.maxX - MAP_BOUNDS.minX
    const maxDim = Math.max(size.x, size.z)
    const scale = maxDim > 0 ? targetSize / maxDim : 1

    clone.position.sub(center.multiplyScalar(scale))
    clone.scale.setScalar(scale)

    clone.updateMatrixWorld(true)
    const finalBox = new THREE.Box3().setFromObject(clone)
    mapGroundRef.groundY = finalBox.min.y
    mapGroundRef.mapRadiusXZ = Math.max(
      Math.max(Math.abs(finalBox.max.x), Math.abs(finalBox.min.x)),
      Math.max(Math.abs(finalBox.max.z), Math.abs(finalBox.min.z)),
    )

    return {
      clone,
      mapScale: scale,
      mapOffset: clone.position.clone(),
    }
  }, [scene])

  useMemo(() => {
    ;(window as unknown as { __mapTransform?: object }).__mapTransform = {
      mapScale,
      mapOffset: mapOffset.toArray(),
      groundY: mapGroundRef.groundY,
      mapRadiusXZ: mapGroundRef.mapRadiusXZ,
    }
  }, [mapScale, mapOffset])

  return <primitive object={clone} />
}
