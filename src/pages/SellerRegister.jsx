import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

const initialForm = {
	shopName: '', shopSlug: '', ownerName: '', email: '', password: '', phone: '', address: '',
};

const SellerRegister = () => {
	const navigate = useNavigate();
	const [form, setForm] = useState(initialForm);
	const [documents, setDocuments] = useState({ nid: null, tradeLicense: null });
	const [message, setMessage] = useState({ type: '', text: '' });
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleChange = ({ target }) => {
		const value = target.name === 'shopSlug'
			? target.value.toLowerCase().trim().replace(/\s+/g, '-')
			: target.value;
		setForm((current) => ({ ...current, [target.name]: value }));
	};

	const handleFileChange = ({ target }) => {
		setDocuments((current) => ({ ...current, [target.name]: target.files?.[0] || null }));
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		setMessage({ type: '', text: '' });
		setIsSubmitting(true);

		try {
			const data = new FormData();
			Object.entries(form).forEach(([name, value]) => data.append(name, value));
			data.append('nid', documents.nid);
			data.append('tradeLicense', documents.tradeLicense);
			await axiosInstance.post('/api/v1/seller/auth/register', data);

			setMessage({ type: 'success', text: 'Registration submitted. Your account is pending admin approval.' });
			setTimeout(() => navigate('/'), 1800);
		} catch (error) {
			const backendMessage = error.response?.data?.message;
			setMessage({
				type: 'error',
				text: backendMessage || 'Unable to complete registration. Please try again.',
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<main className="register-page">
			<section className="register-header">
				<Link className="register-logo" to="/">Govaly</Link>
				<div>Already have a shop? <Link to="/">Log in</Link></div>
			</section>
			<section className="register-card">
				<div className="register-intro">
					<p className="eyebrow accent-eyebrow">Seller application</p>
					<h1>Open your Govaly shop</h1>
					<p>Start with the essentials. Your application will be reviewed by the Govaly team.</p>
				</div>
				{message.text && <div className={`form-message ${message.type}`}>{message.text}</div>}
				<form className="register-form" onSubmit={handleSubmit}>
					<div className="register-grid">
						<div className="field-group"><label htmlFor="shopName">Shop name *</label><input id="shopName" name="shopName" placeholder="e.g. Aarong Corner" value={form.shopName} onChange={handleChange} required /></div>
						<div className="field-group"><label htmlFor="shopSlug">Shop URL *</label><div className="slug-input"><span>govaly.com/</span><input id="shopSlug" name="shopSlug" placeholder="your-shop" value={form.shopSlug} onChange={handleChange} required /></div></div>
						<div className="field-group"><label htmlFor="ownerName">Owner name *</label><input id="ownerName" name="ownerName" placeholder="Full name" value={form.ownerName} onChange={handleChange} required /></div>
						<div className="field-group"><label htmlFor="phone">Phone number *</label><input id="phone" name="phone" type="tel" placeholder="01XXXXXXXXX" value={form.phone} onChange={handleChange} required /></div>
						<div className="field-group"><label htmlFor="email">Email address *</label><input id="email" name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required /></div>
						<div className="field-group"><label htmlFor="password">Password *</label><input id="password" name="password" type="password" minLength="6" placeholder="At least 6 characters" value={form.password} onChange={handleChange} required /></div>
						<div className="field-group field-full"><label htmlFor="address">Shop address *</label><textarea id="address" name="address" rows="3" placeholder="House, road, area, city" value={form.address} onChange={handleChange} required /></div>
					</div>
					<div className="document-section">
						<div><h2>Verification documents</h2><p>PDF, JPG, PNG, or WEBP up to 5MB each.</p></div>
						<div className="document-grid">
							<label className="file-field"><span>NID card *</span><input name="nid" type="file" accept="application/pdf,image/jpeg,image/png,image/webp" onChange={handleFileChange} required /><small>{documents.nid?.name || 'Choose file'}</small></label>
							<label className="file-field"><span>Trade license *</span><input name="tradeLicense" type="file" accept="application/pdf,image/jpeg,image/png,image/webp" onChange={handleFileChange} required /><small>{documents.tradeLicense?.name || 'Choose file'}</small></label>
						</div>
					</div>
					<button className="auth-submit register-submit" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Submitting...' : 'Submit application'}</button>
				</form>
			</section>
		</main>
	);
};

export default SellerRegister;