import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import AddProduct from './pages/AddProduct';
import Products from './pages/Products';
import SellerLogin from './pages/SellerLogin';
import SellerRegister from './pages/SellerRegister';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import Earnings from './pages/Earnings';
import Reviews from './pages/Reviews';
import Orders from './pages/Orders';
import './App.css';
import './pages/Products.css';
import './pages/AddProduct.css';
import './pages/Orders.css';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<SellerLogin />} />
                <Route path="/register" element={<SellerRegister />} />
                <Route path="*" element={<Layout><Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/products/add" element={<AddProduct />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/earnings" element={<Earnings />} />
                    <Route path="/reviews" element={<Reviews />} />
                </Routes></Layout>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;