import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// FIX 3: Suppress non-critical console warnings in development
// This filters out harmless warnings like iframe sandbox and localStorage access warnings
if (process.env.NODE_ENV === 'development') {
  const originalWarn = console.warn;
  console.warn = function (...args: unknown[]) {
    // Allow important warnings through, suppress harmless ones
    const message = String(args[0]);
    if (
      message.includes('SecurityError') ||
      message.includes('localStorage') ||
      message.includes('iframe') ||
      message.includes('sandbox')
    ) {
      return; // Suppress these warnings
    }
    // Pass through other warnings
    originalWarn.apply(console, args as Parameters<typeof originalWarn>);
  };
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
