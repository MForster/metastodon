import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import Instance from './instance'
import { AccountData, loginToInstance, maybeFinishLogin } from './login'
import Status from './Status'
import PostView from './StatusCard'

export default function App() {
  const [timeline, setTimeline] = useState<Status[]>([])
  const instances = Instance.instances()

  useEffect(maybeFinishLogin, [])

  useEffect(() => {
    for (const instance of instances) {
      instance.get('api/v1/timelines/home').then(setTimeline)
    }
  }, [])

  let accounts: Record<string, AccountData> = JSON.parse(localStorage.getItem("accounts") || "{}")

  const [loginDialogOpen, setLoginDialogOpen] = useState(false)
  const handleLogin = () => {
    setLoginDialogOpen(false)
    const instance = (document.getElementById('instance') as HTMLInputElement).value
    loginToInstance(instance)
  }

  return <>
    {instances.map(instance =>
      <Typography key="instance" sx={{ display: 'inline' }}>{instance.get_account_name()}</Typography>)}
    <Button onClick={() => setLoginDialogOpen(true)}>Login</Button>
    <Dialog open={loginDialogOpen} onClose={() => setLoginDialogOpen(false)}>
      <DialogTitle>Login</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please enter the name of the instance you want to log into, for example "mastodon.social".
        </DialogContentText>
        <TextField autoFocus id="instance" label="Instance" type="url" fullWidth variant="standard" />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setLoginDialogOpen(false)}>Cancel</Button>
        <Button onClick={handleLogin}>Login</Button>
      </DialogActions>
    </Dialog>
    {
      timeline.map((status) =>
        <PostView key={status.uri} status={status} />)
    } </>
}
