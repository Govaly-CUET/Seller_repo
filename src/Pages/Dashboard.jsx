import { useState, useEffect } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
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
        console.log('Backend Data:', res.data.data); // Check property names here
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

    const renderChart = (title, data, color) => (
        <div className="chart-card">
            <p className="stat-label">{title}</p>
            <ResponsiveContainer width="100%" height={260}>
                <LineChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="label" tick={{ fontSize: 13 }} />
                    <YAxis tick={{ fontSize: 13 }} />
                    <Tooltip formatter={(value) => [`৳${value.toLocaleString()}`, title]} />
                    <Line
                        type="monotone"
                        dataKey="amount"
                        stroke={color}
                        strokeWidth={2}
                        dot={{ r: 4 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );

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

            <div className="charts-row">
                {renderChart('Sales Trend (Last 6 Months)', stats.salesTrend, '#111827')}
                {renderChart('Earnings Trend (Last 6 Months)', stats.earningsTrend, '#2563eb')}
            </div>
        </div>
    );
};

export default Dashboard;