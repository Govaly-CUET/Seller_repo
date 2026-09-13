import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

const SellerLogin = () => {
	const navigate = useNavigate();
	const [form, setForm] = useState({ email: '', password: '' });
	const [message, setMessage] = useState({ type: '', text: '' });
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleChange = ({ target }) => {
		setForm((current) => ({ ...current, [target.name]: target.value }));
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		setMessage({ type: '', text: '' });
		setIsSubmitting(true);

		try {
			const response = await axiosInstance.post('/api/v1/seller/auth/login', form);
			localStorage.setItem('sellerToken', response.data.token);
			localStorage.setItem('sellerProfile', JSON.stringify(response.data.data));
			navigate('/dashboard');
		} catch (error) {
			setMessage({
				type: 'error',
				text: error.response?.data?.message || 'Unable to log in. Please try again.',
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<main className="auth-page">
			<section className="auth-brand-panel">
				<div className="brand-lockup">
					<strong>Govaly</strong>
					<span>Bangladesh&apos;s favorite online fashion mall</span>
				</div>
				<div className="brand-copy">
					<p className="eyebrow">Seller workspace</p>
					<h1>Grow your shop with Govaly.</h1>
					<p>Manage your catalog, orders, and earnings from one focused workspace.</p>
				</div>
				<div className="brand-line" />
			</section>

			<section className="auth-form-panel">
				<div className="auth-form-wrap">
					<p className="eyebrow accent-eyebrow">Seller portal</p>
					<h2>Welcome back</h2>
					<p className="auth-subtitle">Log in to your Govaly shop dashboard.</p>
					{message.text && <div className={`form-message ${message.type}`}>{message.text}</div>}
					<form className="auth-form" onSubmit={handleSubmit}>
						<label htmlFor="login-email">Email address</label>
						<input id="login-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
						<label htmlFor="login-password">Password</label>
						<input id="login-password" name="password" type="password" autoComplete="current-password" placeholder="Enter your password" value={form.password} onChange={handleChange} required />
						<button className="auth-submit" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Logging in...' : 'Log in'}</button>
					</form>
					<div className="auth-footer"><span>New seller?</span> <Link to="/register">Create an account</Link></div>
				</div>
			</section>
		</main>
	);
};

export default SellerLogin;
