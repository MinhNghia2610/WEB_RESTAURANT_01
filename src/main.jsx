import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';

// 1. IMPORT CẢ HAI PROVIDER
import { AuthProvider } from './context/AuthContext.jsx'; 
import { CartProvider } from './context/CartContext.jsx'; // <-- PHẢI IMPORT

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter> 
      <AuthProvider> 
        
        {/* 2. BỌC CARTPROVIDER BÊN TRONG AUTHPROVIDER */}
        <CartProvider>
          <App />
        </CartProvider>
        
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);