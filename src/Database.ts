import { DBSchema, IDBPDatabase, openDB } from 'idb/with-async-ittr'
import { createContext } from 'react'
import Status from './Status'

interface MetastodonSchema extends DBSchema {
  statuses: {
    key: string
    value: Status
    indexes: { 'created_at': string }
  }
}

export type MetastodonDB = IDBPDatabase<MetastodonSchema>
export const Database = createContext<MetastodonDB>(undefined!)

export function openMetastodonDB(): Promise<MetastodonDB> {
  return openDB<MetastodonSchema>('metastodon', 1, {
    upgrade(db) {
      let statuses = db.createObjectStore('statuses', { keyPath: 'uri' })
      statuses.createIndex('created_at', "created_at", { unique: false })
    },
  })
}
