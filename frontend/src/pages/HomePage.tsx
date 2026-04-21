import { useNavigate } from 'react-router-dom'
import { hasSavedProgress } from '../hooks/useGameState'

export default function HomePage() {
  const navigate = useNavigate()
  const hasProgress = hasSavedProgress()

  return (
    <div className="home-page">
      <div className="home-inner">
        <div className="home-label">ПАО Сбер · Отдел визуальных коммуникаций</div>
        <h1 className="home-title">Interview<br />From Hell</h1>
        <p className="home-description">
          Финальное собеседование на позицию Senior Graphic Designer.
          <br />
          Всё начинается как обычно.
        </p>

        <div className="home-actions">
          {hasProgress ? (
            <>
              <button className="btn-primary" onClick={() => navigate('/game')}>
                Продолжить
              </button>
              <button
                className="btn-ghost"
                onClick={() => {
                  localStorage.removeItem('ifh-progress')
                  navigate('/game')
                }}
              >
                Начать заново
              </button>
            </>
          ) : (
            <button className="btn-primary" onClick={() => navigate('/game')}>
              Начать собеседование
            </button>
          )}
        </div>

        <div className="home-footer">Регистрация не требуется</div>
      </div>
    </div>
  )
}
