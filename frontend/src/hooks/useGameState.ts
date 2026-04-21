import { useCallback, useEffect, useState } from 'react'
import { fetchScene, fetchStartScene, submitChoice } from '../api/gameApi'
import type { GameState, Scene } from '../types/game'

const STORAGE_KEY = 'ifh-progress'

const DEFAULT_STATE: GameState = { loyalty: 0, doubt: 0, fatigue: 0 }

interface SavedProgress {
  scene_id: string
  game_state: GameState
}

function loadSaved(): SavedProgress | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as SavedProgress) : null
  } catch {
    return null
  }
}

function saveProgress(sceneId: string, gameState: GameState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ scene_id: sceneId, game_state: gameState }))
}

function clearProgress() {
  localStorage.removeItem(STORAGE_KEY)
}

export function hasSavedProgress(): boolean {
  return loadSaved() !== null
}

export function useGameState() {
  const [scene, setScene] = useState<Scene | null>(null)
  const [gameState, setGameState] = useState<GameState>(DEFAULT_STATE)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [choosing, setChoosing] = useState(false)

  const loadInitial = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const saved = loadSaved()
      if (saved) {
        const s = await fetchScene(saved.scene_id)
        setScene(s)
        setGameState(saved.game_state)
      } else {
        const res = await fetchStartScene()
        setScene(res.scene)
        setGameState(res.initial_state)
        saveProgress(res.scene.id, res.initial_state)
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ошибка загрузки')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadInitial()
  }, [loadInitial])

  const choose = useCallback(
    async (choiceId: string) => {
      if (!scene || choosing) return
      setChoosing(true)
      setError(null)
      try {
        const res = await submitChoice(scene.id, choiceId, gameState)
        setScene(res.scene)
        setGameState(res.new_state)
        saveProgress(res.scene.id, res.new_state)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Ошибка выбора')
      } finally {
        setChoosing(false)
      }
    },
    [scene, choosing, gameState],
  )

  const restart = useCallback(() => {
    clearProgress()
    loadInitial()
  }, [loadInitial])

  return { scene, gameState, loading, error, choosing, choose, restart }
}
