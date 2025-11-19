import { createRoot } from 'react-dom/client'
import { SignupProvider } from './contexts/SignupContext';
import { AuthProvider } from './contexts/AuthContext';
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <SignupProvider>
      <App />
    </SignupProvider>
  </AuthProvider>
);