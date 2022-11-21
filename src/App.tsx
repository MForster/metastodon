import { Box, Button, Stack, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import Instance from './Instance'
import LoginButton from './LoginButton'
import Timeline from './Timeline'

export default function App() {
  let [instances, setInstances] = useState(Instance.instances())

  useEffect(() => {
    addEventListener('accounts-changed', () => { setInstances(Instance.instances()) })
  })

  return <>
    <LoginButton />
    <Stack direction="row" mx={4} spacing={4}>
      {instances.map(instance => <Box key={instance.getName()}>
        <Typography display="inline" mb={2}>{instance.getAccountName()}</Typography>
        <Button onClick={() => instance.logout()}>Logout</Button>
        <Timeline instance={instance}></Timeline>
      </Box>)}
    </Stack>
  </>
}
