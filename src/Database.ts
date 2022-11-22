import { DBSchema, IDBPDatabase, openDB } from 'idb'
import { createContext } from 'react'
import Status from './Status'

interface MetastodonSchema extends DBSchema {
  statuses: {
    key: string
    value: Status
  }
}

export type MetastodonDB = IDBPDatabase<MetastodonSchema>
export const Database = createContext<MetastodonDB>(undefined!)

export function openMetastodonDB(): Promise<MetastodonDB> {
  return openDB<MetastodonSchema>('metastodon', 1, {
    upgrade(db) {
      db.createObjectStore('statuses', { keyPath: 'uri' })
    },
  })
}
