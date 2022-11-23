import { Box, Button, Stack, Typography } from '@mui/material'
import useEventListener from '@use-it/event-listener'
import { useEffect, useState } from 'react'
import { Database, DBContext } from './Database'
import Instance from './Instance'
import LoginButton from './LoginButton'
import Timeline from './Timeline'

export default function App() {
  let [instances, setInstances] = useState(Instance.instances())
  let db = new Database()

  useEventListener('accounts-changed', () => setInstances(Instance.instances()))
  useEffect(() => instances.forEach(handleRefresh), [instances])

  const handleRefresh = (instance: Instance) => {
    instance.get('api/v1/timelines/home').then(db.putStatuses.bind(db))
  }

  return <DBContext.Provider value={db}>
    <Stack direction="row" mx={4} spacing={4}>
      <LoginButton />
      {instances.map(instance => <Box key={instance.getName()}>
        <Typography display="inline" mb={2}>{instance.getAccountName()}</Typography>
        <Button onClick={() => handleRefresh(instance)}>Refresh</Button>
        <Button onClick={() => instance.logout()}>Logout</Button>
      </Box>)}
    </Stack>
    <Timeline />
  </DBContext.Provider>

}
