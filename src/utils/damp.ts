import * as THREE from 'three'

/** Frame-rate-independent exponential smoothing toward a target value. */
export function damp(current: number, target: number, lambda: number, delta: number) {
  return THREE.MathUtils.lerp(current, target, 1 - Math.exp(-lambda * delta))
}
