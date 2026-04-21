import { useCallback, useEffect, useState } from 'react'
import ZoomLayout from '../components/zoom/ZoomLayout'
import { type Reaction, choiceToReaction, stateToReaction } from '../components/zoom/reactions'
import { useGameState } from '../hooks/useGameState'

export default function GamePage() {
  const { scene, gameState, loading, error, choosing, choose, restart } = useGameState()
  const [reaction, setReaction] = useState<Reaction>('neutral')
  const [thinking, setThinking] = useState(false)

  // Update baseline reaction when scene or state changes
  useEffect(() => {
    if (!scene) return
    setReaction(stateToReaction(scene.id, gameState))
  }, [scene?.id, gameState.loyalty, gameState.doubt, gameState.fatigue])

  const handleChoose = useCallback(
    async (choiceId: string) => {
      if (!scene || choosing || thinking) return

      // Derive reaction for this specific choice
      const picked = scene.choices.find(c => c.id === choiceId)
      if (picked) setReaction(choiceToReaction(picked, scene.id))

      setThinking(true)
      const minDelay = new Promise<void>(r => setTimeout(r, 850))
      await Promise.all([choose(choiceId), minDelay])
      setThinking(false)
    },
    [scene, choosing, thinking, choose],
  )

  const handleRestart = useCallback(() => {
    setReaction('neutral')
    setThinking(false)
    restart()
  }, [restart])

  if (loading) {
    return (
      <div className="game-page">
        <div className="status-message">Загрузка...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="game-page">
        <div className="status-message error">
          <p>Ошибка: {error}</p>
          <button className="btn-ghost" onClick={() => window.location.reload()}>
            Повторить
          </button>
        </div>
      </div>
    )
  }

  if (!scene) return null

  return (
    <ZoomLayout
      scene={scene}
      gameState={gameState}
      reaction={reaction}
      thinking={thinking}
      choosing={choosing}
      onChoose={handleChoose}
      onRestart={handleRestart}
    />
  )
}
