import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import Status from './Status'
import PostView from './StatusCard'


interface AppCredentials {
  client_id: string
  client_secret: string
}

interface AccessToken {
  access_token: string,
  token_type: string,
  scope: string,
  created_at: number,
}

interface AccountData {
  username: string,
  display_name: string,
  avatar: string,
}

export default function App() {
  const [timeline, setTimeline] = useState<Status[]>([])
  const [account, setAccount] = useState<AccountData | null>(null)
  const [instance, setInstance] = useState<string | null>(null)


  useEffect(() => {

    let params = new URLSearchParams(location.search)

    let instance = params.get('instance') as string
    let code = params.get('code') as string

    if (instance && code) {
      setInstance(instance)
      window.history.pushState({}, '', '/')

      let creds = JSON.parse(localStorage.getItem('app_credentials') || "{}")?.[instance] as AppCredentials
      let redirect_uri = `${location.origin}${location.pathname}?instance=${instance}`
      fetch(`https://${instance}/oauth/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grant_type: 'authorization_code',
          client_id: creds.client_id,
          client_secret: creds.client_secret,
          redirect_uri,
          code
        })
      })
        .then(res => res.json())
        .then((creds: AccessToken) => {
          let stored = JSON.parse(localStorage.getItem("tokens") || "{}")
          stored[instance] = creds
          localStorage.setItem("tokens", JSON.stringify(stored))

          return fetch(`https://${instance}/api/v1/accounts/verify_credentials`, {
            headers: { "Authorization": `Bearer ${creds.access_token}` }
          })
        })
        .then(res => res.json())
        .then(setAccount)
    }
  }, [])

  useEffect(() => {
    if (account && instance) {
      let stored = JSON.parse(localStorage.getItem("tokens") || "{}")
      fetch(`https://${instance}/api/v1/timelines/home`, {
        headers: { "Authorization": `Bearer ${stored[instance].access_token}` }
      }).then((response) => response.json())
        .then(setTimeline)
    } else {
      // fetch('https://mastodon.social/api/v1/timelines/public')
      //   .then((response) => response.json())
      //   .then(setTimeline)
    }
  }, [account, instance])

  const [loginDialogOpen, setLoginDialogOpen] = useState(false)
  const handleLogin = () => {
    setLoginDialogOpen(false)
    const instance = (document.getElementById('instance') as HTMLInputElement).value

    let redirect_uri = `${location.origin}${location.pathname}?instance=${instance}`

    fetch(`https://${instance}/api/v1/apps`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_name: 'metastodon',
        redirect_uris: redirect_uri,
      })
    })
      .then(res => res.json() as Promise<AppCredentials>)
      .then(creds => {
        let stored = JSON.parse(localStorage.getItem("app_credentials") || "{}")
        stored[instance] = creds
        localStorage.setItem("app_credentials", JSON.stringify(stored))

        location.href = `https://${instance}/oauth/authorize?response_type=code&client_id=${creds.client_id}&redirect_uri=${redirect_uri}`
      })
  }

  return <>
    {account && account.username}
    /
    {instance}
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
