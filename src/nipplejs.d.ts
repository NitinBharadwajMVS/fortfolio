/// <reference types="vite/client" />

/// <reference types="vite/client" />

declare module 'nipplejs' {
  interface JoystickManagerOptions {
    zone: HTMLElement
    mode?: string
    position?: { left?: string; bottom?: string; top?: string; right?: string }
    color?: string
    size?: number
  }

  interface JoystickOutputData {
    vector?: { x: number; y: number }
  }

  interface JoystickManager {
    on(event: string, handler: (evt: unknown, data: JoystickOutputData) => void): void
    destroy(): void
  }

  const nipplejs: {
    create(options: JoystickManagerOptions): JoystickManager
  }

  export default nipplejs
}
