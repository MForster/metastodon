import Instance from './instance'

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
  let instance_name = params.get('instance') as string
  let code = params.get('code') as string

  if (instance_name && code) {
    let instance = new Instance(instance_name)
    window.history.pushState({}, '', '/')

    let creds = instance.load("app_credentials") as AppCredentials

    instance.post('oauth/token', {
      grant_type: 'authorization_code',
      client_id: creds.client_id,
      client_secret: creds.client_secret,
      redirect_uri: instance.get_redirect_uri(),
      code
    })
      .then((creds: AccessToken) => {
        instance.save("tokens", creds)
        return instance.get('api/v1/accounts/verify_credentials')
      })
      .then((account: AccountData) => {
        instance.save("accounts", account)
      })
  }
}

export function loginToInstance(instance_name: string) {
  let instance = new Instance(instance_name)

  let redirect_uri = instance.get_redirect_uri()

  instance.post('api/v1/apps', {
    client_name: 'metastodon',
    redirect_uris: redirect_uri,
  })
    .then((creds: AppCredentials) => {
      instance.save("app_credentials", creds)
      location.href = `https://${instance.name}/oauth/authorize?response_type=code&client_id=${creds.client_id}&redirect_uri=${redirect_uri}`
    })
}
