import { useNavigate } from 'react-router-dom'
import ChoiceList from '../ChoiceList'
import SceneCard from '../SceneCard'
import type { Scene } from '../../types/game'

interface Props {
  scene: Scene
  thinking: boolean
  choosing: boolean
  onChoose: (choiceId: string) => void
  onRestart: () => void
}

export default function DialogPanel({ scene, thinking, choosing, onChoose, onRestart }: Props) {
  const navigate = useNavigate()
  const isEnding = scene.type === 'ending'

  return (
    <div className="dialog-panel">
      <div className="dialog-scroll">
        {isEnding && <div className="ending-title">— конец —</div>}

        <SceneCard scene={scene} />

        {isEnding ? (
          <div className="ending-actions">
            <button className="btn-primary" onClick={onRestart}>Сыграть снова</button>
            <button className="btn-ghost" onClick={() => navigate('/')}>На главную</button>
          </div>
        ) : (
          <>
            <ChoiceList
              choices={scene.choices}
              disabled={choosing || thinking}
              onChoose={onChoose}
            />
            {thinking && <div className="dialog-thinking">ожидание ответа...</div>}
          </>
        )}
      </div>
    </div>
  )
}
