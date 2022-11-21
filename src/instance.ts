export default class Instance {
  constructor(
    public name: string,
  ) { }

  load(property: string): any {
    return JSON.parse(localStorage.getItem(property) || "{}")[this.name]
  }

  save(property: string, value: any) {
    let stored = JSON.parse(localStorage.getItem(property) || "{}")
    stored[this.name] = value
    localStorage.setItem(property, JSON.stringify(stored))
  }

  get_redirect_uri(): string {
    return `${location.origin}${location.pathname}?instance=${this.name}`
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
}
