import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import axios from 'axios'
import App from './App'

//axios.defaults.withCredentials = true
axios.defaults.baseURL = import.meta.env.VITE_API_URL

// Automatically check authentication on page load
const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)
