export default class Instance {
  constructor(private name: string) { }

  get_account_name(): string {
    return `${this.load("accounts").username}@${this.name}`
  }

  async get(endpoint: string): Promise<any> {
    let creds = this.load("tokens")

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
    let tokens = JSON.parse(localStorage.getItem("tokens") || "{}")
    return Object.keys(tokens).map(name => new Instance(name))
  }

  login() {
    let redirect_uri = this.get_redirect_uri()

    this.post('api/v1/apps', {
      client_name: 'metastodon',
      redirect_uris: redirect_uri,
    })
      .then((creds: AppCredentials) => {
        this.save("app_credentials", creds)
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

  private load(property: string): any {
    return JSON.parse(localStorage.getItem(property) || "{}")[this.name]
  }

  private save(property: string, value: any) {
    let stored = JSON.parse(localStorage.getItem(property) || "{}")
    stored[this.name] = value
    localStorage.setItem(property, JSON.stringify(stored))
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
