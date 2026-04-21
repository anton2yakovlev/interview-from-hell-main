import { useNavigate } from 'react-router-dom'
import ChoiceList from '../components/ChoiceList'
import SceneCard from '../components/SceneCard'
import { useGameState } from '../hooks/useGameState'
import type { GameState } from '../types/game'

function pageAtmosphereClass(state: GameState): string {
  if (state.doubt >= 4) return 'atmosphere-page-horror'
  if (state.fatigue >= 2) return 'atmosphere-page-tense'
  if (state.doubt >= 2) return 'atmosphere-page-surreal'
  return ''
}

export default function GamePage() {
  const navigate = useNavigate()
  const { scene, gameState, loading, error, choosing, choose, restart } = useGameState()

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

  const isEnding = scene.type === 'ending'

  return (
    <div className={`game-page ${pageAtmosphereClass(gameState)}`}>
      <div className="game-inner">
        <header className="game-header">
          <span className="game-header-label">ПАО Сбер · Собеседование</span>
          <button className="btn-text" onClick={restart}>
            Начать заново
          </button>
        </header>

        <main className="game-main">
          {isEnding && <div className="ending-title">— конец —</div>}

          <SceneCard scene={scene} />

          {isEnding ? (
            <div className="ending-actions">
              <button className="btn-primary" onClick={restart}>
                Сыграть снова
              </button>
              <button className="btn-ghost" onClick={() => navigate('/')}>
                На главную
              </button>
            </div>
          ) : (
            <ChoiceList choices={scene.choices} disabled={choosing} onChoose={choose} />
          )}

          {choosing && <div className="choosing-indicator">...</div>}
        </main>
      </div>
    </div>
  )
}
