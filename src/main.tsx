import React from 'react'
import { createRoot } from 'react-dom/client'
import { NextUIProvider } from "@nextui-org/system"
import App from './App'
import './index.css'

// Make sure the root element exists
const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Root element not found')
}

createRoot(rootElement).render(
  <React.StrictMode>
    <NextUIProvider>
    <App />
    </NextUIProvider>
  </React.StrictMode>,
)
