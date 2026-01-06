import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { AuthProvider } from './context/authContext.jsx'
import { HistoryProvider } from './context/historyContext.jsx'
// import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter> {/* Router sabse upar taaki AuthProvider navigate use kar sake */}
      <AuthProvider>
        <HistoryProvider>
          <App />
        </HistoryProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)