import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import AddProduct from './pages/AddProduct';
import './App.css';

const Placeholder = ({ title }) => <h2>{title} — Coming soon</h2>;

function App() {
    return (
        <BrowserRouter>
            <Layout>
                <Routes>
                    <Route path="/dashboard" element={<Placeholder title="Dashboard" />} />
                    <Route path="/products" element={<Placeholder title="Products" />} />
                    <Route path="/products/add" element={<AddProduct />} />
                    <Route path="/orders" element={<Placeholder title="Orders" />} />
                    <Route path="/earnings" element={<Placeholder title="Earnings & Commission" />} />
                    <Route path="/reviews" element={<Placeholder title="Reviews & Ratings" />} />
                    <Route path="/profile" element={<Placeholder title="Profile" />} />
                    <Route path="*" element={<AddProduct />} />
                </Routes>
            </Layout>
        </BrowserRouter>
    );
}

export default App;