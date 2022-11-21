export default class StoredProperty<T> {
  constructor(private key: string, private name: string) { }

  get(): T | undefined {
    return this.getAll()[this.key]
  }

  set(value: T) {
    let stored = this.getAll()
    stored[this.key] = value
    this.setAll(stored)
  }

  remove() {
    let stored = this.getAll()
    delete stored[this.key]
    this.setAll(stored)
  }

  private getAll() {
    return JSON.parse(localStorage.getItem(this.name) || "{}")
  }

  private setAll(stored: any) {
    localStorage.setItem(this.name, JSON.stringify(stored))
  }
}
