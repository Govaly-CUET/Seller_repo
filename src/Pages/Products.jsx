import { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const response = await axiosInstance.get('/seller/products');
                setProducts(response.data?.data || []);
            } catch (requestError) {
                setError(requestError.response?.data?.message || 'Unable to load products.');
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, []);

    return (
        <section className="products-page">
            <div className="products-page-header">
                <div>
                    <h1>Products</h1>
                    <p>{products.length} product{products.length === 1 ? '' : 's'}</p>
                </div>
            </div>

            {error && <p className="products-message error">{error}</p>}
            {loading && <p className="products-message">Loading products...</p>}

            {!loading && !error && (
                <div className="products-table-wrap">
                    <table className="products-table">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>Status</th>
                                <th>Sold</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.length === 0 ? (
                                <tr><td colSpan="7" className="products-empty">No products found.</td></tr>
                            ) : products.map((product) => (
                                <tr key={product._id}>
                                    <td><img className="product-thumb" src={product.image} alt="" /></td>
                                    <td>{product.name}</td>
                                    <td>{product.category?.name || 'Unknown'}</td>
                                    <td>৳ {product.sale_price}</td>
                                    <td>{product.stock}</td>
                                    <td><span className={`product-status ${product.status}`}>{product.status.replace('_', ' ')}</span></td>
                                    <td>{product.sold_items || 0}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
};

export default Products;