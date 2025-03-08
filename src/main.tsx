import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import axios from 'axios'
import App from './App'

//axios.defaults.withCredentials = true
axios.defaults.baseURL = import.meta.env.VITE_API_URL

// Automatically check authentication on page load

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
