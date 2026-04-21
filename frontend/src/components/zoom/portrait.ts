import type { ReactionStyle } from './reactions'

export interface AnimState {
  blinkAmount: number  // 0 open → 1 closed
  headX: number
  headY: number
  breathPhase: number  // radians
  glitchOffset: number
}

export function drawPortrait(
  ctx: CanvasRenderingContext2D,
  style: ReactionStyle,
  anim: AnimState,
) {
  const W = ctx.canvas.width
  const H = ctx.canvas.height

  drawBackground(ctx, W, H, style)

  // Body is drawn relative to its own offset
  ctx.save()
  ctx.translate(anim.headX, anim.headY + Math.sin(anim.breathPhase) * 1.5)

  drawBody(ctx, W, H, style)

  // Optional glitch: translate head subtly
  ctx.save()
  if (style.glitch && Math.abs(anim.glitchOffset) > 0.3) {
    ctx.translate(anim.glitchOffset, 0)
  }

  drawHead(ctx, W, H, style)
  drawEyes(ctx, W, H, style, anim.blinkAmount)
  drawEyebrows(ctx, W, H, style)
  drawNose(ctx, W, H, style)
  drawMouth(ctx, W, H, style)

  ctx.restore() // glitch
  ctx.restore() // head offset

  drawBadge(ctx, W, H)
}

// ─── Background ────────────────────────────────────────────────────────────

function drawBackground(ctx: CanvasRenderingContext2D, W: number, H: number, style: ReactionStyle) {
  const g = style.bgGreen

  // Main gradient
  const grad = ctx.createLinearGradient(0, 0, 0, H)
  grad.addColorStop(0, `rgb(${lerp(14, 6, g)}, ${lerp(18, 26, g)}, ${lerp(20, 10, g)})`)
  grad.addColorStop(1, `rgb(${lerp(10, 4, g)}, ${lerp(14, 20, g)}, ${lerp(16, 8, g)})`)
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, W, H)

  // Bookshelf left wall
  const books = ['#2a3a4a', '#1a2a3a', '#3a2a1a', '#2a1a2a', '#1a3a2a', '#3a3a1a']
  ctx.fillStyle = '#3a2a1a'
  ctx.fillRect(6, 25, 150, 6)   // top shelf
  ctx.fillRect(6, 90, 150, 5)   // mid shelf
  for (let i = 0; i < 7; i++) {
    ctx.fillStyle = books[i % books.length]
    ctx.fillRect(10 + i * 19, 32, 15, 56)
  }
  ctx.fillStyle = '#3a2a1a'
  ctx.fillRect(6, 95, 140, 5)
  for (let i = 0; i < 5; i++) {
    ctx.fillStyle = books[(i + 2) % books.length]
    ctx.fillRect(12 + i * 24, 102, 20, 52)
  }
  ctx.fillStyle = '#3a2a1a'
  ctx.fillRect(6, 155, 145, 5)

  // Window top-right
  const wg = ctx.createLinearGradient(W - 130, 0, W - 20, 0)
  const wA = 0.12 + g * 0.18
  wg.addColorStop(0, `rgba(30,${lerp(60, 100, g)},30,${wA})`)
  wg.addColorStop(1, `rgba(20,${lerp(40, 70, g)},20,${wA * 0.5})`)
  ctx.fillStyle = wg
  ctx.fillRect(W - 135, 0, 128, 110)
  // frame
  ctx.strokeStyle = `rgba(${lerp(40, 20, g)},${lerp(80, 130, g)},${lerp(40, 20, g)},0.4)`
  ctx.lineWidth = 2
  ctx.strokeRect(W - 135, 0, 128, 110)
  ctx.beginPath()
  ctx.moveTo(W - 72, 0); ctx.lineTo(W - 72, 110)
  ctx.moveTo(W - 135, 55); ctx.lineTo(W - 7, 55)
  ctx.stroke()

  // Floor
  ctx.fillStyle = `rgb(${lerp(10, 6, g)}, ${lerp(12, 10, g)}, ${lerp(12, 8, g)})`
  ctx.fillRect(0, H - 44, W, 44)

  // Plant (bottom-right)
  ctx.fillStyle = '#3a2a1a'
  ctx.fillRect(W - 52, H - 66, 32, 28)
  ctx.fillStyle = `rgba(18, ${lerp(80, 140, g)}, 18, 0.85)`
  ctx.beginPath(); ctx.arc(W - 36, H - 75, 20, 0, Math.PI * 2); ctx.fill()
  ctx.fillStyle = `rgba(24, ${lerp(100, 170, g)}, 24, 0.6)`
  ctx.beginPath(); ctx.arc(W - 50, H - 66, 13, 0, Math.PI * 2); ctx.fill()
  ctx.beginPath(); ctx.arc(W - 24, H - 68, 12, 0, Math.PI * 2); ctx.fill()

  // Mug (bottom-left)
  ctx.fillStyle = '#1e1e1e'
  ctx.fillRect(58, H - 54, 24, 22)
  ctx.fillStyle = `rgba(20, ${lerp(90, 150, g)}, 30, 0.9)`
  ctx.fillRect(60, H - 52, 20, 18)
  ctx.strokeStyle = `rgba(20, ${lerp(90, 150, g)}, 30, 0.9)`
  ctx.lineWidth = 2
  ctx.beginPath(); ctx.arc(82, H - 43, 5, -Math.PI / 2, Math.PI / 2); ctx.stroke()
  // steam
  ctx.strokeStyle = 'rgba(200,200,200,0.25)'
  ctx.lineWidth = 1.2
  for (let i = 0; i < 2; i++) {
    ctx.beginPath()
    ctx.moveTo(66 + i * 7, H - 55)
    ctx.quadraticCurveTo(63 + i * 7, H - 64, 68 + i * 7, H - 72)
    ctx.stroke()
  }
}

// ─── Body ──────────────────────────────────────────────────────────────────

function drawBody(ctx: CanvasRenderingContext2D, W: number, H: number, style: ReactionStyle) {
  const cx = W / 2

  // Suit (trapezoid shoulders)
  ctx.fillStyle = style.suitColor
  ctx.beginPath()
  ctx.moveTo(cx - 130, H)
  ctx.lineTo(cx - 95, H - 108)
  ctx.lineTo(cx + 95, H - 108)
  ctx.lineTo(cx + 130, H)
  ctx.closePath()
  ctx.fill()

  // Shirt collar (white V)
  ctx.fillStyle = '#e8e8e8'
  ctx.beginPath()
  ctx.moveTo(cx - 18, H - 108)
  ctx.lineTo(cx, H - 74)
  ctx.lineTo(cx + 18, H - 108)
  ctx.closePath()
  ctx.fill()

  // Green tie
  ctx.fillStyle = '#1a8832'
  ctx.beginPath()
  ctx.moveTo(cx - 8, H - 108)
  ctx.lineTo(cx - 11, H - 66)
  ctx.lineTo(cx, H - 58)
  ctx.lineTo(cx + 11, H - 66)
  ctx.lineTo(cx + 8, H - 108)
  ctx.closePath()
  ctx.fill()
  // tie knot
  ctx.fillStyle = '#156028'
  ctx.beginPath()
  ctx.ellipse(cx, H - 110, 8, 5, 0, 0, Math.PI * 2)
  ctx.fill()

  // Neck
  ctx.fillStyle = style.skinTone
  ctx.fillRect(cx - 17, H - 128, 34, 26)
}

// ─── Head ──────────────────────────────────────────────────────────────────

function drawHead(ctx: CanvasRenderingContext2D, W: number, H: number, style: ReactionStyle) {
  const cx = W / 2
  const cy = H * 0.405

  // Shadow
  ctx.save()
  ctx.shadowColor = 'rgba(0,0,0,0.55)'
  ctx.shadowBlur = 22
  ctx.shadowOffsetY = 10
  ctx.fillStyle = style.skinTone
  ctx.beginPath()
  ctx.ellipse(cx, cy, 73, 90, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()

  // Head fill
  ctx.fillStyle = style.skinTone
  ctx.beginPath()
  ctx.ellipse(cx, cy, 73, 90, 0, 0, Math.PI * 2)
  ctx.fill()

  // Subtle cheek gradient
  const ch = ctx.createRadialGradient(cx - 18, cy + 20, 2, cx - 18, cy + 20, 38)
  ch.addColorStop(0, 'rgba(200,140,100,0.12)')
  ch.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = ch
  ctx.beginPath()
  ctx.ellipse(cx, cy, 73, 90, 0, 0, Math.PI * 2)
  ctx.fill()

  // Hair
  ctx.fillStyle = '#22160c'
  ctx.beginPath()
  ctx.ellipse(cx, cy - 70, 73, 30, 0, Math.PI, Math.PI * 2)
  ctx.fill()
  // Hair highlight
  ctx.fillStyle = '#332010'
  ctx.beginPath()
  ctx.ellipse(cx - 12, cy - 84, 42, 22, -0.15, Math.PI, Math.PI * 2)
  ctx.fill()
  // Side burns / hair sides
  ctx.fillStyle = '#22160c'
  ctx.beginPath()
  ctx.ellipse(cx - 68, cy - 30, 14, 35, 0.3, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.ellipse(cx + 68, cy - 30, 14, 35, -0.3, 0, Math.PI * 2)
  ctx.fill()
}

// ─── Eyes ──────────────────────────────────────────────────────────────────

function drawEyes(
  ctx: CanvasRenderingContext2D,
  W: number, H: number,
  style: ReactionStyle,
  blinkAmount: number,
) {
  const cx = W / 2
  const cy = H * 0.405
  const eyeY = cy - 18 + style.eyeOffsetY
  const baseRy = 7.5 * style.eyeOpenness

  for (const eyeX of [cx - 27, cx + 27]) {
    ctx.save()
    // Clip to eye shape so iris/lid don't spill
    ctx.beginPath()
    ctx.ellipse(eyeX, eyeY, 13, Math.max(0.5, baseRy), 0, 0, Math.PI * 2)
    ctx.clip()

    // White
    ctx.fillStyle = '#ede5d8'
    ctx.fillRect(eyeX - 14, eyeY - baseRy - 1, 28, (baseRy + 1) * 2)

    // Iris
    const irisRy = baseRy * (1 - blinkAmount)
    if (irisRy > 0.3) {
      ctx.fillStyle = style.eyeColor
      ctx.beginPath()
      ctx.ellipse(eyeX, eyeY, 6.5, irisRy * 0.88, 0, 0, Math.PI * 2)
      ctx.fill()

      // Pupil
      ctx.fillStyle = 'rgba(0,0,0,0.75)'
      ctx.beginPath()
      ctx.ellipse(eyeX, eyeY, 3, irisRy * 0.42, 0, 0, Math.PI * 2)
      ctx.fill()

      // Catchlight
      ctx.fillStyle = 'rgba(255,255,255,0.7)'
      ctx.beginPath()
      ctx.arc(eyeX + 2.5, eyeY - 2, 1.8, 0, Math.PI * 2)
      ctx.fill()
    }

    // Eyelid curtain (closes from top)
    if (blinkAmount > 0) {
      ctx.fillStyle = style.skinTone
      ctx.fillRect(eyeX - 14, eyeY - baseRy - 1, 28, (baseRy * 2 + 2) * blinkAmount)
    }

    ctx.restore()

    // Outline
    ctx.strokeStyle = 'rgba(0,0,0,0.22)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.ellipse(eyeX, eyeY, 13, Math.max(0.5, baseRy), 0, 0, Math.PI * 2)
    ctx.stroke()
  }
}

// ─── Eyebrows ──────────────────────────────────────────────────────────────

function drawEyebrows(ctx: CanvasRenderingContext2D, W: number, H: number, style: ReactionStyle) {
  const cx = W / 2
  const cy = H * 0.405
  const eyeY = cy - 18 + style.eyeOffsetY
  const browsY = eyeY - 15

  ctx.strokeStyle = '#20120a'
  ctx.lineWidth = 3
  ctx.lineCap = 'round'

  const frown = style.mouthCurve < 0
  const raise = style.mouthCurve > 0.5 ? 3 : 0

  // Left brow
  ctx.beginPath()
  ctx.moveTo(cx - 40, browsY + (frown ? 5 : 0) - raise)
  ctx.lineTo(cx - 14, browsY - (frown ? 4 : 0) - raise)
  ctx.stroke()

  // Right brow
  ctx.beginPath()
  ctx.moveTo(cx + 14, browsY - (frown ? 4 : 0) - raise)
  ctx.lineTo(cx + 40, browsY + (frown ? 5 : 0) - raise)
  ctx.stroke()
}

// ─── Nose ──────────────────────────────────────────────────────────────────

function drawNose(ctx: CanvasRenderingContext2D, W: number, H: number, style: ReactionStyle) {
  const cx = W / 2
  const cy = H * 0.405

  ctx.strokeStyle = `rgba(0,0,0,${0.18 + (1 - style.eyeOpenness) * 0.08})`
  ctx.lineWidth = 1.5
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'

  ctx.beginPath()
  ctx.moveTo(cx - 5, cy - 6)
  ctx.lineTo(cx - 7, cy + 8)
  ctx.lineTo(cx, cy + 11)
  ctx.lineTo(cx + 7, cy + 8)
  ctx.lineTo(cx + 5, cy - 6)
  ctx.stroke()
}

// ─── Mouth ─────────────────────────────────────────────────────────────────

function drawMouth(ctx: CanvasRenderingContext2D, W: number, H: number, style: ReactionStyle) {
  const cx = W / 2
  const cy = H * 0.405
  const mouthY = cy + 32 + style.mouthOffsetY
  const halfW = 26
  const curve = style.mouthCurve * 13

  // Lip shadow
  ctx.strokeStyle = 'rgba(0,0,0,0.15)'
  ctx.lineWidth = 5
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(cx - halfW, mouthY)
  ctx.quadraticCurveTo(cx, mouthY + curve, cx + halfW, mouthY)
  ctx.stroke()

  // Lip line
  ctx.strokeStyle = '#7a5030'
  ctx.lineWidth = 2.5
  ctx.beginPath()
  ctx.moveTo(cx - halfW, mouthY)
  ctx.quadraticCurveTo(cx, mouthY + curve, cx + halfW, mouthY)
  ctx.stroke()

  // Subtle teeth for smile
  if (style.mouthCurve > 0.45) {
    ctx.save()
    ctx.beginPath()
    ctx.moveTo(cx - halfW, mouthY)
    ctx.quadraticCurveTo(cx, mouthY + curve, cx + halfW, mouthY)
    ctx.lineTo(cx + halfW * 0.7, mouthY + curve * 0.4)
    ctx.quadraticCurveTo(cx, mouthY + curve * 0.7, cx - halfW * 0.7, mouthY + curve * 0.4)
    ctx.closePath()
    ctx.fillStyle = 'rgba(255,255,255,0.65)'
    ctx.fill()
    ctx.restore()
  }
}

// ─── Name badge ────────────────────────────────────────────────────────────

function drawBadge(ctx: CanvasRenderingContext2D, _W: number, H: number) {
  ctx.fillStyle = 'rgba(0,0,0,0.55)'
  ctx.beginPath()
  ctx.roundRect(8, H - 42, 196, 34, 4)
  ctx.fill()

  ctx.fillStyle = '#21a038'
  ctx.fillRect(8, H - 42, 3, 34)

  ctx.font = '600 12px system-ui,-apple-system,sans-serif'
  ctx.fillStyle = '#ffffff'
  ctx.fillText('Алина Соколова', 18, H - 26)

  ctx.font = '11px system-ui,-apple-system,sans-serif'
  ctx.fillStyle = '#aaaaaa'
  ctx.fillText('HR-менеджер · СберБизнес', 18, H - 12)
}

// ─── Util ──────────────────────────────────────────────────────────────────

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * Math.max(0, Math.min(1, t))
}
