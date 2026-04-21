import type { Scene } from '../types/game'

interface Props {
  scene: Scene
}

export default function SceneCard({ scene }: Props) {
  const lines = (scene.text ?? '').split('\n\n')
  const isSystem = scene.type === 'system'

  return (
    <div className={`scene-card scene-type-${scene.type}`}>
      {isSystem ? (
        <div className="scene-system-label">// система</div>
      ) : (
        scene.speaker && <div className="scene-speaker">{scene.speaker}</div>
      )}
      <div className="scene-text">
        {lines.map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>
    </div>
  )
}
