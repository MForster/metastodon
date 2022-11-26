import Instance from './Instance'
import StoredProperty from './StoredProperty'

export default class Account {
  private accessToken: StoredProperty<AccessToken>
  private accountData: StoredProperty<AccountData>

  constructor(url: string) {
    this.accessToken = new StoredProperty(url, "tokens")
    this.accountData = new StoredProperty(url, "accounts")
  }

  private getUrl(): URL {
    return new URL(this.accountData.get()!.url)
  }

  getName(): string {
    return `${this.accountData.get()!.username}@${this.getUrl().host}`
  }

  async get(endpoint: string): Promise<any> {
    return Account.sendGetRequest(this.getUrl().origin, endpoint, this.accessToken.get()!)
  }

  private static async sendGetRequest(origin: string, endpoint: string, creds: AccessToken): Promise<any> {
    let res = await fetch(`${origin}/${endpoint}`, {
      headers: { "Authorization": `Bearer ${creds.access_token}` }
    })
    return res.json()
  }

  static async login(instance: Instance, accessToken: AccessToken) {
    const accountData = await Account.sendGetRequest(`https://${instance.getName()}`, 'api/v1/accounts/verify_credentials', accessToken)

    const account = new Account(accountData.url)
    account.accountData.set(accountData)
    account.accessToken.set(accessToken)

    dispatchEvent(new Event('accounts-changed'))
  }

  logout() {
    this.accessToken.remove()
    this.accountData.remove()

    dispatchEvent(new Event('accounts-changed'))
  }

  static accounts(): Account[] {
    let accounts = JSON.parse(localStorage.getItem("accounts") || "{}")
    return Object.keys(accounts).map(url => new Account(url))
  }
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
  url: string,
}
