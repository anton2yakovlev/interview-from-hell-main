import { useEffect, useRef } from 'react'
import { drawPortrait } from './portrait'
import { REACTIONS, type Reaction } from './reactions'

interface Props {
  reaction: Reaction
  thinking: boolean
}

interface AnimState {
  blinkAmount: number
  blinkTimer: number
  nextBlinkIn: number
  isBlinking: boolean
  blinkPhase: 'closing' | 'opening'
  headX: number
  headY: number
  headTargetX: number
  headTargetY: number
  breathPhase: number
  glitchOffset: number
}

export default function VideoPanel({ reaction, thinking }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const styleRef = useRef(REACTIONS[reaction])
  const animStateRef = useRef<AnimState>({
    blinkAmount: 0,
    blinkTimer: 0,
    nextBlinkIn: 2000,
    isBlinking: false,
    blinkPhase: 'closing',
    headX: 0,
    headY: 0,
    headTargetX: 0,
    headTargetY: 0,
    breathPhase: 0,
    glitchOffset: 0,
  })

  // Keep style ref in sync on every render — no effect restart needed
  styleRef.current = REACTIONS[reaction]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let rafId = 0
    let lastTime = performance.now()

    function tick(now: number) {
      const dt = Math.min(now - lastTime, 50)
      lastTime = now

      const style = styleRef.current
      const s = animStateRef.current

      // Breath
      s.breathPhase += dt * 0.00095

      // Head micro-movement: drift toward random target
      s.headX += (s.headTargetX - s.headX) * 0.04
      s.headY += (s.headTargetY - s.headY) * 0.04
      if (Math.hypot(s.headX - s.headTargetX, s.headY - s.headTargetY) < 0.4) {
        const amp = style.microMovement
        s.headTargetX = (Math.random() - 0.5) * 4 * amp
        s.headTargetY = (Math.random() - 0.5) * 3 * amp
      }

      // Blink
      if (style.blinkIntervalMs > 0) {
        if (!s.isBlinking) {
          s.blinkTimer += dt
          if (s.blinkTimer >= s.nextBlinkIn) {
            s.isBlinking = true
            s.blinkPhase = 'closing'
            s.blinkTimer = 0
            s.nextBlinkIn = style.blinkIntervalMs + (Math.random() - 0.5) * 1800
          }
        } else {
          if (s.blinkPhase === 'closing') {
            s.blinkAmount = Math.min(1, s.blinkAmount + dt / 75)
            if (s.blinkAmount >= 1) s.blinkPhase = 'opening'
          } else {
            s.blinkAmount = Math.max(0, s.blinkAmount - dt / 110)
            if (s.blinkAmount <= 0) s.isBlinking = false
          }
        }
      } else {
        // Uncanny — eyes never close
        s.blinkAmount = 0
        s.isBlinking = false
      }

      // Glitch (uncanny)
      if (style.glitch) {
        if (Math.random() < 0.025) {
          s.glitchOffset = (Math.random() - 0.5) * 9
        } else {
          s.glitchOffset *= 0.72
        }
      } else {
        s.glitchOffset = 0
      }

      drawPortrait(ctx!, style, {
        blinkAmount: s.blinkAmount,
        headX: s.headX,
        headY: s.headY,
        breathPhase: s.breathPhase,
        glitchOffset: s.glitchOffset,
      })

      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, []) // single loop, reads styleRef each frame

  return (
    <div className="video-panel">
      <canvas ref={canvasRef} width={480} height={320} className="portrait-canvas" />

      {/* Self-cam PiP */}
      <div className="self-cam">
        <div className="self-cam-inner">
          <span className="self-cam-initials">СО</span>
          <span className="self-cam-label">ВЫ</span>
        </div>
      </div>

      {/* Connection status dot */}
      <div className="video-status">
        <span className={`status-dot ${reaction === 'uncanny' ? 'status-dot--warn' : 'status-dot--ok'}`} />
        <span className="status-text">
          {reaction === 'uncanny' ? 'нестабильное соединение' : 'подключено'}
        </span>
      </div>

      {/* Thinking overlay */}
      {thinking && (
        <div className="thinking-overlay">
          <span className="thinking-text">Алина обдумывает ответ</span>
          <span className="thinking-ellipsis" />
        </div>
      )}
    </div>
  )
}
