import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { Suspense } from 'react'
import { ErrorBoundary } from './shared/ui/ErrorBoundary.jsx'
import './i18n.js'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <HelmetProvider>
        <Suspense fallback={<div className="loading-container">Cargando...</div>}>
          <App />
        </Suspense>
      </HelmetProvider>
    </ErrorBoundary>
  </StrictMode>,
)
