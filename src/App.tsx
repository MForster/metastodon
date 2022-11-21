import { Box, Stack, Typography } from '@mui/material'
import Instance from './Instance'
import LoginButton from './LoginButton'
import Timeline from './Timeline'

export default function App() {
  return <>
    <LoginButton />
    <Stack direction="row" mx={4} spacing={4}>
      {Instance.instances().map(instance => <Box>
        <Typography mb={2}>{instance.get_account_name()}</Typography>
        <Timeline instance={instance}></Timeline>
      </Box>)}
    </Stack>
  </>
}
