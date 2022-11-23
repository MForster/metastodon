import { DBSchema, IDBPDatabase, openDB } from 'idb/with-async-ittr'
import { createContext } from 'react'
import Status from './Status'

interface Schema extends DBSchema {
  statuses: {
    key: string
    value: Status
    indexes: { 'created_at': string }
  }
}

export class Database {
  private db: Promise<IDBPDatabase<Schema>>

  constructor() {
    this.db = openDB('metastodon', 1, {
      upgrade(db) {
        let statuses = db.createObjectStore('statuses', { keyPath: 'uri' })
        statuses.createIndex('created_at', "created_at", { unique: false })
      },
    })
  }

  async getStatuses(): Promise<Status[]> {
    const tx = (await this.db).transaction('statuses')
    let statuses = []
    for await (const cursor of tx.store.index('created_at').iterate(null, 'prev')) {
      statuses.push(cursor.value)
    }
    return statuses
  }

  async putStatuses(statuses: Status[]): Promise<void> {
    const tx = (await this.db).transaction('statuses', 'readwrite')
    await Promise.all(statuses.map(s => tx.store.put(s)))
  }
}

export const DBContext = createContext<Database>(undefined!)
