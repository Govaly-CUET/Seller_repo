import { NavLink, useNavigate } from 'react-router-dom';

const menuItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Products', path: '/products', end: true },
    { label: 'Add Product', path: '/products/add' },
    { label: 'Orders', path: '/orders' },
    { label: 'Earnings & Commission', path: '/earnings' },
    { label: 'Reviews & Ratings', path: '/reviews' },
    { label: 'Profile', path: '/profile' },
];

const Sidebar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('sellerToken');
        localStorage.removeItem('sellerProfile');
        navigate('/');
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-logo">Shop</div>
            <nav className="sidebar-nav">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.end}
                        className={({ isActive }) =>
                            isActive ? 'sidebar-link active' : 'sidebar-link'
                        }
                    >
                        {item.label}
                    </NavLink>
                ))}
            </nav>
            <div className="sidebar-footer">
                <button className="logout-btn" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;