import type { Choice } from '../types/game'

interface Props {
  choices: Choice[]
  disabled: boolean
  onChoose: (choiceId: string) => void
}

export default function ChoiceList({ choices, disabled, onChoose }: Props) {
  if (choices.length === 0) return null

  return (
    <div className="choice-list">
      {choices.map((choice) => (
        <button
          key={choice.id}
          className="choice-btn"
          disabled={disabled}
          onClick={() => onChoose(choice.id)}
        >
          {choice.text}
        </button>
      ))}
    </div>
  )
}
