import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

console.log('main.tsx starting...')

try {
  const rootElement = document.getElementById('root')
  console.log('Root element:', rootElement)
  
  if (!rootElement) {
    throw new Error('Root element not found')
  }
  
  const root = createRoot(rootElement)
  console.log('Created root, rendering App...')
  
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  )
  
  console.log('App rendered successfully')
} catch (error) {
  console.error('Failed to render:', error)
  const rootElement = document.getElementById('root')
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="color: #ff6b6b; padding: 20px; font-family: sans-serif;">
        <h1>Failed to load app</h1>
        <pre style="background: #1a1a1a; padding: 10px; border-radius: 4px; overflow: auto;">${error}</pre>
      </div>
    `
  }
}
