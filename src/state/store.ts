import { create } from 'zustand'

export type Phase = 'loading' | 'intro' | 'drive' | 'panel'

export type SectionId = 'about' | 'projects' | 'skills' | 'experience' | 'contact'

export interface BusState {
  position: [number, number, number]
  rotation: number
}

export interface PortfolioState {
  phase: Phase
  activeSection: SectionId | null
  nearbySection: SectionId | null
  mapOpen: boolean
  bus: BusState
  introProgress: number
  loadProgress: number
  setPhase: (phase: Phase) => void
  setActiveSection: (section: SectionId | null) => void
  setNearbySection: (section: SectionId | null) => void
  setMapOpen: (open: boolean) => void
  toggleMap: () => void
  setBus: (bus: Partial<BusState>) => void
  setIntroProgress: (progress: number) => void
  setLoadProgress: (progress: number) => void
  openSection: (section: SectionId) => void
  closeSection: () => void
}

export const usePortfolioStore = create<PortfolioState>((set) => ({
  phase: 'loading',
  activeSection: null,
  nearbySection: null,
  mapOpen: false,
  bus: { position: [0, 80, 0], rotation: 0 },
  introProgress: 0,
  loadProgress: 0,
  setPhase: (phase) => set({ phase }),
  setActiveSection: (activeSection) => set({ activeSection }),
  setNearbySection: (nearbySection) => set({ nearbySection }),
  setMapOpen: (mapOpen) => set({ mapOpen }),
  toggleMap: () => set((state) => ({ mapOpen: !state.mapOpen })),
  setBus: (bus) =>
    set((state) => ({
      bus: { ...state.bus, ...bus },
    })),
  setIntroProgress: (introProgress) => set({ introProgress }),
  setLoadProgress: (loadProgress) =>
    set((state) => ({
      loadProgress: Math.max(state.loadProgress, loadProgress),
    })),
  openSection: (section) => set({ activeSection: section, phase: 'panel' }),
  closeSection: () => set({ activeSection: null, phase: 'drive' }),
}))
