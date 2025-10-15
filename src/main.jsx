import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from './context/CartContext.jsx'; 
import { AuthProvider } from './context/AuthContext.jsx'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* BƯỚC 1: PHẢI BỌC BẰNG BROWSER ROUTER để hook useNavigate() hoạt động */}
    <BrowserRouter> 
        {/* BƯỚC 2: ĐẶT AUTHPROVIDER BÊN TRONG ROUTER */}
        <AuthProvider> 
            {/* BƯỚC 3: ĐẶT CÁC CONTEXT KHÁC (Vd: CartProvider) */}
            <CartProvider>
                <App />
            </CartProvider>
        </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
