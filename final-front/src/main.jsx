import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Amplify } from 'aws-amplify'
import amplifyconfig from './amplifyconfiguration.json'

// Configuración simple de Amplify
Amplify.configure(amplifyconfig);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)