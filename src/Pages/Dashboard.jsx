import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await axiosInstance.get('/api/v1/seller/dashboard/stats');
            setStats(res.data.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load dashboard stats.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="add-product-container">Loading dashboard...</div>;
    }

    if (error) {
        return (
            <div className="add-product-container">
                <div className="form-message error">{error}</div>
            </div>
        );
    }

    const cards = [
        { label: 'Monthly Sales', value: `৳${stats.monthlySales.toLocaleString()}` },
        { label: 'Pending Orders', value: stats.pendingOrders },
        { label: 'Completed Shipments', value: stats.completedShipments },
        { label: 'Total Earnings', value: `৳${stats.totalEarnings.toLocaleString()}` },
    ];

    return (
        <div className="dashboard-container">
            <h1 className="add-product-title">Dashboard</h1>
            <div className="stats-grid">
                {cards.map((card) => (
                    <div className="stat-card" key={card.label}>
                        <p className="stat-label">{card.label}</p>
                        <p className="stat-value">{card.value}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;