<<<<<<< HEAD:src/Pages/Orders.jsx
import { useCallback, useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';

const statuses = [
    { value: '', label: 'All orders' },
    { value: 'pending', label: 'Pending' },
    { value: 'in_progress', label: 'In progress' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'canceled', label: 'Canceled' },
];

const statusLabels = Object.fromEntries(statuses.map(({ value, label }) => [value, label]));

const formatDate = (value) => {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? '—' : date.toLocaleString('en-US', {
        day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit',
    });
};

const formatAmount = (value) => `৳${Number(value || 0).toLocaleString('en-BD')}`;

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [status, setStatus] = useState('');
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState('');
    const [error, setError] = useState('');

    const loadOrders = useCallback(async () => {
        setLoading(true);
        setError('');

        try {
            const params = new URLSearchParams();
            if (status) params.set('status', status);
            if (search.trim()) params.set('search', search.trim());
            const query = params.toString() ? `?${params.toString()}` : '';
            const response = await axiosInstance.get(`/api/v1/seller/orders${query}`);
=======
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
>>>>>>> dev:src/pages/Orders.jsx
            setOrders(response.data?.data || []);
        } catch (requestError) {
            setError(requestError.response?.data?.message || 'Unable to load orders.');
        } finally {
            setLoading(false);
        }
<<<<<<< HEAD:src/Pages/Orders.jsx
    }, [search, status]);

    useEffect(() => {
        loadOrders();
    }, [loadOrders]);

    const updateStatus = async (orderId, nextStatus) => {
        setUpdatingId(orderId);
        setError('');

        try {
            const response = await axiosInstance.patch(`/api/v1/seller/orders/${orderId}/status`, {
                status: nextStatus,
            });
            setOrders((current) => current.map((order) => (
                order._id === orderId ? response.data.data : order
            )));
        } catch (requestError) {
            setError(requestError.response?.data?.message || 'Unable to update order status.');
        } finally {
            setUpdatingId('');
        }
    };
=======
    };

    useEffect(() => {
        loadOrders();
    }, []);
>>>>>>> dev:src/pages/Orders.jsx

    return (
        <section className="orders-page">
            <div className="orders-page-header">
                <div>
                    <h1>Orders</h1>
<<<<<<< HEAD:src/Pages/Orders.jsx
                    <p>Review customer details and move each order through fulfillment.</p>
                </div>
                <span className="orders-count">{orders.length} order{orders.length === 1 ? '' : 's'}</span>
            </div>

            <div className="orders-toolbar">
                <select value={status} onChange={(event) => setStatus(event.target.value)}>
                    {statuses.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                </select>
                <input
                    type="search"
                    placeholder="Search order code"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    onKeyDown={(event) => event.key === 'Enter' && loadOrders()}
                />
                <button type="button" onClick={loadOrders}>Refresh</button>
=======
                    <p>{orders.length} order{orders.length === 1 ? '' : 's'}</p>
                </div>
>>>>>>> dev:src/pages/Orders.jsx
            </div>

            {error && <p className="orders-message error">{error}</p>}
            {loading && <p className="orders-message">Loading orders...</p>}

<<<<<<< HEAD:src/Pages/Orders.jsx
            {!loading && !error && orders.length === 0 && (
                <p className="orders-message">No orders found.</p>
            )}

            {!loading && orders.length > 0 && (
=======
            {!loading && !error && (
>>>>>>> dev:src/pages/Orders.jsx
                <div className="orders-table-wrap">
                    <table className="orders-table">
                        <thead>
                            <tr>
                                <th>Order</th>
<<<<<<< HEAD:src/Pages/Orders.jsx
                                <th>Placed</th>
                                <th>Customer</th>
                                <th>Delivery address</th>
                                <th>Items</th>
                                <th>Total</th>
=======
                                <th>Date</th>
                                <th>Customer</th>
                                <th>Products</th>
                                <th>Amount</th>
>>>>>>> dev:src/pages/Orders.jsx
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
<<<<<<< HEAD:src/Pages/Orders.jsx
                            {orders.map((order) => (
                                <tr key={order._id}>
                                    <td className="orders-code">{order.orderCode}</td>
                                    <td>{formatDate(order.createdAt)}</td>
                                    <td>
                                        <strong>{order.customer?.name || order.shippingAddress?.name || '—'}</strong>
                                        <small>{order.shippingAddress?.phone || order.customer?.phone || ''}</small>
                                    </td>
                                    <td className="orders-address">
                                        {order.shippingAddress?.address}, {order.shippingAddress?.area}, {order.shippingAddress?.district}
                                    </td>
                                    <td>
                                        {order.items?.map((item) => (
                                            <div key={item._id}>{item.productName} × {item.quantity}</div>
                                        ))}
                                    </td>
                                    <td className="orders-total">{formatAmount(order.amount)}</td>
                                    <td>
                                        <span className={`orders-status ${order.financialStatus}`}>
                                            {statusLabels[order.financialStatus] || order.financialStatus}
                                        </span>
                                        {/* <select
                                            className="orders-status-select"
                                            value={order.financialStatus}
                                            disabled={updatingId === order._id}
                                            onChange={(event) => updateStatus(order._id, event.target.value)}
                                        >
                                            {statuses.filter((item) => item.value).map((item) => (
                                                <option key={item.value} value={item.value}>{item.label}</option>
                                            ))}
                                        </select> */}
=======
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
>>>>>>> dev:src/pages/Orders.jsx
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

<<<<<<< HEAD:src/Pages/Orders.jsx
export default Orders;
=======
export default Orders;
>>>>>>> dev:src/pages/Orders.jsx
