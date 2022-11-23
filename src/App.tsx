import { Box, Button, CircularProgress, Stack, Typography } from '@mui/material'
import useEventListener from '@use-it/event-listener'
import { useEffect, useState } from 'react'
import { Database, MetastodonDB, openMetastodonDB } from './Database'
import Instance from './Instance'
import LoginButton from './LoginButton'
import Status from './Status'
import Timeline from './Timeline'

export default function App() {
  let [instances, setInstances] = useState(Instance.instances())

  useEventListener('accounts-changed', () => setInstances(Instance.instances()))

  let [db, setDb] = useState<MetastodonDB | undefined>(undefined)

  useEffect(() => {
    openMetastodonDB().then(setDb)
  }, [])

  useEffect(() => {
    if (db) {
      for (const instance of instances) {
        instance.get('api/v1/timelines/home').then((statuses: Status[]) => {
          for (const status of statuses) {
            db?.put('statuses', status)
          }
        })
      }
    }
  }, [db, instances])

  const handleRefresh = (instance: Instance) => {
    instance.get('api/v1/timelines/home').then((statuses: Status[]) => {
      for (const status of statuses) {
        db!.put('statuses', status)
      }
    })
  }

  return db ? <>
    <Database.Provider value={db}>
      <Stack direction="row" mx={4} spacing={4}>
        <LoginButton />
        {instances.map(instance => <Box key={instance.getName()}>
          <Typography display="inline" mb={2}>{instance.getAccountName()}</Typography>
          <Button onClick={() => handleRefresh(instance)}>Refresh</Button>
          <Button onClick={() => instance.logout()}>Logout</Button>
        </Box>)}
      </Stack>
      <Timeline />
    </Database.Provider>
  </> : <CircularProgress />
}
