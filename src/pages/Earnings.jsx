import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

const Earnings = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchEarnings();
    }, []);

    const fetchEarnings = async () => {
        try {
            const res = await axiosInstance.get('/api/v1/seller/earnings');
            setData(res.data.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load earnings.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="dashboard-container">Loading earnings...</div>;
    }

    if (error) {
        return (
            <div className="dashboard-container">
                <div className="form-message error">{error}</div>
            </div>
        );
    }

    const { commissionRate, summary, orders } = data;

    return (
        <div className="dashboard-container earnings-container">
            <h1 className="add-product-title">Earnings & Commission</h1>

            <div className="stats-grid">
                <div className="stat-card">
                    <p className="stat-label">Total Gross Sales</p>
                    <p className="stat-value">৳{summary.totalGrossSales.toLocaleString()}</p>
                </div>
                <div className="stat-card">
                    <p className="stat-label">Commission Rate</p>
                    <p className="stat-value">{commissionRate}%</p>
                </div>
                <div className="stat-card">
                    <p className="stat-label">Total Net Payable</p>
                    <p className="stat-value">৳{summary.totalNetPayable.toLocaleString()}</p>
                </div>
            </div>

            <div className="earnings-table-wrap">
                <table className="earnings-table">
                    <thead>
                        <tr>
                            <th>Order</th>
                            <th>Date</th>
                            <th>Gross Sale</th>
                            <th>Commission</th>
                            <th>Net Payable</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="earnings-empty">No completed orders yet.</td>
                            </tr>
                        ) : (
                            orders.map((order) => (
                                <tr key={order.orderCode}>
                                    <td>{order.orderCode}</td>
                                    <td>{new Date(order.date).toLocaleDateString()}</td>
                                    <td>৳{order.grossSale.toLocaleString()}</td>
                                    <td>৳{order.commissionAmount.toLocaleString()}</td>
                                    <td>৳{order.netPayable.toLocaleString()}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Earnings;