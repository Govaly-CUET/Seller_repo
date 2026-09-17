import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import AddProduct from './Pages/AddProduct';
import Products from './Pages/Products';
import SellerLogin from './Pages/SellerLogin';
import SellerRegister from './Pages/SellerRegister';
import Profile from './Pages/Profile';
import Dashboard from './Pages/Dashboard';
import Earnings from './Pages/Earnings';
import './App.css';
import './Pages/Products.css';
import './Pages/AddProduct.css';

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
                    <Route path="/orders" element={<h2>Orders — Coming soon</h2>} />
                   <Route path="/earnings" element={<Earnings />} />
                    <Route path="/reviews" element={<h2>Reviews & Ratings — Coming soon</h2>} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/addproduct" element={<AddProduct />} />
                </Routes></Layout>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;