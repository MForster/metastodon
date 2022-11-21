import { Typography } from '@mui/material'
import Instance from './Instance'
import LoginButton from './LoginButton'
import Timeline from './Timeline'

export default function App() {
  const instance = Instance.instances()[0] // TODO: multiple instances

  return <>
    <Typography sx={{ display: 'inline' }}>{instance?.get_account_name()}</Typography>
    <LoginButton />
    <Timeline instance={instance}></Timeline>
  </>
}
