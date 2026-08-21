'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useShop } from '../../context/ShopContext';

function LoginFormInner() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const reason = searchParams.get('reason');

    const { showToast, language, loginUser } = useShop();
    const isEn = language === 'en';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            showToast(isEn ? 'Please fill in all fields' : 'Mohon isi email dan password', 'fa-triangle-exclamation');
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.trim().toLowerCase(), password })
            });

            const result = await res.json();

            if (result.success) {
                // Simpan info user ke context
                loginUser({
                    name: result.data.name,
                    email: result.data.email
                });

                showToast(result.message, 'fa-circle-check');

                // Redirect sesuai alasan
                if (reason === 'RECIPES') {
                    router.push('/recipes');
                } else {
                    router.push('/shop');
                }
            } else {
                showToast(result.message, 'fa-triangle-exclamation');
            }
        } catch {
            showToast(isEn ? 'Server connection error. Try again.' : 'Gagal terhubung ke server, coba lagi.', 'fa-triangle-exclamation');
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
                            <i className="fa-solid fa-leaf"></i>
                            {isEn ? 'Fresh · Organic · Trusted' : 'Segar · Organik · Terpercaya'}
                        </div>
                        <h1 className="auth-left-title">
                            {isEn ? 'Welcome Back to the Greenhouse' : 'Selamat Datang Kembali'}
                        </h1>
                        <p className="auth-left-desc">
                            {isEn
                                ? 'Sign in to manage your orders, track deliveries, and discover today\'s fresh harvest from our sterile hydroponic farm.'
                                : 'Masuk untuk kelola pesanan, pantau pengiriman, dan temukan sayuran segar panen hari ini dari kebun hidroponik steril kami.'}
                        </p>
                    </div>

                    <div className="auth-left-stats">
                        <div className="auth-stat-item">
                            <span className="auth-stat-num">5K+</span>
                            <span className="auth-stat-label">{isEn ? 'Customers' : 'Pelanggan'}</span>
                        </div>
                        <div className="auth-stat-divider" />
                        <div className="auth-stat-item">
                            <span className="auth-stat-num">95%</span>
                            <span className="auth-stat-label">{isEn ? 'Water Saved' : 'Hemat Air'}</span>
                        </div>
                        <div className="auth-stat-divider" />
                        <div className="auth-stat-item">
                            <span className="auth-stat-num">0%</span>
                            <span className="auth-stat-label">{isEn ? 'Pesticide' : 'Pestisida'}</span>
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
                            {isEn ? 'No account?' : 'Belum punya akun?'}&nbsp;
                            <Link href="/register" className="premium-auth-switch-link">
                                {isEn ? 'Register' : 'Daftar'}
                            </Link>
                        </span>
                    </div>

                    <div className="premium-form-header">
                        <h2 className="premium-form-title">
                            {isEn ? 'Sign In' : 'Masuk Akun'}
                        </h2>
                        <p className="premium-form-subtitle">
                            {isEn ? 'Enter your email and password to continue' : 'Masukkan email dan password Anda'}
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="premium-form" style={{ gap: '18px', display: 'flex', flexDirection: 'column' }}>
                        {/* Email */}
                        <div className="pf-group">
                            <label className="pf-label" htmlFor="loginEmail">
                                Email
                                <span className="pf-required">*</span>
                            </label>
                            <div className="pf-input-wrap">
                                <i className="fa-regular fa-envelope pf-input-icon"></i>
                                <input
                                    type="email"
                                    id="loginEmail"
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
                            <div className="pf-label-row">
                                <label className="pf-label" htmlFor="loginPassword">
                                    Password
                                    <span className="pf-required">*</span>
                                </label>
                                <span className="pf-forgot">
                                    {isEn ? 'Forgot password?' : 'Lupa password?'}
                                </span>
                            </div>
                            <div className="pf-input-wrap">
                                <i className="fa-solid fa-lock pf-input-icon"></i>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="loginPassword"
                                    required
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pf-input pf-input-with-icon pf-input-with-toggle"
                                />
                                <button
                                    type="button"
                                    className="pf-pw-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label="Toggle password visibility"
                                >
                                    <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="pf-btn pf-btn-primary"
                            style={{ marginTop: '8px' }}
                        >
                            {isLoading ? (
                                <><i className="fa-solid fa-spinner fa-spin"></i><span>{isEn ? 'Signing In...' : 'Memproses...'}</span></>
                            ) : (
                                <><i className="fa-solid fa-arrow-right-to-bracket"></i><span>{isEn ? 'Sign In' : 'Masuk Akun'}</span></>
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
                            {isEn ? 'Don\'t have an account yet?' : 'Belum punya akun?'}&nbsp;
                            <Link href="/register" className="pf-footer-link">
                                {isEn ? 'Create one for free' : 'Daftar gratis sekarang'}
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="auth-loading-screen">
                <div className="auth-loading-inner">
                    <i className="fa-solid fa-seedling fa-spin"></i>
                    <p>Memuat...</p>
                </div>
            </div>
        }>
            <LoginFormInner />
        </Suspense>
    );
}
