export default class StoredProperty<T> {
  constructor(private key: string, private name: string) { }

  get(): T | undefined {
    return JSON.parse(localStorage.getItem(this.name) || "{}")[this.key]
  }

  set(value: T) {
    let stored = JSON.parse(localStorage.getItem(this.name) || "{}")
    stored[this.key] = value
    localStorage.setItem(this.name, JSON.stringify(stored))
  }
}
