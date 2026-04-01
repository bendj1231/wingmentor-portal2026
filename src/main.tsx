import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error("Critical Error: Container element #root not found in the DOM.");
} else {
  // Global error handler for catching unhandled promise rejections and errors
  window.addEventListener('error', (event) => {
    console.error('Captured live error:', event.error);
    // Optional: display overlay if in development or specific debug mode
  });

  if (!import.meta.env.VITE_FIREBASE_API_KEY) {
    console.warn(
      'VITE_FIREBASE_API_KEY is missing. Running in mock Firebase mode — real auth/data calls will be stubbed.',
    );
  }

  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
