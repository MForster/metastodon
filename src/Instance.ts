import StoredProperty from './StoredProperty'

export default class Instance {
  private app_credentials: StoredProperty<AppCredentials>
  private token: StoredProperty<AccessToken>
  private account: StoredProperty<AccountData>

  constructor(private name: string) {
    this.app_credentials = new StoredProperty(name, "app_credentials")
    this.token = new StoredProperty(name, "tokens")
    this.account = new StoredProperty(name, "accounts")
  }

  getName(): string { return this.name }

  getAccountName(): string {
    const account = this.account.get()
    if (!account) {
      console.log("No account found for instance ", this.name)
      return `<unknown>@${this.name}`
    }

    return `${account.username}@${this.name}`
  }

  async get(endpoint: string): Promise<any> {
    let creds = this.token.get()

    return fetch(`https://${this.name}/${endpoint}`, {
      headers: creds && { "Authorization": `Bearer ${creds.access_token}` }
    }).then(res => res.json())
  }

  async post(endpoint: string, body: any): Promise<any> {
    return fetch(`https://${this.name}/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    }).then(res => res.json())
  }

  static instances(): Instance[] {
    let tokens = JSON.parse(localStorage.getItem("accounts") || "{}")
    return Object.keys(tokens).map(name => new Instance(name))
  }

  beginLogin() {
    let redirect_uri = this.get_redirect_uri()

    this.post('api/v1/apps', {
      client_name: 'metastodon',
      redirect_uris: redirect_uri,
    })
      .then((creds: AppCredentials) => {
        this.app_credentials.set(creds)
        location.href = `https://${this.name}/oauth/authorize?response_type=code&client_id=${creds.client_id}&redirect_uri=${redirect_uri}`
      })
  }

  static maybeFinishLogin() {
    let params = new URLSearchParams(location.search)
    let instance_name = params.get('instance') as string
    let code = params.get('code') as string

    if (instance_name && code) {
      let instance = new Instance(instance_name)
      window.history.pushState({}, '', '/')

      let creds = instance.app_credentials.get()
      if (!creds) {
        console.log("No app credentials found for instance", instance_name)
        return
      }

      instance.post('oauth/token', {
        grant_type: 'authorization_code',
        client_id: creds.client_id,
        client_secret: creds.client_secret,
        redirect_uri: instance.get_redirect_uri(),
        code
      })
        .then((creds: AccessToken) => {
          instance.token.set(creds)
          return instance.get('api/v1/accounts/verify_credentials')
        })
        .then((account: AccountData) => {
          instance.account.set(account)
          dispatchEvent(new Event('accounts-changed'))
        })
    }
  }

  private get_redirect_uri(): string {
    return `${location.origin}${location.pathname}?instance=${this.name}`
  }
}

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
