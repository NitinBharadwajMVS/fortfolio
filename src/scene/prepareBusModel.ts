import * as THREE from 'three'
import { BUS_CONFIG } from '../data/sections'

/**
 * Scale, center, and orient the bus so its length aligns with +Z (travel direction)
 * and the back faces -Z (toward the chase camera).
 */
export function prepareBusModel(scene: THREE.Object3D): THREE.Group {
  const clone = scene.clone(true)
  clone.updateMatrixWorld(true)

  const box = new THREE.Box3().setFromObject(clone)
  const size = box.getSize(new THREE.Vector3())
  const center = box.getCenter(new THREE.Vector3())
  clone.position.sub(center)

  const maxDim = Math.max(size.x, size.y, size.z)
  const scale = (40 / maxDim) * BUS_CONFIG.scale
  clone.scale.setScalar(scale)

  clone.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.castShadow = true
      child.receiveShadow = true
      const mats = Array.isArray(child.material) ? child.material : [child.material]
      mats.forEach((mat) => {
        if (mat instanceof THREE.MeshStandardMaterial) {
          mat.envMapIntensity = 1.2
        }
      })
    }
  })

  clone.updateMatrixWorld(true)
  const sized = new THREE.Box3().setFromObject(clone).getSize(new THREE.Vector3())

  const wrapper = new THREE.Group()

  // Sketchfab bus exports often land with length on X instead of Z
  if (sized.x > sized.z) {
    wrapper.rotation.y = -Math.PI / 2
  }

  // Flip so the rear faces the chase camera (-Z) and the nose points +Z
  wrapper.rotation.y += Math.PI + BUS_CONFIG.visualYawCorrection

  wrapper.add(clone)
  return wrapper
}
