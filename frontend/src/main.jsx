import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from "react-hot-toast";
import './index.css';
import { BrowserRouter } from "react-router-dom";
import App from './App.jsx';
import { AuthProvider } from './context/authProvider.jsx';


createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <Toaster />
                <App />
            </AuthProvider>
        </BrowserRouter>
    </StrictMode>

)
