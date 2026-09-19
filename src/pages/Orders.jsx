import { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';

const formatDate = (value) => {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? '-' : date.toLocaleDateString();
};

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const loadOrders = async () => {
        try {
            setError('');
            const response = await axiosInstance.get('/api/v1/seller/orders');
            setOrders(response.data?.data || []);
        } catch (requestError) {
            setError(requestError.response?.data?.message || 'Unable to load orders.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrders();
    }, []);

    return (
        <section className="orders-page">
            <div className="orders-page-header">
                <div>
                    <h1>Orders</h1>
                    <p>{orders.length} order{orders.length === 1 ? '' : 's'}</p>
                </div>
            </div>

            {error && <p className="orders-message error">{error}</p>}
            {loading && <p className="orders-message">Loading orders...</p>}

            {!loading && !error && (
                <div className="orders-table-wrap">
                    <table className="orders-table">
                        <thead>
                            <tr>
                                <th>Order</th>
                                <th>Date</th>
                                <th>Customer</th>
                                <th>Products</th>
                                <th>Amount</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.length === 0 ? (
                                <tr><td colSpan="6" className="orders-empty">No orders found.</td></tr>
                            ) : orders.map((order) => (
                                <tr key={order._id}>
                                    <td>{order.orderCode}</td>
                                    <td>{formatDate(order.createdAt)}</td>
                                    <td>{order.customer?.name || order.shippingAddress?.name || '-'}</td>
                                    <td>{order.items?.map((item) => `${item.productName} x ${item.quantity}`).join(', ') || '-'}</td>
                                    <td>৳ {Number(order.amount || 0).toLocaleString()}</td>
                                    <td>
                                        <span className={`order-status ${order.financialStatus}`}>
                                            {order.financialStatus?.replace('_', ' ') || '-'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
};

export default Orders;
