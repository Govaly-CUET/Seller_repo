import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import AddProduct from './pages/AddProduct';
import Products from './pages/Products';
import SellerLogin from './pages/SellerLogin';
import SellerRegister from './pages/SellerRegister';
import './App.css';
import './pages/Products.css';
import './pages/AddProduct.css';

const Placeholder = ({ title }) => <h2>{title} — Coming soon</h2>;

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<SellerLogin />} />
                <Route path="/register" element={<SellerRegister />} />
                <Route path="*" element={<Layout><Routes>
                    <Route path="/dashboard" element={<Placeholder title="Dashboard" />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/products/add" element={<AddProduct />} />
                    <Route path="/orders" element={<Placeholder title="Orders" />} />
                    <Route path="/earnings" element={<Placeholder title="Earnings & Commission" />} />
                    <Route path="/reviews" element={<Placeholder title="Reviews & Ratings" />} />
                    <Route path="/profile" element={<Placeholder title="Profile" />} />
                    <Route path="/addproduct" element={<AddProduct />} />
                </Routes></Layout>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
