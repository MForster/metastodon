import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import Instance from './Instance'

export default function LoginButton() {
  useEffect(Instance.maybeFinishLogin, [])

  const loginButton = useRef<HTMLInputElement>(null)

  const [open, setOpen] = useState(false)
  const handleLogin = () => {
    setOpen(false)
    if (loginButton.current)
      new Instance(loginButton.current.value).beginLogin()
  }

  return <>
    <Button onClick={() => setOpen(true)}>Login</Button>

    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>Login</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please enter the name of the instance you want to log into, for example "mastodon.social".
        </DialogContentText>
        <TextField inputRef={loginButton} autoFocus id="instance" label="Instance" type="url" fullWidth variant="standard" />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)}>Cancel</Button>
        <Button onClick={handleLogin}>Login</Button>
      </DialogActions>
    </Dialog>
  </>
}
