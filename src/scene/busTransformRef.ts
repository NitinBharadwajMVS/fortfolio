import * as THREE from 'three'
import { BUS_CONFIG } from '../data/sections'

/** Per-frame bus transform — read directly in useFrame to avoid camera jitter from React state. */
export const busTransformRef = {
  position: new THREE.Vector3(0, BUS_CONFIG.height, 0),
  rotation: 0,
}
