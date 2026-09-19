import { useCallback, useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';

const statuses = [
    { value: '', label: 'All orders' },
    { value: 'pending', label: 'Pending' },
    { value: 'in_progress', label: 'In progress' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'canceled', label: 'Canceled' },
];

// Seller-controlled stage. Handed Over is the last one and cannot be undone.
const sellerStages = [
    { value: 'waiting', label: 'Waiting' },
    { value: 'accepted', label: 'Accepted' },
    { value: 'packed', label: 'Packed' },
    { value: 'handed_over', label: 'Handed Over' },
];
const sellerStageOrder = sellerStages.map(({ value }) => value);
const sellerStageLabels = Object.fromEntries(sellerStages.map(({ value, label }) => [value, label]));

const shipmentLabels = {
    pending: 'Pending',
    processing: 'Processing',
    picked_from_seller: 'Picked from Seller',
    in_transit: 'In Transit',
    at_delivery_hub: 'At Delivery Hub',
    delivered: 'Delivered',
    hold: 'Hold',
    cancelled: 'Cancelled',
};
const courierLabels = { pathao: 'Pathao' };

// Same wording and colours as the admin's Seller Payment column.
const paymentLabels = { pending: 'Pending', paid: 'Paid', cancelled: 'Cancelled' };
const paymentTone = { pending: 'bad', paid: 'ok', cancelled: 'dark' };

const pillTone = (status) => {
    if (['pending', 'waiting', 'hold'].includes(status)) return 'warn';
    if (['handed_over', 'picked_from_seller', 'delivered'].includes(status)) return 'ok';
    if (status === 'cancelled') return 'bad';
    return 'info';
};

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
    const [stageBusyId, setStageBusyId] = useState('');
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
            setOrders(response.data?.data || []);
        } catch (requestError) {
            setError(requestError.response?.data?.message || 'Unable to load orders.');
        } finally {
            setLoading(false);
        }
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

    // The seller's own stage is the only shipment field they can change.
    const updateSellerStage = async (orderId, stage) => {
        setStageBusyId(orderId);
        setError('');

        try {
            const response = await axiosInstance.patch(`/api/v1/seller/orders/${orderId}/shipment`, {
                sellerStatus: stage,
            });
            setOrders((current) => current.map((order) => (
                order._id === orderId ? response.data.data : order
            )));
        } catch (requestError) {
            setError(requestError.response?.data?.message || 'Unable to update the shipment stage.');
        } finally {
            setStageBusyId('');
        }
    };

    const stageLocked = (order) => (
        ['delivered', 'canceled'].includes(order.financialStatus)
        || order.shipment?.status === 'cancelled'
        || order.shipment?.status === 'pending'
        || order.shipment?.sellerStatus === 'handed_over'
    );

    return (
        <section className="orders-page">
            <div className="orders-page-header">
                <div>
                    <h1>Orders</h1>
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
            </div>

            {error && <p className="orders-message error">{error}</p>}
            {loading && <p className="orders-message">Loading orders...</p>}

            {!loading && !error && orders.length === 0 && (
                <p className="orders-message">No orders found.</p>
            )}

            {!loading && orders.length > 0 && (
                <div className="orders-table-wrap">
                    <table className="orders-table">
                        <thead>
                            <tr>
                                <th>Order</th>
                                <th>Placed</th>
                                <th>Customer</th>
                                <th>Delivery address</th>
                                <th>Items</th>
                                <th>Total</th>
                                <th>Delivery</th>
                                <th>Seller shipment</th>
                                <th>Shipment</th>
                                <th>Seller payment</th>
                            </tr>
                        </thead>
                        <tbody>
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
                                    <td className="orders-stack">
                                        {order.shipment?.courier ? (
                                            <>
                                                <div>Agent: {courierLabels[order.shipment.courier] || order.shipment.courier}</div>
                                                <div>Cons: {order.shipment.consignmentId || '—'}</div>
                                                {order.shipment.updatedAt && <small>{formatDate(order.shipment.updatedAt)}</small>}
                                            </>
                                        ) : (
                                            <span className="orders-muted">Not assigned yet</span>
                                        )}
                                    </td>
                                    <td>
                                        {order.shipment && !stageLocked(order) ? (
                                            <select
                                                className="orders-stage-select"
                                                value={order.shipment.sellerStatus}
                                                disabled={stageBusyId === order._id}
                                                onChange={(event) => updateSellerStage(order._id, event.target.value)}
                                            >
                                                {sellerStages.map(({ value, label }) => {
                                                    const current = sellerStageOrder.indexOf(order.shipment.sellerStatus);
                                                    const behind = sellerStageOrder.indexOf(value) < current;
                                                    return (
                                                        <option key={value} value={value} disabled={behind || (value === 'waiting' && current > 0) || (value === 'handed_over' && !order.shipment.consignmentId)}>
                                                            {label}
                                                        </option>
                                                    );
                                                })}
                                            </select>
                                        ) : (
                                            <>
                                                <span className={`orders-pill ${pillTone(order.shipment?.sellerStatus)}`}>
                                                    {sellerStageLabels[order.shipment?.sellerStatus] || '—'}
                                                </span>
                                                {order.shipment?.status === 'pending' && <small>Waiting for admin to start</small>}
                                            </>
                                        )}
                                    </td>
                                    <td>
                                        <span className={`orders-pill ${pillTone(order.shipment?.status)}`}>
                                            {shipmentLabels[order.shipment?.status] || '—'}
                                        </span>
                                    </td>
                                    <td>
                                        {order.financialStatus !== 'delivered' ? (
                                            <span className="orders-muted">Not delivered yet</span>
                                        ) : (
                                            <>
                                                <span className={`orders-pill ${paymentTone[order.sellerPayment]}`}>
                                                    {paymentLabels[order.sellerPayment] || '—'}
                                                </span>
                                                {order.sellerPaymentAt && <small>{formatDate(order.sellerPaymentAt)}</small>}
                                            </>
                                        )}
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