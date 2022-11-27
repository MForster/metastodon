import MenuIcon from '@mui/icons-material/Menu'
import { AppBar, IconButton, Toolbar, Typography } from '@mui/material'
import LoginButton from './LoginButton'

export default function MetastodonAppBar() {
  return <AppBar position='static' >
    <Toolbar>
      <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
        <MenuIcon />
      </IconButton>
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        Metastodon
      </Typography>
      <LoginButton />
    </Toolbar>
  </AppBar>
}
