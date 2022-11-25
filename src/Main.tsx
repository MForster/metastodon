import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { Database, DBContext } from './Database'
import './Main.css'

import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

function DBProvider({ children }: { children: React.ReactNode }) {
  return <DBContext.Provider value={new Database()}>{children}</DBContext.Provider>
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <DBProvider>
      <App />
    </DBProvider>
  </React.StrictMode>
)
