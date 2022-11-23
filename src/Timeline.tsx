import { LinearProgress } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { DBContext } from './Database'
import { useKeyHandler } from './Hooks'
import Status from './Status'
import StatusCard from './StatusCard'

export default function Timeline() {
  const db = useContext(DBContext)

  const [timeline, setTimeline] = useState<Status[]>([])
  useEffect(() => { db.getStatuses().then(setTimeline) }, [])

  const [selection, setSelection] = useState(-1)
  useKeyHandler("ArrowDown", () => { setSelection(pos => Math.min(pos + 1, timeline.length - 1)) })
  useKeyHandler("ArrowUp", () => { setSelection(pos => Math.max(pos - 1, 0)) })

  return timeline ? <>{timeline.map((status, i) => <StatusCard selected={i == selection} key={status.uri} status={status} />)}</> :
    <LinearProgress />
}
