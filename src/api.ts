export async function api_post(instance: string, endpoint: string, body: any): Promise<any> {
  return fetch(`https://${instance}/${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  }).then(res => res.json())
}

export async function api_get(instance: string, endpoint: string): Promise<any> {
  let stored = JSON.parse(localStorage.getItem("tokens") || "{}")
  let creds = stored[instance]

  return fetch(`https://${instance}/${endpoint}`, {
    headers: creds && { "Authorization": `Bearer ${creds.access_token}` }
  }).then(res => res.json())
}
