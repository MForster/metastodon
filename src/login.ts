import { api_get, api_post } from './api'

interface AppCredentials {
  client_id: string
  client_secret: string
}

export interface AccessToken {
  access_token: string,
  token_type: string,
  scope: string,
  created_at: number,
}

export interface AccountData {
  username: string,
  display_name: string,
  avatar: string,
}

export function maybeFinishLogin() {
  let params = new URLSearchParams(location.search)
  let instance = params.get('instance') as string
  let code = params.get('code') as string

  if (instance && code) {
    window.history.pushState({}, '', '/')

    let creds = JSON.parse(localStorage.getItem('app_credentials') || "{}")?.[instance] as AppCredentials
    let redirect_uri = `${location.origin}${location.pathname}?instance=${instance}`

    api_post(instance, 'oauth/token', {
      grant_type: 'authorization_code',
      client_id: creds.client_id,
      client_secret: creds.client_secret,
      redirect_uri,
      code
    })
      .then((creds: AccessToken) => {
        let stored = JSON.parse(localStorage.getItem("tokens") || "{}")
        stored[instance] = creds
        localStorage.setItem("tokens", JSON.stringify(stored))

        return api_get(instance, 'api/v1/accounts/verify_credentials')
      })

      .then((account: AccountData) => {
        let stored = JSON.parse(localStorage.getItem("accounts") || "{}")
        stored[instance] = account
        localStorage.setItem("accounts", JSON.stringify(stored))
      })
  }
}

export function loginToInstance(instance: string) {
  let redirect_uri = `${location.origin}${location.pathname}?instance=${instance}`

  api_post(instance, 'api/v1/apps', {
    client_name: 'metastodon',
    redirect_uris: redirect_uri,
  })
    .then((creds: AppCredentials) => {
      let stored = JSON.parse(localStorage.getItem("app_credentials") || "{}")
      stored[instance] = creds
      localStorage.setItem("app_credentials", JSON.stringify(stored))

      location.href = `https://${instance}/oauth/authorize?response_type=code&client_id=${creds.client_id}&redirect_uri=${redirect_uri}`
    })
}
