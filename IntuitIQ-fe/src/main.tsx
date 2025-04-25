import { ClerkProvider } from '@clerk/clerk-react';
import '@mantine/tiptap/styles.css';
import '@mantine/carousel/styles.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const CLERK_API_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!CLERK_API_KEY) throw new Error("Missing Publishable Key")

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={CLERK_API_KEY} afterSignOutUrl="/">
      <App />
    </ClerkProvider>
  </React.StrictMode>
);