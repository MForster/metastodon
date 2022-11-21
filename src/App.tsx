import { Box, Stack, Typography } from '@mui/material'
import Instance from './Instance'
import LoginButton from './LoginButton'
import Timeline from './Timeline'

export default function App() {
  return <>
    <LoginButton />
    <Stack direction="row" mx={4} spacing={4}>
      {Instance.instances().map(instance => <Box key={instance.getName()}>
        <Typography mb={2}>{instance.getAccountName()}</Typography>
        <Timeline instance={instance}></Timeline>
      </Box>)}
    </Stack>
  </>
}
