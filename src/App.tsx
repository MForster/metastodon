import { Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import Instance from './Instance'
import LoginButton from './LoginButton'
import Status from './Status'
import StatusCard from './StatusCard'

export default function App() {
  const instance = Instance.instances()[0] // TODO: multiple instances

  const [timeline, setTimeline] = useState<Status[]>([])
  useEffect(() => {
    instance?.get('api/v1/timelines/home').then(setTimeline)
  }, [])

  return <>
    <Typography sx={{ display: 'inline' }}>{instance?.get_account_name()}</Typography>
    <LoginButton />
    {timeline.map(status => <StatusCard key={status.uri} status={status} />)}
  </>
}
