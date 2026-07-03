import { create } from 'zustand'

export interface ControlInput {
  forward: number
  turn: number
  sprint: boolean
}

interface InputState {
  input: ControlInput
  setInput: (input: ControlInput) => void
}

export const useInputStore = create<InputState>((set) => ({
  input: { forward: 0, turn: 0, sprint: false },
  setInput: (input) => set({ input }),
}))
