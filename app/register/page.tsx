'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useShop } from '../../context/ShopContext';

export default function RegisterPage() {
    const router = useRouter();
    const { showToast, language, loginUser } = useShop();
    const isEn = language === 'en';

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Live password match indicator
    const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
    const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword;

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        // Client-side validation
        if (password !== confirmPassword) {
            showToast(isEn ? 'Passwords do not match' : 'Password tidak cocok, periksa kembali', 'fa-triangle-exclamation');
            return;
        }

        if (password.length < 6) {
            showToast(isEn ? 'Password must be at least 6 characters' : 'Password minimal 6 karakter', 'fa-triangle-exclamation');
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, confirmPassword })
            });

            const result = await res.json();

            if (result.success) {
                // Auto-login setelah register
                loginUser({
                    name: result.data.name,
                    email: result.data.email
                });
                showToast(result.message, 'fa-circle-check');
                setTimeout(() => router.push('/shop'), 1000);
            } else {
                showToast(result.message || isEn ? 'Registration failed' : 'Pendaftaran gagal', 'fa-triangle-exclamation');
            }
        } catch {
            showToast(isEn ? 'Server connection error' : 'Gagal terhubung ke server', 'fa-triangle-exclamation');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="premium-auth-page">
            {/* LEFT PANEL */}
            <div className="premium-auth-left">
                <div className="auth-left-overlay" />
                <Image
                    src="/auth-hero.jpg"
                    alt="Devsecora Hydroponics Farm"
                    fill
                    style={{ objectFit: 'cover' }}
                    priority
                />
                <div className="auth-left-content">
                    <Link href="/" className="auth-brand-mark">
                        <div className="auth-brand-icon">
                            <i className="fa-solid fa-seedling"></i>
                        </div>
                        <div>
                            <div className="auth-brand-name">Devsecora</div>
                            <div className="auth-brand-tagline">HYDRO FARM &amp; PRODUCE</div>
                        </div>
                    </Link>

                    <div className="auth-left-hero">
                        <div className="auth-left-pill">
                            <i className="fa-solid fa-user-plus"></i>
                            {isEn ? 'Join 5,000+ Green Families' : 'Bergabung 5.000+ Keluarga Sehat'}
                        </div>
                        <h1 className="auth-left-title">
                            {isEn ? 'Start Your Fresh Journey Today' : 'Mulai Perjalanan Segar Anda'}
                        </h1>
                        <p className="auth-left-desc">
                            {isEn
                                ? 'Create an account to order fresh hydroponic vegetables, track deliveries, and access exclusive member deals.'
                                : 'Buat akun untuk memesan sayuran hidroponik segar, pantau pengiriman, dan nikmati promo eksklusif anggota.'}
                        </p>
                    </div>

                    <div className="auth-left-benefits">
                        <div className="auth-benefit-row">
                            <div className="auth-benefit-check"><i className="fa-solid fa-check"></i></div>
                            <span>{isEn ? '100% Pesticide-Free Hydroponics' : '100% Bebas Pestisida Kimia'}</span>
                        </div>
                        <div className="auth-benefit-row">
                            <div className="auth-benefit-check"><i className="fa-solid fa-check"></i></div>
                            <span>{isEn ? 'Harvested daily at 05:00 AM' : 'Dipetik segar setiap jam 05:00 WIB'}</span>
                        </div>
                        <div className="auth-benefit-row">
                            <div className="auth-benefit-check"><i className="fa-solid fa-check"></i></div>
                            <span>{isEn ? '15–30 min express delivery' : 'Antar express 15–30 menit'}</span>
                        </div>
                        <div className="auth-benefit-row">
                            <div className="auth-benefit-check"><i className="fa-solid fa-check"></i></div>
                            <span>{isEn ? 'Exclusive member discounts' : 'Diskon khusus anggota terdaftar'}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="premium-auth-right">
                <div className="premium-auth-right-inner">
                    <div className="premium-auth-topbar">
                        <Link href="/shop" className="premium-auth-back">
                            <i className="fa-solid fa-arrow-left"></i>
                            <span>{isEn ? 'Back to Shop' : 'Kembali'}</span>
                        </Link>
                        <span className="premium-auth-switch-prompt">
                            {isEn ? 'Have an account?' : 'Sudah punya akun?'}&nbsp;
                            <Link href="/login" className="premium-auth-switch-link">
                                {isEn ? 'Sign In' : 'Masuk'}
                            </Link>
                        </span>
                    </div>

                    <div className="premium-form-header">
                        <h2 className="premium-form-title">
                            {isEn ? 'Create Account' : 'Daftar Akun Baru'}
                        </h2>
                        <p className="premium-form-subtitle">
                            {isEn ? 'Fill in your details to get started' : 'Isi data Anda untuk mulai berbelanja'}
                        </p>
                    </div>

                    <form onSubmit={handleRegister} className="premium-form" style={{ gap: '18px', display: 'flex', flexDirection: 'column' }}>
                        {/* Nama Lengkap */}
                        <div className="pf-group">
                            <label className="pf-label" htmlFor="regName">
                                {isEn ? 'Full Name' : 'Nama Lengkap'}
                                <span className="pf-required">*</span>
                            </label>
                            <div className="pf-input-wrap">
                                <i className="fa-regular fa-user pf-input-icon"></i>
                                <input
                                    type="text"
                                    id="regName"
                                    required
                                    autoComplete="name"
                                    placeholder={isEn ? 'e.g. Budi Santoso' : 'Nama lengkap Anda'}
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="pf-input pf-input-with-icon"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="pf-group">
                            <label className="pf-label" htmlFor="regEmail">
                                Email
                                <span className="pf-required">*</span>
                            </label>
                            <div className="pf-input-wrap">
                                <i className="fa-regular fa-envelope pf-input-icon"></i>
                                <input
                                    type="email"
                                    id="regEmail"
                                    required
                                    autoComplete="email"
                                    placeholder="contoh@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pf-input pf-input-with-icon"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="pf-group">
                            <label className="pf-label" htmlFor="regPassword">
                                Password
                                <span className="pf-required">*</span>
                            </label>
                            <div className="pf-input-wrap">
                                <i className="fa-solid fa-lock pf-input-icon"></i>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="regPassword"
                                    required
                                    autoComplete="new-password"
                                    placeholder={isEn ? 'Min. 6 characters' : 'Min. 6 karakter'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pf-input pf-input-with-icon pf-input-with-toggle"
                                />
                                <button type="button" className="pf-pw-toggle" onClick={() => setShowPassword(!showPassword)} aria-label="Toggle password visibility">
                                    <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                </button>
                            </div>
                            {password.length > 0 && password.length < 6 && (
                                <span className="pf-field-error">
                                    <i className="fa-solid fa-circle-exclamation"></i>
                                    {isEn ? 'Minimum 6 characters' : 'Minimal 6 karakter'}
                                </span>
                            )}
                        </div>

                        {/* Konfirmasi Password */}
                        <div className="pf-group">
                            <label className="pf-label" htmlFor="regConfirm">
                                {isEn ? 'Confirm Password' : 'Konfirmasi Password'}
                                <span className="pf-required">*</span>
                            </label>
                            <div className="pf-input-wrap">
                                <i className={`fa-solid ${passwordsMatch ? 'fa-lock-open' : 'fa-lock'} pf-input-icon ${passwordsMatch ? 'pf-icon-success' : passwordsMismatch ? 'pf-icon-error' : ''}`}></i>
                                <input
                                    type={showConfirm ? 'text' : 'password'}
                                    id="regConfirm"
                                    required
                                    autoComplete="new-password"
                                    placeholder={isEn ? 'Re-enter your password' : 'Ulangi password Anda'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className={`pf-input pf-input-with-icon pf-input-with-toggle ${passwordsMatch ? 'pf-input-success' : passwordsMismatch ? 'pf-input-error' : ''}`}
                                />
                                <button type="button" className="pf-pw-toggle" onClick={() => setShowConfirm(!showConfirm)} aria-label="Toggle confirm password visibility">
                                    <i className={`fa-solid ${showConfirm ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                </button>
                            </div>
                            {passwordsMatch && (
                                <span className="pf-field-success">
                                    <i className="fa-solid fa-circle-check"></i>
                                    {isEn ? 'Passwords match!' : 'Password cocok!'}
                                </span>
                            )}
                            {passwordsMismatch && (
                                <span className="pf-field-error">
                                    <i className="fa-solid fa-circle-exclamation"></i>
                                    {isEn ? 'Passwords do not match' : 'Password tidak cocok'}
                                </span>
                            )}
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isLoading || passwordsMismatch}
                            className="pf-btn pf-btn-primary"
                            style={{ marginTop: '4px' }}
                        >
                            {isLoading ? (
                                <><i className="fa-solid fa-spinner fa-spin"></i><span>{isEn ? 'Creating Account...' : 'Membuat Akun...'}</span></>
                            ) : (
                                <><i className="fa-solid fa-user-plus"></i><span>{isEn ? 'Create Account' : 'Daftar Sekarang'}</span></>
                            )}
                        </button>
                    </form>

                    <div className="premium-form-footer" style={{ marginTop: '24px' }}>
                        <div className="pf-divider">
                            <span></span>
                            <span className="pf-divider-text">{isEn ? 'or' : 'atau'}</span>
                            <span></span>
                        </div>
                        <p className="pf-footer-text">
                            {isEn ? 'Already have an account?' : 'Sudah punya akun?'}&nbsp;
                            <Link href="/login" className="pf-footer-link">
                                {isEn ? 'Sign in here' : 'Masuk di sini'}
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
