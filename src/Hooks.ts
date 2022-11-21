import useEventListener from '@use-it/event-listener'
import { EffectCallback, useEffect, useState } from 'react'

export function useKeyPress(target: string): boolean {
  const [pressed, setPressed] = useState(false)

  useEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key == target) {
      setPressed(true)
      e.preventDefault()
    }
  })

  useEventListener('keyup', (e: KeyboardEvent) => {
    if (e.key == target) {
      setPressed(false)
      e.preventDefault()
    }
  })

  return pressed
}

export function useKeyHandler(target: string, handler: EffectCallback) {
  const pressed = useKeyPress(target)
  useEffect(() => { if (pressed) handler() }, [pressed])
}
