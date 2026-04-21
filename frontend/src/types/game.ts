export interface GameState {
  loyalty: number
  doubt: number
  fatigue: number
}

export interface Choice {
  id: string
  text: string
  next_scene_id: string
  effects?: Partial<GameState>
}

export type SceneType = 'system' | 'dialogue' | 'conditional' | 'ending'

export interface Scene {
  id: string
  type: SceneType
  speaker?: string
  text?: string
  choices: Choice[]
}

export interface StartResponse {
  scene: Scene
  initial_state: GameState
}

export interface ChoiceResponse {
  next_scene_id: string
  scene: Scene
  new_state: GameState
}
