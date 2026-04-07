import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'terminal-command-history'
const MAX_HISTORY = 1000

export function useCommandHistory(sessionId) {
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch { return [] }
  })
  const [historyIndex, setHistoryIndex] = useState(-1)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
    } catch (e) {
      console.warn('Failed to save command history:', e)
    }
  }, [history])

  // Sync across tabs
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === STORAGE_KEY) {
        try {
          const newHistory = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
          setHistory(newHistory)
        } catch {
          setHistory([])
        }
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const addToHistory = useCallback((command) => {
    if (!command || !command.trim()) return
    const trimmed = command.trim()
    setHistory(prev => {
      const filtered = prev.filter(c => c !== trimmed)
      const updated = [trimmed, ...filtered].slice(0, MAX_HISTORY)
      return updated
    })
    setHistoryIndex(-1)
  }, [])

  const getPrevious = useCallback(() => {
    if (history.length === 0) return null
    if (historyIndex >= history.length - 1) return null
    const newIndex = historyIndex + 1
    setHistoryIndex(newIndex)
    return history[newIndex]
  }, [history, historyIndex])

  const getNext = useCallback(() => {
    if (historyIndex <= -1) return null
    const newIndex = historyIndex - 1
    setHistoryIndex(newIndex)
    if (newIndex >= 0) {
      return history[newIndex]
    }
    return null
  }, [history, historyIndex])

  const clearHistory = useCallback(() => {
    setHistory([])
    setHistoryIndex(-1)
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (e) {
      console.warn('Failed to clear command history:', e)
    }
  }, [])

  return { history, addToHistory, getPrevious, getNext, clearHistory }
}

export function useAllCommandHistory() {
  const [allHistory, setAllHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    } catch { return [] }
  })

  useEffect(() => {
    const handleStorage = () => {
      try {
        setAllHistory(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'))
      } catch {
        setAllHistory([])
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  return allHistory
}
