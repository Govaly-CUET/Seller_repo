import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

const SellerLogin = () => {
	const navigate = useNavigate();
	const [form, setForm] = useState({ email: '', password: '' });
	const [message, setMessage] = useState({ type: '', text: '' });
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [mode, setMode] = useState('password');
	const [otpSent, setOtpSent] = useState(false);
	const [otp, setOtp] = useState('');
	const [resetToken, setResetToken] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');

	const handleChange = ({ target }) => {
		setForm((current) => ({ ...current, [target.name]: target.value }));
	};

	const resetAuthState = (nextMode) => {
		setMode(nextMode);
		setOtpSent(false);
		setOtp('');
		setResetToken('');
		setNewPassword('');
		setConfirmPassword('');
		setMessage({ type: '', text: '' });
	};

	const requestOtp = async () => {
		if (!form.email.trim()) throw new Error('Enter your seller email address first.');
		const response = await axiosInstance.post('/api/v1/seller/auth/otp/request', { email: form.email.trim(), purpose: 'forgot-password' });
		setOtpSent(true);
		return response;
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		setMessage({ type: '', text: '' });
		setIsSubmitting(true);

		try {
				if (mode === 'forgot') {
					if (!otpSent) {
						await requestOtp();
						return;
					}
					if (!resetToken) {
						const response = await axiosInstance.post('/api/v1/seller/auth/forgot-password/verify-otp', { email: form.email.trim(), otp });
						setResetToken(response.data.data.resetToken);
						return;
					}
					if (!newPassword || newPassword !== confirmPassword) throw new Error('Passwords do not match.');
					await axiosInstance.post('/api/v1/seller/auth/forgot-password/reset', { email: form.email.trim(), resetToken, password: newPassword, confirmPassword });
					resetAuthState('password');
					setMessage({ type: 'success', text: 'Password reset successfully. You can log in now.' });
					return;
				}

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
					<h2>{mode === 'forgot' ? 'Reset password' : 'Welcome back'}</h2>
					<p className="auth-subtitle">Log in to your Govaly shop dashboard.</p>
					{message.text && <div className={`form-message ${message.type}`}>{message.text}</div>}
					<form className="auth-form" onSubmit={handleSubmit}>
						<label htmlFor="login-email">Email address</label>
						<input id="login-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
						{mode === 'password' && <>
							<label htmlFor="login-password">Password</label>
							<input id="login-password" name="password" type="password" autoComplete="current-password" placeholder="Enter your password" value={form.password} onChange={handleChange} required />
						</>}
						{mode === 'forgot' && otpSent && !resetToken ? <>
							<label htmlFor="login-otp">Verification code</label>
							<input id="login-otp" type="text" inputMode="numeric" maxLength="6" placeholder="6-digit OTP" value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))} required />
						</> : null}
						{mode === 'forgot' && resetToken && <>
							<label htmlFor="new-password">New password</label>
							<input id="new-password" type="password" minLength="6" placeholder="At least 6 characters" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} required />
							<label htmlFor="confirm-password">Confirm password</label>
							<input id="confirm-password" type="password" minLength="6" placeholder="Repeat your password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required />
						</>}
						<button className="auth-submit" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Please wait...' : mode === 'forgot' ? (!otpSent ? 'Send OTP' : !resetToken ? 'Verify OTP' : 'Reset password') : 'Log in'}</button>
						{mode === 'password' && <button type="button" className="auth-link-button" onClick={() => resetAuthState('forgot')}>Forgot password?</button>}
						{mode !== 'password' && <button type="button" className="auth-link-button" onClick={() => resetAuthState('password')}>Back to password login</button>}
					</form>
					<div className="auth-footer"><span>New seller?</span> <Link to="/register">Create an account</Link></div>
				</div>
			</section>
		</main>
	);
};

export default SellerLogin;
