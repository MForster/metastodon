import { LinearProgress } from '@mui/material'
import { useState } from 'react'
import { useKeyHandler } from './Hooks'
import Instance from './Instance'
import StatusCard from './StatusCard'

export default function Timeline({ instance }: { instance: Instance }) {
  const { data, error } = instance.useTimeline('home')

  const [selection, setSelection] = useState(-1)
  useKeyHandler("ArrowDown", () => { setSelection(pos => Math.min(pos + 1, (data || []).length - 1)) })
  useKeyHandler("ArrowUp", () => { setSelection(pos => Math.max(pos - 1, 0)) })

  return error ? <>{error.toString()}</> :
    data ? <>{data.map((status, i) => <StatusCard selected={i == selection} key={status.uri} status={status} />)}</> :
      <LinearProgress />
}
