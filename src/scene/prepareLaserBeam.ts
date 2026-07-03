import * as THREE from 'three'

export const TARGET_BEAM_HEIGHT = 1000

export function prepareLaserBeam(scene: THREE.Object3D): THREE.Object3D {
  const clone = scene.clone(true)
  clone.updateMatrixWorld(true)

  const box = new THREE.Box3().setFromObject(clone)
  const size = box.getSize(new THREE.Vector3())

  const wrapper = new THREE.Group()

  // Sketchfab export lays the beam along Z; rotate upright to +Y
  if (size.z >= size.x && size.z >= size.y) {
    wrapper.rotation.x = Math.PI / 2
  } else if (size.x >= size.y && size.x >= size.z) {
    wrapper.rotation.z = -Math.PI / 2
  }

  wrapper.add(clone)
  wrapper.updateMatrixWorld(true)

  const orientedBox = new THREE.Box3().setFromObject(wrapper)
  const orientedSize = orientedBox.getSize(new THREE.Vector3())
  const scale = orientedSize.y > 0 ? TARGET_BEAM_HEIGHT / orientedSize.y : 1
  wrapper.scale.setScalar(scale)

  wrapper.updateMatrixWorld(true)
  const scaledBox = new THREE.Box3().setFromObject(wrapper)
  const center = scaledBox.getCenter(new THREE.Vector3())
  wrapper.position.x -= center.x
  wrapper.position.z -= center.z
  wrapper.position.y -= scaledBox.min.y

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

  return wrapper
}
