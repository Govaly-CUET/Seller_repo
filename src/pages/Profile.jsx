import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

const Profile = () => {
    const [formData, setFormData] = useState({
        shopName: '',
        phone: '',
        address: '',
        logoUrl: '',
    });
    const [ownerInfo, setOwnerInfo] = useState({ ownerName: '', email: '', shopSlug: '' });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await axiosInstance.get('/api/v1/seller/me');
            const seller = res.data.data;

            setFormData({
                shopName: seller.shopName || '',
                phone: seller.phone || '',
                address: seller.address || '',
                logoUrl: seller.logoUrl || '',
            });
            setOwnerInfo({
                ownerName: seller.ownerName || '',
                email: seller.email || '',
                shopSlug: seller.shopSlug || '',
            });
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Failed to load profile.',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleLogoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        setMessage({ type: '', text: '' });

        try {
            const uploadData = new FormData();
            uploadData.append('file', file);
            uploadData.append('folder', 'govaly/shop-logos');

            const res = await axiosInstance.post('/api/v1/seller/upload', uploadData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            setFormData((prev) => ({ ...prev, logoUrl: res.data.data.url }));
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Logo upload failed.',
            });
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            await axiosInstance.patch('/api/v1/seller/me', formData);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Update failed.',
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="add-product-container">Loading profile...</div>;
    }

    return (
        <div className="add-product-container">
            <h1 className="add-product-title">Profile</h1>

            {message.text && (
                <div className={`form-message ${message.type}`}>{message.text}</div>
            )}

            <form onSubmit={handleSubmit} className="add-product-form">
                <div className="form-row">
                    <label>Shop Logo</label>
                    <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={handleLogoUpload}
                        disabled={uploading}
                    />
                    {uploading && <p className="upload-status">Uploading...</p>}
                    {formData.logoUrl && (
                        <img src={formData.logoUrl} alt="Shop Logo" className="image-preview" />
                    )}
                </div>

                <div className="form-row two-col">
                    <div>
                        <label>Owner Name</label>
                        <input type="text" value={ownerInfo.ownerName} disabled />
                    </div>
                    <div>
                        <label>Email</label>
                        <input type="text" value={ownerInfo.email} disabled />
                    </div>
                </div>

                <div className="form-row">
                    <label>Shop URL Slug</label>
                    <input type="text" value={ownerInfo.shopSlug} disabled />
                </div>

                <div className="form-row">
                    <label>Shop Name *</label>
                    <input
                        type="text"
                        name="shopName"
                        value={formData.shopName}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-row">
                    <label>Contact Number *</label>
                    <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-row">
                    <label>Shop Address *</label>
                    <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        rows={3}
                        required
                    />
                </div>

                <button type="submit" disabled={saving || uploading} className="submit-btn">
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </form>
        </div>
    );
};

export default Profile;