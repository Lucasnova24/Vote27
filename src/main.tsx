import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { initNative } from './lib/nativeInit'
import './index.css'
import { registerServiceWorker } from './lib/push'

registerServiceWorker()

initNative()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
