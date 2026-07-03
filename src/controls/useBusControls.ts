import { useEffect, useRef } from 'react'
import nipplejs from 'nipplejs'
import { useInputStore } from '../state/inputStore'

const keys = new Set<string>()

export function useKeyboardControls(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return

    const onKeyDown = (e: KeyboardEvent) => {
      keys.add(e.code)
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
        e.preventDefault()
      }
    }
    const onKeyUp = (e: KeyboardEvent) => keys.delete(e.code)

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)

    let raf = 0
    const tick = () => {
      let forward = 0
      let turn = 0
      let sprint = false
      if (keys.has('KeyW') || keys.has('ArrowUp')) forward += 1
      if (keys.has('KeyS') || keys.has('ArrowDown')) forward -= 1
      if (keys.has('KeyA') || keys.has('ArrowLeft')) turn += 1
      if (keys.has('KeyD') || keys.has('ArrowRight')) turn -= 1
      if (keys.has('ShiftLeft') || keys.has('ShiftRight')) sprint = true
      useInputStore.setState({ input: { forward, turn, sprint } })
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      cancelAnimationFrame(raf)
      useInputStore.setState({ input: { forward: 0, turn: 0, sprint: false } })
    }
  }, [enabled])
}

export function useJoystickControls(
  containerRef: React.RefObject<HTMLDivElement | null>,
  enabled: boolean,
) {
  const joystickActive = useRef(false)

  useEffect(() => {
    if (!enabled || !containerRef.current) return

    const manager = nipplejs.create({
      zone: containerRef.current,
      mode: 'static',
      position: { left: '80px', bottom: '80px' },
      color: 'rgba(255, 213, 79, 0.6)',
      size: 120,
    })

    manager.on('move', (_evt, data) => {
      if (!data.vector) return
      joystickActive.current = true
      const kb = useInputStore.getState().input
      if (kb.forward === 0 && kb.turn === 0) {
        useInputStore.setState({
          input: { forward: data.vector.y, turn: -data.vector.x, sprint: kb.sprint },
        })
      }
    })

    manager.on('end', () => {
      joystickActive.current = false
      const kb = useInputStore.getState().input
      if (kb.forward === 0 && kb.turn === 0) {
        useInputStore.setState({ input: { forward: 0, turn: 0, sprint: kb.sprint } })
      }
    })

    return () => manager.destroy()
  }, [containerRef, enabled])
}

export function clampBusPosition(
  x: number,
  z: number,
  bounds: typeof import('../data/sections').MAP_BOUNDS,
) {
  return {
    x: Math.max(bounds.minX, Math.min(bounds.maxX, x)),
    z: Math.max(bounds.minZ, Math.min(bounds.maxZ, z)),
  }
}
