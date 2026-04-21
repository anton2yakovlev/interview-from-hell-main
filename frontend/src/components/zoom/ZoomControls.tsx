import { useState } from 'react'

interface Props {
  onLeave: () => void
  elapsedSeconds: number
}

function formatTime(s: number) {
  const m = Math.floor(s / 60)
  const ss = s % 60
  return `${String(m).padStart(2, '0')}:${String(ss).padStart(2, '0')}`
}

export default function ZoomControls({ onLeave, elapsedSeconds }: Props) {
  const [muted, setMuted] = useState(false)
  const [videoOff, setVideoOff] = useState(false)

  return (
    <div className="zoom-controls">
      <div className="zoom-timer">{formatTime(elapsedSeconds)}</div>

      <div className="zoom-ctrl-group">
        <button
          className={`zoom-ctrl-btn ${muted ? 'zoom-ctrl-btn--active' : ''}`}
          onClick={() => setMuted(v => !v)}
          title={muted ? 'Включить микрофон' : 'Выключить микрофон'}
        >
          <span className="zoom-ctrl-icon">{muted ? '✕' : '◉'}</span>
          <span className="zoom-ctrl-label">{muted ? 'Без звука' : 'Микрофон'}</span>
        </button>

        <button
          className={`zoom-ctrl-btn ${videoOff ? 'zoom-ctrl-btn--active' : ''}`}
          onClick={() => setVideoOff(v => !v)}
          title={videoOff ? 'Включить видео' : 'Выключить видео'}
        >
          <span className="zoom-ctrl-icon">{videoOff ? '□' : '▣'}</span>
          <span className="zoom-ctrl-label">Видео</span>
        </button>

        <button className="zoom-ctrl-btn" title="Чат" disabled>
          <span className="zoom-ctrl-icon">☐</span>
          <span className="zoom-ctrl-label">Чат</span>
        </button>

        <button className="zoom-ctrl-btn" title="Участники" disabled>
          <span className="zoom-ctrl-icon">◎</span>
          <span className="zoom-ctrl-label">Участники</span>
        </button>
      </div>

      <button className="zoom-ctrl-btn zoom-ctrl-btn--leave" onClick={onLeave} title="Покинуть">
        <span className="zoom-ctrl-icon">✕</span>
        <span className="zoom-ctrl-label">Покинуть</span>
      </button>
    </div>
  )
}
