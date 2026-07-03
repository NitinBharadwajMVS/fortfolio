export const cameraLookRef = {
  active: false,
  yaw: 0,
  pitch: 0,
}

export const MOUSE_LOOK_SENSITIVITY = 0.002
export const MOUSE_LOOK_PITCH_LIMIT = Math.PI / 3

export function resetCameraLook() {
  cameraLookRef.active = false
  cameraLookRef.yaw = 0
  cameraLookRef.pitch = 0
}
