import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { AccessToken, AccountData, loginToInstance, maybeFinishLogin } from './login'
import Status from './Status'
import PostView from './StatusCard'

export default function App() {
  const [timeline, setTimeline] = useState<Status[]>([])

  useEffect(maybeFinishLogin, [])

  useEffect(() => {
    let stored: Record<string, AccessToken> = JSON.parse(localStorage.getItem("tokens") || "{}")

    for (const [instance, token] of Object.entries(stored)) {
      fetch(`https://${instance}/api/v1/timelines/home`, {
        headers: { "Authorization": `Bearer ${token.access_token}` }
      }).then((response) => response.json())
        .then(setTimeline)
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
    {Object.entries(accounts).map(([instance, account]) =>
      <Typography key="instance" sx={{ display: 'inline' }}>{account.username}@{instance}</Typography>)}
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
