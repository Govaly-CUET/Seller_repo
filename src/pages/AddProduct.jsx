import { useState } from 'react';
import axiosInstance from '../api/axiosInstance';

const AddProduct = () => {
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        sale_price: '',
        description: '',
        image: '',
        stock: '',
        status: 'in_stock',
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const res = await axiosInstance.post('/seller/products', {
                ...formData,
                sale_price: Number(formData.sale_price),
                stock: Number(formData.stock),
            });

            setMessage({ type: 'success', text: 'Product added successfully!' });
            setFormData({
                name: '',
                category: '',
                sale_price: '',
                description: '',
                image: '',
                stock: '',
                status: 'in_stock',
            });
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Something went wrong.',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-product-container">
            <h1 className="add-product-title">Add Product</h1>

            {message.text && (
                <div className={`form-message ${message.type}`}>{message.text}</div>
            )}

            <form onSubmit={handleSubmit} className="add-product-form">
                <div className="form-row">
                    <label>Product Name *</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-row">
                    <label>Category ID *</label>
                    <input
                        type="text"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        placeholder="Category ObjectId"
                        required
                    />
                </div>

                <div className="form-row two-col">
                    <div>
                        <label>Price (৳) *</label>
                        <input
                            type="number"
                            name="sale_price"
                            value={formData.sale_price}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Stock Quantity *</label>
                        <input
                            type="number"
                            name="stock"
                            value={formData.stock}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="form-row">
                    <label>Availability Status</label>
                    <select name="status" value={formData.status} onChange={handleChange}>
                        <option value="in_stock">In Stock</option>
                        <option value="out_of_stock">Out of Stock</option>
                    </select>
                </div>

                <div className="form-row">
                    <label>Image URL *</label>
                    <input
                        type="text"
                        name="image"
                        value={formData.image}
                        onChange={handleChange}
                        placeholder="https://..."
                        required
                    />
                </div>

                <div className="form-row">
                    <label>Description *</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={5}
                        required
                    />
                </div>

                <button type="submit" disabled={loading} className="submit-btn">
                    {loading ? 'Publishing...' : 'Publish'}
                </button>
            </form>
        </div>
    );
};

export default AddProduct;