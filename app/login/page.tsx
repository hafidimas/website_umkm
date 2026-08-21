'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
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

    const [loginMethod, setLoginMethod] = useState<'whatsapp' | 'email'>('whatsapp');
    const [phoneWa, setPhoneWa] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [otpStep, setOtpStep] = useState<'INPUT_PHONE' | 'VERIFY_OTP'>('INPUT_PHONE');
    const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
    const [demoOtp, setDemoOtp] = useState<string>('');
    const [timerCount, setTimerCount] = useState<number>(60);
    const [canResend, setCanResend] = useState<boolean>(false);

    const inputRefs = [
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
    ];

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (otpStep === 'VERIFY_OTP' && timerCount > 0) {
            interval = setInterval(() => setTimerCount(prev => prev - 1), 1000);
        } else if (timerCount === 0) {
            setCanResend(true);
        }
        return () => clearInterval(interval);
    }, [otpStep, timerCount]);

    const handleLoginSuccess = () => {
        loginUser({
            name: email ? email.split('@')[0] : `Pelanggan WA (+62${phoneWa.slice(-4)})`,
            phoneWa: phoneWa ? `+62${phoneWa}` : undefined,
            email: email || undefined
        });
        if (reason === 'RECIPES') {
            router.push('/recipes');
        } else {
            router.push('/shop');
        }
    };

    const handleSendOtp = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!phoneWa) {
            showToast(isEn ? 'Please enter your WhatsApp number' : 'Mohon masukkan nomor WhatsApp Anda', 'fa-triangle-exclamation');
            return;
        }
        setIsLoading(true);
        try {
            const res = await fetch('/api/auth/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phoneWa })
            });
            const result = await res.json();
            if (result.success) {
                setDemoOtp(result.otpCode);
                setOtpStep('VERIFY_OTP');
                setTimerCount(60);
                setCanResend(false);
                setOtpDigits(['', '', '', '', '', '']);
                showToast(result.message, 'fa-paper-plane');
                setTimeout(() => inputRefs[0].current?.focus(), 300);
            } else {
                showToast(result.message || 'Gagal mengirim OTP', 'fa-triangle-exclamation');
            }
        } catch {
            showToast('Terjadi kesalahan koneksi server', 'fa-triangle-exclamation');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        const fullOtp = otpDigits.join('');
        if (fullOtp.length < 6) {
            showToast(isEn ? 'Please enter complete 6-digit OTP' : 'Masukkan 6 digit kode OTP secara lengkap', 'fa-triangle-exclamation');
            return;
        }
        setIsLoading(true);
        try {
            const res = await fetch('/api/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phoneWa, otpCode: fullOtp })
            });
            const result = await res.json();
            if (result.success) {
                handleLoginSuccess();
            } else {
                showToast(result.message || 'Kode OTP salah', 'fa-triangle-exclamation');
            }
        } catch {
            showToast('Gagal memverifikasi OTP', 'fa-triangle-exclamation');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDigitChange = (index: number, val: string) => {
        if (!/^[0-9]?$/.test(val)) return;
        const newDigits = [...otpDigits];
        newDigits[index] = val;
        setOtpDigits(newDigits);
        if (val && index < 5) inputRefs[index + 1].current?.focus();
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
            inputRefs[index - 1].current?.focus();
        }
    };

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 700));
            handleLoginSuccess();
        } catch {
            showToast('Gagal masuk ke akun', 'fa-triangle-exclamation');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="premium-auth-page">
            {/* LEFT PANEL — Immersive Visual */}
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
                            {isEn ? 'Welcome Back to the Greenhouse' : 'Selamat Datang Kembali ke Kebun'}
                        </h1>
                        <p className="auth-left-desc">
                            {isEn
                                ? 'Log in to manage your orders, track deliveries, and discover today\'s fresh harvest.'
                                : 'Masuk untuk kelola pesanan, pantau pengiriman, dan temukan sayuran segar hasil panen hari ini.'}
                        </p>
                    </div>

                    <div className="auth-left-stats">
                        <div className="auth-stat-item">
                            <span className="auth-stat-num">5K+</span>
                            <span className="auth-stat-label">{isEn ? 'Happy Customers' : 'Pelanggan'}</span>
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

            {/* RIGHT PANEL — Form */}
            <div className="premium-auth-right">
                <div className="premium-auth-right-inner">
                    {/* Top nav */}
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

                    {/* Header */}
                    <div className="premium-form-header">
                        <h2 className="premium-form-title">
                            {isEn ? 'Sign In' : 'Masuk Akun'}
                        </h2>
                        <p className="premium-form-subtitle">
                            {isEn ? 'Choose your preferred login method' : 'Pilih metode masuk yang Anda inginkan'}
                        </p>
                    </div>

                    {/* Method Tabs */}
                    <div className="premium-method-tabs">
                        <button
                            type="button"
                            className={`premium-method-tab ${loginMethod === 'whatsapp' ? 'active-wa' : ''}`}
                            onClick={() => { setLoginMethod('whatsapp'); setOtpStep('INPUT_PHONE'); }}
                        >
                            <i className="fa-brands fa-whatsapp"></i>
                            <span>WhatsApp OTP</span>
                        </button>
                        <button
                            type="button"
                            className={`premium-method-tab ${loginMethod === 'email' ? 'active-email' : ''}`}
                            onClick={() => setLoginMethod('email')}
                        >
                            <i className="fa-solid fa-envelope"></i>
                            <span>Email</span>
                        </button>
                    </div>

                    {/* Form Area */}
                    <div className="premium-form-body">
                        {loginMethod === 'whatsapp' ? (
                            otpStep === 'INPUT_PHONE' ? (
                                <form onSubmit={handleSendOtp} className="premium-form">
                                    <div className="pf-group">
                                        <label className="pf-label" htmlFor="phoneWa">
                                            {isEn ? 'WhatsApp Number' : 'Nomor WhatsApp'}
                                            <span className="pf-required">*</span>
                                        </label>
                                        <div className="pf-phone-row">
                                            <span className="pf-phone-prefix">+62</span>
                                            <input
                                                type="tel"
                                                id="phoneWa"
                                                required
                                                placeholder="81234567890"
                                                value={phoneWa}
                                                onChange={(e) => setPhoneWa(e.target.value.replace(/[^0-9]/g, ''))}
                                                className="pf-input"
                                            />
                                        </div>
                                        <span className="pf-hint">
                                            <i className="fa-solid fa-circle-info"></i>
                                            {isEn ? 'We\'ll send a 6-digit OTP to this number.' : 'Kode OTP 6-digit akan dikirim ke nomor ini.'}
                                        </span>
                                    </div>

                                    <button type="submit" disabled={isLoading} className="pf-btn pf-btn-wa">
                                        {isLoading ? (
                                            <><i className="fa-solid fa-spinner fa-spin"></i><span>{isEn ? 'Sending OTP...' : 'Mengirim OTP...'}</span></>
                                        ) : (
                                            <><i className="fa-brands fa-whatsapp"></i><span>{isEn ? 'Send OTP via WhatsApp' : 'Kirim Kode OTP WA'}</span></>
                                        )}
                                    </button>
                                </form>
                            ) : (
                                <form onSubmit={handleVerifyOtp} className="premium-form">
                                    <div className="pf-otp-info">
                                        <i className="fa-brands fa-whatsapp pf-otp-icon"></i>
                                        <div>
                                            <div className="pf-otp-text">{isEn ? 'Code sent to' : 'Kode dikirim ke'}</div>
                                            <div className="pf-otp-number">+62{phoneWa}</div>
                                        </div>
                                    </div>

                                    {demoOtp && (
                                        <div className="pf-demo-box">
                                            <i className="fa-solid fa-key"></i>
                                            <span>{isEn ? 'Demo OTP:' : 'OTP Demo:'} <strong>{demoOtp}</strong></span>
                                        </div>
                                    )}

                                    <div className="pf-group">
                                        <label className="pf-label" style={{ textAlign: 'center', display: 'block' }}>
                                            {isEn ? 'Enter 6-Digit OTP Code' : 'Masukkan Kode OTP 6-Digit'}
                                        </label>
                                        <div className="pf-otp-row">
                                            {otpDigits.map((digit, idx) => (
                                                <input
                                                    key={idx}
                                                    ref={inputRefs[idx]}
                                                    type="text"
                                                    maxLength={1}
                                                    value={digit}
                                                    onChange={(e) => handleDigitChange(idx, e.target.value)}
                                                    onKeyDown={(e) => handleKeyDown(idx, e)}
                                                    className={`pf-otp-digit ${digit ? 'filled' : ''}`}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    <button type="submit" disabled={isLoading} className="pf-btn pf-btn-wa">
                                        {isLoading ? (
                                            <><i className="fa-solid fa-spinner fa-spin"></i><span>{isEn ? 'Verifying...' : 'Memverifikasi...'}</span></>
                                        ) : (
                                            <><i className="fa-solid fa-shield-halved"></i><span>{isEn ? 'Verify & Sign In' : 'Verifikasi & Masuk'}</span></>
                                        )}
                                    </button>

                                    <div className="pf-otp-actions">
                                        <button type="button" className="pf-ghost-btn" onClick={() => setOtpStep('INPUT_PHONE')}>
                                            <i className="fa-solid fa-arrow-left"></i>
                                            {isEn ? 'Change Number' : 'Ganti Nomor'}
                                        </button>
                                        <button
                                            type="button"
                                            disabled={!canResend}
                                            className={`pf-ghost-btn ${canResend ? 'pf-ghost-active' : ''}`}
                                            onClick={() => handleSendOtp()}
                                        >
                                            {canResend ? (isEn ? 'Resend OTP' : 'Kirim Ulang') : `${isEn ? 'Resend in' : 'Ulang'} ${timerCount}s`}
                                        </button>
                                    </div>
                                </form>
                            )
                        ) : (
                            <form onSubmit={handleEmailLogin} className="premium-form">
                                <div className="pf-group">
                                    <label className="pf-label" htmlFor="loginEmail">Email</label>
                                    <div className="pf-input-wrap">
                                        <i className="fa-regular fa-envelope pf-input-icon"></i>
                                        <input
                                            type="email"
                                            id="loginEmail"
                                            required
                                            placeholder="nama@email.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="pf-input pf-input-with-icon"
                                        />
                                    </div>
                                </div>

                                <div className="pf-group">
                                    <div className="pf-label-row">
                                        <label className="pf-label" htmlFor="loginPassword">Password</label>
                                        <span className="pf-forgot">{isEn ? 'Forgot password?' : 'Lupa password?'}</span>
                                    </div>
                                    <div className="pf-input-wrap">
                                        <i className="fa-solid fa-lock pf-input-icon"></i>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            id="loginPassword"
                                            required
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="pf-input pf-input-with-icon pf-input-with-toggle"
                                        />
                                        <button
                                            type="button"
                                            className="pf-pw-toggle"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                        </button>
                                    </div>
                                </div>

                                <button type="submit" disabled={isLoading} className="pf-btn pf-btn-primary">
                                    {isLoading ? (
                                        <><i className="fa-solid fa-spinner fa-spin"></i><span>{isEn ? 'Signing In...' : 'Memproses...'}</span></>
                                    ) : (
                                        <><i className="fa-solid fa-arrow-right-to-bracket"></i><span>{isEn ? 'Sign In' : 'Masuk Akun'}</span></>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="premium-form-footer">
                        <div className="pf-divider">
                            <span></span>
                            <span className="pf-divider-text">{isEn ? 'or' : 'atau'}</span>
                            <span></span>
                        </div>
                        <p className="pf-footer-text">
                            {isEn ? 'Don\'t have an account?' : 'Belum punya akun?'}&nbsp;
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
                    <p>Memuat Halaman Login...</p>
                </div>
            </div>
        }>
            <LoginFormInner />
        </Suspense>
    );
}
