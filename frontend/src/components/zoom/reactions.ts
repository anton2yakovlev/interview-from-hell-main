import type { Choice, GameState } from '../../types/game'

export type Reaction = 'neutral' | 'friendly' | 'suspicious' | 'disappointed' | 'uncanny'

export interface ReactionStyle {
  eyeOpenness: number      // 0.5 squint → 1.3 wide
  eyeOffsetY: number
  mouthCurve: number       // -1 frown → 1 smile
  mouthOffsetY: number
  bgGreen: number          // 0–1 how green the background gets
  blinkIntervalMs: number  // 0 = never blinks (uncanny)
  microMovement: number    // amplitude of idle movement
  glitch: boolean
  skinTone: string
  eyeColor: string
  suitColor: string
}

export const REACTIONS: Record<Reaction, ReactionStyle> = {
  neutral: {
    eyeOpenness: 1,
    eyeOffsetY: 0,
    mouthCurve: 0,
    mouthOffsetY: 0,
    bgGreen: 0.25,
    blinkIntervalMs: 3500,
    microMovement: 1,
    glitch: false,
    skinTone: '#c8a882',
    eyeColor: '#2a1a10',
    suitColor: '#1a2040',
  },
  friendly: {
    eyeOpenness: 1.15,
    eyeOffsetY: -2,
    mouthCurve: 0.7,
    mouthOffsetY: 0,
    bgGreen: 0.3,
    blinkIntervalMs: 4500,
    microMovement: 0.6,
    glitch: false,
    skinTone: '#d4b090',
    eyeColor: '#2a1a10',
    suitColor: '#1a2040',
  },
  suspicious: {
    eyeOpenness: 0.5,
    eyeOffsetY: 1,
    mouthCurve: -0.2,
    mouthOffsetY: 2,
    bgGreen: 0.45,
    blinkIntervalMs: 6000,
    microMovement: 0.4,
    glitch: false,
    skinTone: '#bfa070',
    eyeColor: '#1a0e08',
    suitColor: '#141830',
  },
  disappointed: {
    eyeOpenness: 0.7,
    eyeOffsetY: 4,
    mouthCurve: -0.75,
    mouthOffsetY: 4,
    bgGreen: 0.15,
    blinkIntervalMs: 2500,
    microMovement: 0.5,
    glitch: false,
    skinTone: '#b89868',
    eyeColor: '#2a1a10',
    suitColor: '#181830',
  },
  uncanny: {
    eyeOpenness: 1.35,
    eyeOffsetY: -2,
    mouthCurve: 0.1,
    mouthOffsetY: 5,
    bgGreen: 0.9,
    blinkIntervalMs: 0,
    microMovement: 2.5,
    glitch: true,
    skinTone: '#a0b89a',
    eyeColor: '#003800',
    suitColor: '#081408',
  },
}

const LATE_SCENES = new Set(['scene_8', 'scene_9', 'scene_10', 'scene_11'])

export function choiceToReaction(choice: Choice, sceneId: string): Reaction {
  if (LATE_SCENES.has(sceneId)) return 'uncanny'
  const e = choice.effects ?? {}
  if ((e.loyalty ?? 0) >= 2) return 'friendly'
  if ((e.doubt  ?? 0) >= 2) return 'suspicious'
  if ((e.fatigue ?? 0) >= 1) return 'disappointed'
  if ((e.loyalty ?? 0) >= 1) return 'friendly'
  if ((e.doubt  ?? 0) >= 1) return 'suspicious'
  return 'neutral'
}

export function stateToReaction(sceneId: string, gs: GameState): Reaction {
  if (LATE_SCENES.has(sceneId)) return 'uncanny'
  if (gs.doubt   >= 3) return 'suspicious'
  if (gs.loyalty >= 4) return 'friendly'
  return 'neutral'
}
