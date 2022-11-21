import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import Instance from './Instance'

export default function LoginButton() {
  useEffect(Instance.maybeFinishLogin, [])

  const [open, setOpen] = useState(false)
  const handleLogin = () => {
    setOpen(false)
    const instanceInput = document.getElementById('instance') as HTMLInputElement
    new Instance(instanceInput.value).beginLogin()
  }

  return <>
    <Button onClick={() => setOpen(true)}>Login</Button>

    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>Login</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please enter the name of the instance you want to log into, for example "mastodon.social".
        </DialogContentText>
        <TextField autoFocus id="instance" label="Instance" type="url" fullWidth variant="standard" />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)}>Cancel</Button>
        <Button onClick={handleLogin}>Login</Button>
      </DialogActions>
    </Dialog>
  </>
}
