import { useState, useEffect, useRef } from 'react';
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
    const [editMode, setEditMode] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const fileInputRef = useRef(null);

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
            await axiosInstance.patch('/api/v1/seller/me', {
                shopName: formData.shopName,
                phone: formData.phone,
                address: formData.address,
                logoUrl: formData.logoUrl,
            });
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setEditMode(false);
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Update failed.',
            });
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setEditMode(false);
        setMessage({ type: '', text: '' });
        fetchProfile();
    };

    if (loading) {
        return <div className="add-product-container">Loading profile...</div>;
    }

    return (
        <div className="add-product-container profile-container">
            <div className="profile-header-row">
                <h1 className="add-product-title">Profile</h1>
                {!editMode && (
                    <button className="edit-btn" onClick={() => setEditMode(true)}>
                        Edit Profile
                    </button>
                )}
            </div>

            {message.text && (
                <div className={`form-message ${message.type}`}>{message.text}</div>
            )}

            <div className="profile-identity-row">
                <div className="profile-avatar-wrap">
                    <img
                        src={formData.logoUrl || 'https://placehold.co/120x120?text=Logo'}
                        alt="Shop Logo"
                        className="profile-avatar"
                    />
                    {editMode && (
                        <button
                            type="button"
                            className="avatar-edit-btn"
                            onClick={() => fileInputRef.current.click()}
                            disabled={uploading}
                        >
                            {uploading ? '...' : '✎'}
                        </button>
                    )}
                    <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={handleLogoUpload}
                        style={{ display: 'none' }}
                    />
                </div>
                <div className="profile-identity-text">
                    <p className="profile-shop-name">{formData.shopName || '—'}</p>
                    <p className="profile-shop-slug">govaly.com/{ownerInfo.shopSlug}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="add-product-form profile-form">
                <div className="form-row two-col">
                    <div>
                        <label>Owner Name</label>
                        <p className="profile-static-value">{ownerInfo.ownerName}</p>
                    </div>
                    <div>
                        <label>Email</label>
                        <p className="profile-static-value">{ownerInfo.email}</p>
                    </div>
                </div>

                <div className="form-row">
                    <label>Shop Name *</label>
                    {editMode ? (
                        <input
                            type="text"
                            name="shopName"
                            value={formData.shopName}
                            onChange={handleChange}
                            required
                        />
                    ) : (
                        <p className="profile-static-value">{formData.shopName}</p>
                    )}
                </div>

                <div className="form-row">
                    <label>Contact Number *</label>
                    {editMode ? (
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                    ) : (
                        <p className="profile-static-value">{formData.phone}</p>
                    )}
                </div>

                <div className="form-row">
                    <label>Shop Address *</label>
                    {editMode ? (
                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            rows={3}
                            required
                        />
                    ) : (
                        <p className="profile-static-value">{formData.address}</p>
                    )}
                </div>

                {editMode && (
                    <div className="profile-action-row">
                        <button type="submit" disabled={saving || uploading} className="submit-btn">
                            {saving ? 'Updating...' : 'Update'}
                        </button>
                        <button type="button" className="cancel-btn" onClick={handleCancel}>
                            Cancel
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
};

export default Profile;