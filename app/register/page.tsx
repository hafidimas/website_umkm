'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useShop } from '../../context/ShopContext';

export default function RegisterPage() {
    const router = useRouter();
    const { showToast, language } = useShop();
    const isEn = language === 'en';

    const [regMethod, setRegMethod] = useState<'whatsapp' | 'email'>('whatsapp');
    const [name, setName] = useState('');
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

    const handleSendOtp = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!name || !phoneWa) {
            showToast(isEn ? 'Please fill in name and WhatsApp number' : 'Mohon isi nama dan nomor WhatsApp Anda', 'fa-triangle-exclamation');
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
                body: JSON.stringify({ phoneWa, otpCode: fullOtp, name })
            });
            const result = await res.json();
            if (result.success) {
                showToast(result.message, 'fa-circle-check');
                setTimeout(() => router.push('/shop'), 1000);
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

    const handleEmailRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, registrationMethod: 'email' })
            });
            const result = await res.json();
            if (result.success) {
                showToast(result.message, 'fa-circle-check');
                setTimeout(() => router.push('/shop'), 1000);
            } else {
                showToast(result.message || 'Gagal mendaftar email', 'fa-triangle-exclamation');
            }
        } catch {
            showToast('Gagal memproses pendaftaran', 'fa-triangle-exclamation');
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
                            <i className="fa-solid fa-user-plus"></i>
                            {isEn ? 'Join 5,000+ Green Families' : 'Bergabung dengan 5.000+ Keluarga Sehat'}
                        </div>
                        <h1 className="auth-left-title">
                            {isEn ? 'Start Your Fresh Journey Today' : 'Mulai Perjalanan Segar Anda Hari Ini'}
                        </h1>
                        <p className="auth-left-desc">
                            {isEn
                                ? 'Register in seconds using WhatsApp OTP — no password needed. Get exclusive access to daily harvest deals.'
                                : 'Daftar dalam hitungan detik via WhatsApp OTP. Dapatkan akses eksklusif ke promo panen harian kami.'}
                        </p>
                    </div>

                    <div className="auth-left-benefits">
                        <div className="auth-benefit-row">
                            <div className="auth-benefit-check">
                                <i className="fa-solid fa-check"></i>
                            </div>
                            <span>{isEn ? '100% Pesticide-Free Hydroponics' : '100% Bebas Pestisida'}</span>
                        </div>
                        <div className="auth-benefit-row">
                            <div className="auth-benefit-check">
                                <i className="fa-solid fa-check"></i>
                            </div>
                            <span>{isEn ? 'Harvested daily at 05:00 AM' : 'Dipetik segar jam 05:00 WIB'}</span>
                        </div>
                        <div className="auth-benefit-row">
                            <div className="auth-benefit-check">
                                <i className="fa-solid fa-check"></i>
                            </div>
                            <span>{isEn ? '15–30 min express delivery' : 'Pengiriman express 15-30 menit'}</span>
                        </div>
                        <div className="auth-benefit-row">
                            <div className="auth-benefit-check">
                                <i className="fa-solid fa-check"></i>
                            </div>
                            <span>{isEn ? 'Exclusive member discounts' : 'Diskon eksklusif untuk anggota'}</span>
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
                            {isEn ? 'Have an account?' : 'Sudah punya akun?'}&nbsp;
                            <Link href="/login" className="premium-auth-switch-link">
                                {isEn ? 'Sign In' : 'Masuk'}
                            </Link>
                        </span>
                    </div>

                    {/* Header */}
                    <div className="premium-form-header">
                        <h2 className="premium-form-title">
                            {isEn ? 'Create Account' : 'Daftar Akun Baru'}
                        </h2>
                        <p className="premium-form-subtitle">
                            {isEn ? 'Choose your sign-up method' : 'Pilih metode pendaftaran Anda'}
                        </p>
                    </div>

                    {/* Method Tabs */}
                    <div className="premium-method-tabs">
                        <button
                            type="button"
                            className={`premium-method-tab ${regMethod === 'whatsapp' ? 'active-wa' : ''}`}
                            onClick={() => { setRegMethod('whatsapp'); setOtpStep('INPUT_PHONE'); }}
                        >
                            <i className="fa-brands fa-whatsapp"></i>
                            <span>WhatsApp OTP</span>
                        </button>
                        <button
                            type="button"
                            className={`premium-method-tab ${regMethod === 'email' ? 'active-email' : ''}`}
                            onClick={() => { setRegMethod('email'); setOtpStep('INPUT_PHONE'); }}
                        >
                            <i className="fa-solid fa-envelope"></i>
                            <span>Email</span>
                        </button>
                    </div>

                    {/* Form Area */}
                    <div className="premium-form-body">
                        {regMethod === 'whatsapp' ? (
                            otpStep === 'INPUT_PHONE' ? (
                                <form onSubmit={handleSendOtp} className="premium-form">
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
                                                placeholder={isEn ? 'e.g. Budi Santoso' : 'Nama lengkap Anda'}
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="pf-input pf-input-with-icon"
                                            />
                                        </div>
                                    </div>

                                    <div className="pf-group">
                                        <label className="pf-label" htmlFor="regPhone">
                                            {isEn ? 'WhatsApp Number' : 'Nomor WhatsApp'}
                                            <span className="pf-required">*</span>
                                        </label>
                                        <div className="pf-phone-row">
                                            <span className="pf-phone-prefix">+62</span>
                                            <input
                                                type="tel"
                                                id="regPhone"
                                                required
                                                placeholder="81234567890"
                                                value={phoneWa}
                                                onChange={(e) => setPhoneWa(e.target.value.replace(/[^0-9]/g, ''))}
                                                className="pf-input"
                                            />
                                        </div>
                                        <span className="pf-hint">
                                            <i className="fa-solid fa-circle-info"></i>
                                            {isEn ? 'OTP verification will be sent here.' : 'Kode OTP akan dikirim ke nomor ini.'}
                                        </span>
                                    </div>

                                    <button type="submit" disabled={isLoading} className="pf-btn pf-btn-wa">
                                        {isLoading ? (
                                            <><i className="fa-solid fa-spinner fa-spin"></i><span>{isEn ? 'Sending OTP...' : 'Mengirim OTP...'}</span></>
                                        ) : (
                                            <><i className="fa-brands fa-whatsapp"></i><span>{isEn ? 'Send WhatsApp OTP' : 'Kirim Kode OTP WA'}</span></>
                                        )}
                                    </button>
                                </form>
                            ) : (
                                <form onSubmit={handleVerifyOtp} className="premium-form">
                                    <div className="pf-otp-info">
                                        <i className="fa-brands fa-whatsapp pf-otp-icon"></i>
                                        <div>
                                            <div className="pf-otp-text">{isEn ? 'Code sent to' : 'Kode dikirim ke'}</div>
                                            <div className="pf-otp-number">{phoneWa}</div>
                                        </div>
                                    </div>

                                    {demoOtp && (
                                        <div className="pf-demo-box">
                                            <i className="fa-solid fa-key"></i>
                                            <span>{isEn ? 'Demo OTP:' : 'OTP Demo:'} <strong>{demoOtp.slice(0, 3)}-{demoOtp.slice(3)}</strong></span>
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
                                            <><i className="fa-solid fa-shield-halved"></i><span>{isEn ? 'Verify & Create Account' : 'Verifikasi & Buat Akun'}</span></>
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
                            <form onSubmit={handleEmailRegister} className="premium-form">
                                <div className="pf-group">
                                    <label className="pf-label" htmlFor="regName2">
                                        {isEn ? 'Full Name' : 'Nama Lengkap'}
                                        <span className="pf-required">*</span>
                                    </label>
                                    <div className="pf-input-wrap">
                                        <i className="fa-regular fa-user pf-input-icon"></i>
                                        <input
                                            type="text"
                                            id="regName2"
                                            required
                                            placeholder={isEn ? 'e.g. Budi Santoso' : 'Nama lengkap Anda'}
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="pf-input pf-input-with-icon"
                                        />
                                    </div>
                                </div>

                                <div className="pf-group">
                                    <label className="pf-label" htmlFor="regEmail">Email</label>
                                    <div className="pf-input-wrap">
                                        <i className="fa-regular fa-envelope pf-input-icon"></i>
                                        <input
                                            type="email"
                                            id="regEmail"
                                            required
                                            placeholder="budi@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="pf-input pf-input-with-icon"
                                        />
                                    </div>
                                </div>

                                <div className="pf-group">
                                    <label className="pf-label" htmlFor="regPassword">Password</label>
                                    <div className="pf-input-wrap">
                                        <i className="fa-solid fa-lock pf-input-icon"></i>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            id="regPassword"
                                            required
                                            placeholder="Min. 8 karakter"
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
                                        <><i className="fa-solid fa-spinner fa-spin"></i><span>{isEn ? 'Creating Account...' : 'Membuat Akun...'}</span></>
                                    ) : (
                                        <><i className="fa-solid fa-user-plus"></i><span>{isEn ? 'Create Account' : 'Daftar Sekarang'}</span></>
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
