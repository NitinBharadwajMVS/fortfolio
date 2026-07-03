import { useCallback, useEffect, useState } from 'react'

const VISITORS_KEY = 'siteVisitors'
const LIKES_KEY = 'siteLikes'
const LIKED_KEY = 'userLiked'
const SESSION_KEY = 'visitedThisSession'

function readNumber(key: string, fallback = 0): number {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return fallback
    const n = Number.parseInt(raw, 10)
    return Number.isFinite(n) ? n : fallback
  } catch {
    return fallback
  }
}

function writeNumber(key: string, value: number) {
  try {
    localStorage.setItem(key, String(value))
  } catch {
    // ignore private browsing / storage blocks
  }
}

function readBoolean(key: string): boolean {
  try {
    return localStorage.getItem(key) === 'true'
  } catch {
    return false
  }
}

function writeBoolean(key: string, value: boolean) {
  try {
    localStorage.setItem(key, value ? 'true' : 'false')
  } catch {
    // ignore
  }
}

function formatElapsed(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

function incrementVisitors(): number {
  try {
    if (sessionStorage.getItem(SESSION_KEY) === 'true') {
      return readNumber(VISITORS_KEY, 0)
    }
    sessionStorage.setItem(SESSION_KEY, 'true')
    const next = readNumber(VISITORS_KEY, 0) + 1
    writeNumber(VISITORS_KEY, next)
    return next
  } catch {
    return readNumber(VISITORS_KEY, 0)
  }
}

export function useSiteStats() {
  const [elapsed, setElapsed] = useState('0:00')
  const [visitors, setVisitors] = useState(0)
  const [likes, setLikes] = useState(0)
  const [liked, setLiked] = useState(false)

  useEffect(() => {
    setVisitors(incrementVisitors())
    setLikes(readNumber(LIKES_KEY, 0))
    setLiked(readBoolean(LIKED_KEY))

    const start = Date.now()
    const tick = () => setElapsed(formatElapsed(Math.floor((Date.now() - start) / 1000)))
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [])

  const toggleLike = useCallback(() => {
    const wasLiked = readBoolean(LIKED_KEY)
    const currentLikes = readNumber(LIKES_KEY, 0)
    const nextLiked = !wasLiked
    const nextLikes = Math.max(0, currentLikes + (nextLiked ? 1 : -1))

    writeBoolean(LIKED_KEY, nextLiked)
    writeNumber(LIKES_KEY, nextLikes)
    setLiked(nextLiked)
    setLikes(nextLikes)
  }, [])

  return { elapsed, visitors, likes, liked, toggleLike }
}
