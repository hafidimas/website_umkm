'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
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
    const [isLoading, setIsLoading] = useState(false);

    // STEP OTP MANAGEMENT
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

    // TIMER COUNTDOWN FOR RESEND OTP
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (otpStep === 'VERIFY_OTP' && timerCount > 0) {
            interval = setInterval(() => {
                setTimerCount(prev => prev - 1);
            }, 1000);
        } else if (timerCount === 0) {
            setCanResend(true);
        }
        return () => clearInterval(interval);
    }, [otpStep, timerCount]);

    // HANDLER SEND OTP WA
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
        } catch (err: any) {
            showToast('Terjadi kesalahan koneksi server', 'fa-triangle-exclamation');
        } finally {
            setIsLoading(false);
        }
    };

    // HANDLER VERIFY OTP
    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        const fullOtp = otpDigits.join('');

        if (fullOtp.length < 6) {
            showToast(isEn ? 'Please enter complete 6-digit OTP code' : 'Masukkan 6 digit kode OTP secara lengkap', 'fa-triangle-exclamation');
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch('/api/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phoneWa,
                    otpCode: fullOtp,
                    name
                })
            });

            const result = await res.json();

            if (result.success) {
                showToast(result.message, 'fa-circle-check');
                setTimeout(() => {
                    router.push('/shop');
                }, 1000);
            } else {
                showToast(result.message || 'Kode OTP salah', 'fa-triangle-exclamation');
            }
        } catch (err: any) {
            showToast('Gagal memverifikasi OTP', 'fa-triangle-exclamation');
        } finally {
            setIsLoading(false);
        }
    };

    // HANDLER INPUT DIGIT OTP
    const handleDigitChange = (index: number, val: string) => {
        if (!/^[0-9]?$/.test(val)) return;
        const newDigits = [...otpDigits];
        newDigits[index] = val;
        setOtpDigits(newDigits);

        // Auto move to next input
        if (val && index < 5) {
            inputRefs[index + 1].current?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
            inputRefs[index - 1].current?.focus();
        }
    };

    // HANDLER REGISTER EMAIL TRADISIONAL
    const handleEmailRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    registrationMethod: 'email'
                })
            });

            const result = await res.json();

            if (result.success) {
                showToast(result.message, 'fa-circle-check');
                setTimeout(() => router.push('/shop'), 1000);
            } else {
                showToast(result.message || 'Gagal mendaftar email', 'fa-triangle-exclamation');
            }
        } catch (err) {
            showToast('Gagal memproses pendaftaran', 'fa-triangle-exclamation');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-body">
            <div className="auth-container">
                {/* Back Link Button */}
                <Link href="/shop" className="auth-back-btn">
                    <i className="fa-solid fa-arrow-left"></i>
                    <span>{isEn ? 'Back to Fresh Shop' : 'Kembali ke Toko Kebun'}</span>
                </Link>

                <div className="auth-card">
                    {/* LEFT SHOWCASE SECTION */}
                    <div className="auth-showcase">
                        <div className="auth-showcase-content">
                            <Link href="/" className="brand-logo" style={{ color: '#FFFFFF' }}>
                                <div className="logo-icon">
                                    <i className="fa-solid fa-seedling"></i>
                                </div>
                                <div className="logo-text">
                                    <span className="brand-name" style={{ color: '#FFFFFF' }}>Devsecora</span>
                                    <span className="brand-sub" style={{ color: '#A3B8A5' }}>HYDRO FARM &amp; PRODUCE</span>
                                </div>
                            </Link>

                            <h1 className="showcase-title">
                                {isEn ? 'Join Our Fresh Hydroponic Community' : 'Daftar Akun Kebun Devsecora'}
                            </h1>
                            <p className="showcase-desc">
                                {isEn ? 'Create an account with instant WhatsApp OTP verification to enjoy 15-30 minute express greenhouse delivery.' : 'Daftarkan akun Anda dengan verifikasi OTP WhatsApp serba instan tanpa ribet kata sandi.'}
                            </p>

                            <ul className="auth-benefit-list" style={{ marginBottom: 0 }}>
                                <li>
                                    <i className="fa-solid fa-shield-halved"></i>
                                    <div>
                                        <strong>{isEn ? '100% Chemical Pesticide-Free' : '100% Bebas Pestisida Kimia'}</strong>
                                        <span>{isEn ? 'Safe & non-toxic for your whole family' : 'Diolah steril dari tanaman bebas semprotan kimia'}</span>
                                    </div>
                                </li>
                                <li>
                                    <i className="fa-solid fa-clock"></i>
                                    <div>
                                        <strong>{isEn ? 'Daily Harvested at 05:00 AM' : 'Dipetik Segar Jam 05:00 WIB'}</strong>
                                        <span>{isEn ? 'Peak crispiness & locked-in Vitamin C' : 'Renyah manis alami tanpa rasa pahit'}</span>
                                    </div>
                                </li>
                                <li>
                                    <i className="fa-solid fa-key"></i>
                                    <div>
                                        <strong>{isEn ? 'Secure WhatsApp OTP Login' : 'Verifikasi OTP WhatsApp 6-Digit'}</strong>
                                        <span>{isEn ? 'Instant login like top marketplace apps' : 'Aman, profesional, dan serba instan'}</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* RIGHT FORM BOX SECTION */}
                    <div className="auth-form-box">
                        <div className="auth-form-header">
                            <h2>{isEn ? 'Create Account' : 'Pendaftaran Akun Baru'}</h2>
                            <p>{isEn ? 'Select your preferred sign-up method' : 'Pilih metode pendaftaran instan favorit Anda'}</p>
                        </div>

                        {/* REGISTRATION METHOD SWITCHER */}
                        <div className="social-auth-buttons" style={{ marginBottom: '24px' }}>
                            <button
                                type="button"
                                onClick={() => { setRegMethod('whatsapp'); setOtpStep('INPUT_PHONE'); }}
                                className={`btn-social-auth whatsapp ${regMethod === 'whatsapp' ? 'active' : ''}`}
                                style={{
                                    border: regMethod === 'whatsapp' ? '2px solid #25D366' : '1px solid var(--border-color)',
                                    backgroundColor: regMethod === 'whatsapp' ? '#F0FDF4' : '#FFFFFF'
                                }}
                            >
                                <i className="fa-brands fa-whatsapp" style={{ color: '#25D366', fontSize: '20px' }}></i>
                                <span>{isEn ? 'WhatsApp OTP' : 'OTP WhatsApp (Rekomendasi)'}</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => { setRegMethod('email'); setOtpStep('INPUT_PHONE'); }}
                                className={`btn-social-auth ${regMethod === 'email' ? 'active' : ''}`}
                                style={{
                                    border: regMethod === 'email' ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                                    backgroundColor: regMethod === 'email' ? '#F0FDF4' : '#FFFFFF'
                                }}
                            >
                                <i className="fa-regular fa-envelope" style={{ color: 'var(--primary)', fontSize: '18px' }}></i>
                                <span>{isEn ? 'Email Account' : 'Daftar via Email'}</span>
                            </button>
                        </div>

                        {/* METHOD A: WHATSAPP OTP FLOW */}
                        {regMethod === 'whatsapp' ? (
                            otpStep === 'INPUT_PHONE' ? (
                                /* STEP 1: INPUT NAMA & NOMOR HP WA */
                                <form onSubmit={handleSendOtp} className="auth-form">
                                    <div className="form-group" style={{ marginBottom: '18px' }}>
                                        <label htmlFor="regName" style={{ display: 'block', marginBottom: '6px', fontWeight: 700, fontSize: '13.5px', color: 'var(--dark)' }}>
                                            {isEn ? 'Full Name' : 'Nama Lengkap'} <span style={{ color: '#EF4444' }}>*</span>
                                        </label>
                                        <div className="input-with-icon" style={{ position: 'relative' }}>
                                            <i className="fa-regular fa-user" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)', fontSize: '15px' }}></i>
                                            <input
                                                id="regName"
                                                type="text"
                                                required
                                                placeholder={isEn ? 'e.g. Budi Santoso' : 'Masukkan nama lengkap Anda'}
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="form-control"
                                                style={{ width: '100%', paddingLeft: '44px', height: '46px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '14px' }}
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group" style={{ marginBottom: '24px' }}>
                                        <label htmlFor="regPhone" style={{ display: 'block', marginBottom: '6px', fontWeight: 700, fontSize: '13.5px', color: 'var(--dark)' }}>
                                            {isEn ? 'WhatsApp Phone Number' : 'Nomor WhatsApp Aktif'} <span style={{ color: '#EF4444' }}>*</span>
                                        </label>
                                        <div className="input-with-icon" style={{ position: 'relative' }}>
                                            <i className="fa-brands fa-whatsapp" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#25D366', fontSize: '16px' }}></i>
                                            <input
                                                id="regPhone"
                                                type="tel"
                                                required
                                                placeholder={isEn ? 'e.g. 08123456789' : 'contoh: 08123456789'}
                                                value={phoneWa}
                                                onChange={(e) => setPhoneWa(e.target.value)}
                                                className="form-control"
                                                style={{ width: '100%', paddingLeft: '44px', height: '46px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '14px' }}
                                            />
                                        </div>
                                        <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px', display: 'block' }}>
                                            {isEn ? 'We will send a 6-digit verification OTP code to your WhatsApp.' : 'Kami akan mengirimkan kode verifikasi 6-digit langsung ke pesan WhatsApp Anda.'}
                                        </span>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="btn btn-auth-submit"
                                        style={{ backgroundColor: '#25D366', color: '#FFFFFF', height: '48px', fontSize: '15px', fontWeight: 700, borderRadius: 'var(--radius-md)' }}
                                    >
                                        {isLoading ? (
                                            <span>{isEn ? 'Sending OTP Code...' : 'Mengirimkan Kode OTP...'}</span>
                                        ) : (
                                            <>
                                                <i className="fa-solid fa-paper-plane"></i>
                                                <span>{isEn ? 'Send WhatsApp OTP Code' : 'Kirim Kode OTP WA'}</span>
                                            </>
                                        )}
                                    </button>
                                </form>
                            ) : (
                                /* STEP 2: VERIFIKASI KODE OTP 6-DIGIT */
                                <form onSubmit={handleVerifyOtp} className="auth-form">
                                    <div style={{
                                        backgroundColor: '#F0FDF4',
                                        border: '1px solid #BBF7D0',
                                        borderRadius: 'var(--radius-md)',
                                        padding: '16px',
                                        marginBottom: '20px',
                                        textAlign: 'center'
                                    }}>
                                        <span style={{ fontSize: '13px', color: '#166534', display: 'block', marginBottom: '4px' }}>
                                            {isEn ? '6-Digit OTP Sent to WhatsApp:' : 'Kode OTP 6-Digit telah dikirim ke WhatsApp:'}
                                        </span>
                                        <strong style={{ fontSize: '16px', color: '#15803D' }}>{phoneWa}</strong>

                                        {/* DEMO OTP HIGHLIGHT */}
                                        {demoOtp && (
                                            <div style={{
                                                marginTop: '10px',
                                                padding: '6px 12px',
                                                backgroundColor: '#DCFCE7',
                                                borderRadius: 'var(--radius-sm)',
                                                display: 'inline-block',
                                                fontSize: '13px',
                                                fontWeight: 800,
                                                color: '#166534'
                                            }}>
                                                🔑 Kode OTP WA: {demoOtp.slice(0, 3)}-{demoOtp.slice(3)}
                                            </div>
                                        )}
                                    </div>

                                    <div className="form-group" style={{ marginBottom: '24px' }}>
                                        <label style={{ display: 'block', marginBottom: '10px', fontWeight: 700, fontSize: '14px', color: 'var(--dark)', textAlign: 'center' }}>
                                            {isEn ? 'Enter 6-Digit OTP Verification Code' : 'Masukkan Kode Verifikasi 6-Digit'}
                                        </label>

                                        {/* 6 SEPARATE DIGIT INPUT BOXES */}
                                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                            {otpDigits.map((digit, idx) => (
                                                <input
                                                    key={idx}
                                                    ref={inputRefs[idx]}
                                                    type="text"
                                                    maxLength={1}
                                                    value={digit}
                                                    onChange={(e) => handleDigitChange(idx, e.target.value)}
                                                    onKeyDown={(e) => handleKeyDown(idx, e)}
                                                    style={{
                                                        width: '46px',
                                                        height: '52px',
                                                        textAlign: 'center',
                                                        fontSize: '22px',
                                                        fontWeight: 800,
                                                        borderRadius: 'var(--radius-md)',
                                                        border: digit ? '2px solid #25D366' : '1.5px solid var(--border-color)',
                                                        backgroundColor: digit ? '#F0FDF4' : '#FFFFFF',
                                                        color: 'var(--dark)',
                                                        outline: 'none',
                                                        transition: 'all 0.2s ease'
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="btn btn-auth-submit"
                                        style={{ backgroundColor: '#25D366', color: '#FFFFFF', height: '48px', fontSize: '15px', fontWeight: 700, borderRadius: 'var(--radius-md)' }}
                                    >
                                        {isLoading ? (
                                            <span>{isEn ? 'Verifying OTP...' : 'Memverifikasi OTP...'}</span>
                                        ) : (
                                            <>
                                                <i className="fa-solid fa-shield-check"></i>
                                                <span>{isEn ? 'Verify OTP & Login' : 'Verifikasi Kode OTP & Masuk'}</span>
                                            </>
                                        )}
                                    </button>

                                    {/* RESEND TIMER & CHANGE NUMBER */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', fontSize: '13px' }}>
                                        <button
                                            type="button"
                                            onClick={() => setOtpStep('INPUT_PHONE')}
                                            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', textDecoration: 'underline' }}
                                        >
                                            {isEn ? '← Change Phone Number' : '← Ubah Nomor WA'}
                                        </button>

                                        {canResend ? (
                                            <button
                                                type="button"
                                                onClick={handleSendOtp}
                                                style={{ background: 'none', border: 'none', color: '#25D366', fontWeight: 700, cursor: 'pointer' }}
                                            >
                                                {isEn ? 'Resend OTP' : 'Kirim Ulang OTP'}
                                            </button>
                                        ) : (
                                            <span style={{ color: 'var(--text-muted)' }}>
                                                {isEn ? `Resend in ${timerCount}s` : `Kirim ulang (${timerCount}s)`}
                                            </span>
                                        )}
                                    </div>
                                </form>
                            )
                        ) : (
                            /* METHOD B: EMAIL REGISTER TRADISIONAL */
                            <form onSubmit={handleEmailRegister} className="auth-form">
                                <div className="form-group" style={{ marginBottom: '18px' }}>
                                    <label htmlFor="regName" style={{ display: 'block', marginBottom: '6px', fontWeight: 700, fontSize: '13.5px', color: 'var(--dark)' }}>
                                        {isEn ? 'Full Name' : 'Nama Lengkap'} <span style={{ color: '#EF4444' }}>*</span>
                                    </label>
                                    <div className="input-with-icon" style={{ position: 'relative' }}>
                                        <i className="fa-regular fa-user" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)', fontSize: '15px' }}></i>
                                        <input
                                            id="regName"
                                            type="text"
                                            required
                                            placeholder={isEn ? 'e.g. Budi Santoso' : 'Masukkan nama lengkap Anda'}
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="form-control"
                                            style={{ width: '100%', paddingLeft: '44px', height: '46px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '14px' }}
                                        />
                                    </div>
                                </div>

                                <div className="form-group" style={{ marginBottom: '18px' }}>
                                    <label htmlFor="regEmail" style={{ display: 'block', marginBottom: '6px', fontWeight: 700, fontSize: '13.5px', color: 'var(--dark)' }}>
                                        Email Address <span style={{ color: '#EF4444' }}>*</span>
                                    </label>
                                    <div className="input-with-icon" style={{ position: 'relative' }}>
                                        <i className="fa-regular fa-envelope" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)', fontSize: '15px' }}></i>
                                        <input
                                            id="regEmail"
                                            type="email"
                                            required
                                            placeholder="budi@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="form-control"
                                            style={{ width: '100%', paddingLeft: '44px', height: '46px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '14px' }}
                                        />
                                    </div>
                                </div>

                                <div className="form-group" style={{ marginBottom: '22px' }}>
                                    <label htmlFor="regPassword" style={{ display: 'block', marginBottom: '6px', fontWeight: 700, fontSize: '13.5px', color: 'var(--dark)' }}>
                                        Password <span style={{ color: '#EF4444' }}>*</span>
                                    </label>
                                    <div className="input-with-icon" style={{ position: 'relative' }}>
                                        <i className="fa-solid fa-lock" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)', fontSize: '15px' }}></i>
                                        <input
                                            id="regPassword"
                                            type="password"
                                            required
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="form-control"
                                            style={{ width: '100%', paddingLeft: '44px', height: '46px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '14px' }}
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="btn btn-auth-submit"
                                    style={{ backgroundColor: 'var(--primary)', color: '#FFFFFF', height: '48px', fontSize: '15px', fontWeight: 700, borderRadius: 'var(--radius-md)' }}
                                >
                                    {isLoading ? (
                                        <span>{isEn ? 'Processing...' : 'Memproses Pendaftaran...'}</span>
                                    ) : (
                                        <>
                                            <i className="fa-solid fa-user-plus"></i>
                                            <span>{isEn ? 'Create Email Account' : 'Daftar Akun Email'}</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        )}

                        <div className="auth-form-footer" style={{ marginTop: '24px', textAlign: 'center' }}>
                            <p style={{ fontSize: '13.5px', color: 'var(--text-muted)' }}>
                                {isEn ? 'Already have an account?' : 'Sudah memiliki akun kebun?'}{' '}
                                <Link href="/login" className="auth-link" style={{ color: 'var(--primary)', fontWeight: 700 }}>
                                    {isEn ? 'Login Here' : 'Masuk / Login Di Sini'}
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
