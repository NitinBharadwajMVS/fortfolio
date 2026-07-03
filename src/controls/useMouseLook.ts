import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { usePortfolioStore } from '../state/store'
import {
  cameraLookRef,
  MOUSE_LOOK_PITCH_LIMIT,
  MOUSE_LOOK_SENSITIVITY,
  resetCameraLook,
} from '../scene/cameraLookRef'

export function useMouseLook() {
  const gl = useThree((s) => s.gl)
  const phase = usePortfolioStore((s) => s.phase)

  useEffect(() => {
    const canvas = gl.domElement
    const enabled = phase === 'drive'

    if (!enabled) {
      if (cameraLookRef.active) {
        if (document.pointerLockElement === canvas) {
          document.exitPointerLock()
        }
        resetCameraLook()
      }
      return
    }

    // Try to lock immediately if we just entered drive mode
    if (document.pointerLockElement !== canvas) {
      canvas.requestPointerLock()?.catch(() => {})
    }

    const onClick = () => {
      if (document.pointerLockElement !== canvas) {
        canvas.requestPointerLock()?.catch(() => {})
      }
    }

    const onPointerLockChange = () => {
      if (document.pointerLockElement === canvas) {
        cameraLookRef.active = true
      } else {
        resetCameraLook()
      }
    }

    const onMouseMove = (e: MouseEvent) => {
      if (document.pointerLockElement !== canvas) return
      cameraLookRef.yaw -= e.movementX * MOUSE_LOOK_SENSITIVITY
      cameraLookRef.pitch -= e.movementY * MOUSE_LOOK_SENSITIVITY
      cameraLookRef.pitch = Math.max(
        -MOUSE_LOOK_PITCH_LIMIT,
        Math.min(MOUSE_LOOK_PITCH_LIMIT, cameraLookRef.pitch),
      )
    }

    canvas.addEventListener('click', onClick)
    document.addEventListener('pointerlockchange', onPointerLockChange)
    document.addEventListener('mousemove', onMouseMove)

    return () => {
      canvas.removeEventListener('click', onClick)
      document.removeEventListener('pointerlockchange', onPointerLockChange)
      document.removeEventListener('mousemove', onMouseMove)
      if (document.pointerLockElement === canvas) {
        document.exitPointerLock()
      }
      resetCameraLook()
    }
  }, [gl, phase])
}
