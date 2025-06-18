import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRouter from './Router';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// Optional: Bootstrap JS for components like modals, dropdowns
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { AuthProvider } from './utils/context/AuthContext';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <AuthProvider>
            <AppRouter />
        </AuthProvider>
    </React.StrictMode>
);