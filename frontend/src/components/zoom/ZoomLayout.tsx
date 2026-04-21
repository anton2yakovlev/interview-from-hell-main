import { useEffect, useRef, useState } from 'react'
import type { Reaction } from './reactions'
import VideoPanel from './VideoPanel'
import DialogPanel from './DialogPanel'
import ZoomControls from './ZoomControls'
import type { GameState, Scene } from '../../types/game'

interface Props {
  scene: Scene
  gameState: GameState
  reaction: Reaction
  thinking: boolean
  choosing: boolean
  onChoose: (choiceId: string) => void
  onRestart: () => void
}

export default function ZoomLayout({
  scene, gameState: _gameState, reaction, thinking, choosing, onChoose, onRestart,
}: Props) {
  const [elapsed, setElapsed] = useState(0)
  const startRef = useRef(Date.now())

  useEffect(() => {
    const id = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startRef.current) / 1000))
    }, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="zoom-layout">
      {/* Header bar */}
      <div className="zoom-header">
        <div className="zoom-header-badge">
          <span className="zoom-header-dot" />
          СберБизнес · Финальное собеседование
        </div>
        <div className="zoom-header-spacer" />
        <div className="zoom-header-secure">🔒 зашифровано</div>
      </div>

      {/* Main content */}
      <div className="zoom-body">
        <div className="zoom-video-area">
          <VideoPanel reaction={reaction} thinking={thinking} />
        </div>
        <div className="zoom-dialog-area">
          <DialogPanel
            scene={scene}
            thinking={thinking}
            choosing={choosing}
            onChoose={onChoose}
            onRestart={onRestart}
          />
        </div>
      </div>

      {/* Controls bar */}
      <ZoomControls onLeave={onRestart} elapsedSeconds={elapsed} />
    </div>
  )
}
