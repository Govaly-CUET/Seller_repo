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
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [previewUrl, setPreviewUrl] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        setMessage({ type: '', text: '' });

        try {
            const uploadData = new FormData();
            uploadData.append('file', file);
            uploadData.append('folder', 'govaly/products');

            const res = await axiosInstance.post('/api/v1/upload', uploadData);

            const uploadedUrl = res.data.data.url;
            setFormData((prev) => ({ ...prev, image: uploadedUrl }));
            setPreviewUrl(uploadedUrl);
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Image upload failed.',
            });
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.image) {
            setMessage({ type: 'error', text: 'Please upload a product image first.' });
            return;
        }

        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            await axiosInstance.post('/seller/products', {
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
            setPreviewUrl('');
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
                    <label>Product Image *</label>
                    <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={handleImageUpload}
                        disabled={uploading}
                    />
                    {uploading && <p className="upload-status">Uploading...</p>}
                    {previewUrl && (
                        <img src={previewUrl} alt="Preview" className="image-preview" />
                    )}
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

                <button type="submit" disabled={loading || uploading} className="submit-btn">
                    {loading ? 'Publishing...' : 'Publish'}
                </button>
            </form>
        </div>
    );
};

export default AddProduct;