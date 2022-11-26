import { Box, Button, Stack, Typography } from '@mui/material'
import useEventListener from '@use-it/event-listener'
import { useContext, useEffect, useState } from 'react'
import Account from './Account'
import { DBContext } from './Database'
import LoginButton from './LoginButton'
import Timeline from './Timeline'

export default function App() {
  let [accounts, setAccounts] = useState(Account.accounts())

  useEventListener('accounts-changed', () => setAccounts(Account.accounts()))
  useEffect(() => accounts.forEach(handleRefresh), [accounts])

  const db = useContext(DBContext)
  const handleRefresh = (account: Account) => {
    account.get('api/v1/timelines/home').then(db.putStatuses.bind(db))
  }

  return <>
    <Stack direction="row" mx={4} spacing={4}>
      <LoginButton />
      {accounts.map(account => <Box key={account.getName()}>
        <Typography display="inline" mb={2}>{account.getName()}</Typography>
        <Button onClick={() => handleRefresh(account)}>Refresh</Button>
        <Button onClick={() => account.logout()}>Logout</Button>
      </Box>)}
    </Stack>
    <Timeline />
  </>
}
