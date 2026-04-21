import type { ChoiceResponse, GameState, Scene, StartResponse } from '../types/game'

const BASE = '/api'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, init)
  if (!res.ok) {
    const body = await res.text()
    throw new Error(body || `HTTP ${res.status}`)
  }
  return res.json() as Promise<T>
}

export function fetchStartScene(): Promise<StartResponse> {
  return request<StartResponse>('/scenes/start')
}

export function fetchScene(sceneId: string): Promise<Scene> {
  return request<Scene>(`/scenes/${sceneId}`)
}

export function submitChoice(
  sceneId: string,
  choiceId: string,
  state: GameState,
): Promise<ChoiceResponse> {
  return request<ChoiceResponse>(`/scenes/${sceneId}/choose`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ choice_id: choiceId, state }),
  })
}
