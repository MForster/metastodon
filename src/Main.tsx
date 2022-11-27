import { CssBaseline } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { Database, DBContext } from './Database'

import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

function DBProvider({ children }: { children: React.ReactNode }) {
  return <DBContext.Provider value={new Database()}>{children}</DBContext.Provider>
}

const theme = createTheme({
  palette: {
    background: {
      default: "#eee"
    }
  }
})

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <DBProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </DBProvider>
  </React.StrictMode>
)
