import Account from './Account'
import StoredProperty from './StoredProperty'

export default class Instance {
  private app_credentials: StoredProperty<AppCredentials>

  constructor(private name: string) {
    this.app_credentials = new StoredProperty(name, "app_credentials")
  }

  getName(): string {
    return this.name
  }

  private async post(endpoint: string, body: any): Promise<any> {
    let res = await fetch(`https://${this.name}/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })

    return res.json()
  }

  async beginLogin() {
    let redirect_uri = this.get_redirect_uri()

    let creds = await this.post('api/v1/apps', {
      client_name: 'metastodon',
      redirect_uris: redirect_uri,
    }) as AppCredentials

    this.app_credentials.set(creds)
    location.href = `https://${this.name}/oauth/authorize?response_type=code&client_id=${creds.client_id}&redirect_uri=${redirect_uri}`
  }

  static async maybeFinishLogin() {
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
      const token = await instance.post('oauth/token', {
        grant_type: 'authorization_code',
        client_id: creds.client_id,
        client_secret: creds.client_secret,
        redirect_uri: instance.get_redirect_uri(),
        code
      })

      Account.login(instance, token)
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
