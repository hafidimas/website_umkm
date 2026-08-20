'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
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

    // REDIRECT AFTER LOGIN
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

    // HANDLER SEND OTP WA FOR LOGIN
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
        } catch (err: any) {
            showToast('Terjadi kesalahan koneksi server', 'fa-triangle-exclamation');
        } finally {
            setIsLoading(false);
        }
    };

    // HANDLER VERIFY OTP FOR LOGIN
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
                    otpCode: fullOtp
                })
            });

            const result = await res.json();

            if (result.success) {
                handleLoginSuccess();
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

        if (val && index < 5) {
            inputRefs[index + 1].current?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
            inputRefs[index - 1].current?.focus();
        }
    };

    // HANDLER EMAIL LOGIN TRADISIONAL
    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 600));
            handleLoginSuccess();
        } catch (err) {
            showToast('Gagal masuk ke akun', 'fa-triangle-exclamation');
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
                                {isEn ? 'Welcome Back to Devsecora Farm' : 'Masuk ke Akun Kebun Devsecora'}
                            </h1>
                            <p className="showcase-desc">
                                {isEn ? 'Log in using instant 6-digit WhatsApp OTP verification to manage your fresh produce orders.' : 'Masuk ke akun Anda menggunakan verifikasi OTP WhatsApp 6-digit serba cepat dan aman.'}
                            </p>

                            <ul className="auth-benefit-list" style={{ marginBottom: 0 }}>
                                <li>
                                    <i className="fa-solid fa-basket-shopping"></i>
                                    <div>
                                        <strong>{isEn ? 'Fast & Easy Checkout' : 'Proses Belanja Kilat'}</strong>
                                        <span>{isEn ? 'Saved addresses & instant WhatsApp ordering' : 'Alamat tersimpan & pemesanan instan'}</span>
                                    </div>
                                </li>
                                <li>
                                    <i className="fa-solid fa-receipt"></i>
                                    <div>
                                        <strong>{isEn ? 'Digital Invoice & Order Tracking' : 'Lacak Pengiriman Express'}</strong>
                                        <span>{isEn ? 'Track 15-30 minute greenhouse delivery' : 'Pantau posisi kurir pengantar sayur'}</span>
                                    </div>
                                </li>
                                <li>
                                    <i className="fa-solid fa-key"></i>
                                    <div>
                                        <strong>{isEn ? 'WhatsApp OTP Verification' : 'Kode OTP WA 6-Digit'}</strong>
                                        <span>{isEn ? 'Instant login like top marketplace apps' : 'Aman & profesional tanpa kata sandi'}</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* RIGHT FORM BOX SECTION */}
                    <div className="auth-form-box">
                        <div className="auth-form-header">
                            <h2>{isEn ? 'Account Login' : 'Masuk / Login'}</h2>
                            <p>{isEn ? 'Select your preferred login method' : 'Pilih metode masuk akun Anda'}</p>
                        </div>

                        {/* LOGIN METHOD SWITCHER TABS */}
                        <div className="social-auth-buttons" style={{ marginBottom: '24px' }}>
                            <button
                                type="button"
                                className={`btn-social-auth ${loginMethod === 'whatsapp' ? 'active' : ''}`}
                                onClick={() => { setLoginMethod('whatsapp'); setOtpStep('INPUT_PHONE'); }}
                                style={{
                                    border: loginMethod === 'whatsapp' ? '2px solid #25D366' : '1px solid var(--border-color)',
                                    backgroundColor: loginMethod === 'whatsapp' ? '#F0FDF4' : '#FFFFFF',
                                    color: loginMethod === 'whatsapp' ? '#25D366' : 'var(--dark)',
                                    fontWeight: 700
                                }}
                            >
                                <i className="fa-brands fa-whatsapp" style={{ fontSize: '18px', color: '#25D366' }}></i>
                                <span>WhatsApp Fast OTP</span>
                            </button>

                            <button
                                type="button"
                                className={`btn-social-auth ${loginMethod === 'email' ? 'active' : ''}`}
                                onClick={() => setLoginMethod('email')}
                                style={{
                                    border: loginMethod === 'email' ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                                    backgroundColor: loginMethod === 'email' ? '#F0FDF4' : '#FFFFFF',
                                    color: loginMethod === 'email' ? 'var(--primary)' : 'var(--dark)',
                                    fontWeight: 700
                                }}
                            >
                                <i className="fa-solid fa-envelope" style={{ fontSize: '16px', color: 'var(--primary)' }}></i>
                                <span>Email / Password</span>
                            </button>
                        </div>

                        {loginMethod === 'whatsapp' ? (
                            otpStep === 'INPUT_PHONE' ? (
                                <form onSubmit={handleSendOtp} className="auth-form">
                                    <div className="form-group">
                                        <label htmlFor="phoneWa">
                                            {isEn ? 'WhatsApp Phone Number' : 'Nomor WhatsApp Aktif'} <span style={{ color: '#EF4444' }}>*</span>
                                        </label>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <span style={{ padding: '12px 14px', backgroundColor: '#F1F5F9', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', fontSize: '14px', fontWeight: 700, color: 'var(--dark)' }}>
                                                +62
                                            </span>
                                            <input
                                                type="tel"
                                                id="phoneWa"
                                                required
                                                placeholder="81234567890"
                                                value={phoneWa}
                                                onChange={(e) => setPhoneWa(e.target.value.replace(/[^0-9]/g, ''))}
                                                className="form-control"
                                                style={{ flex: 1 }}
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="btn btn-block"
                                        style={{
                                            backgroundColor: '#25D366',
                                            color: '#FFFFFF',
                                            padding: '14px',
                                            fontSize: '15px',
                                            fontWeight: 800,
                                            borderRadius: 'var(--radius-md)',
                                            border: 'none',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '8px',
                                            marginTop: '10px'
                                        }}
                                    >
                                        {isLoading ? (
                                            <span>Mengirim Kode OTP...</span>
                                        ) : (
                                            <>
                                                <i className="fa-brands fa-whatsapp" style={{ fontSize: '18px' }}></i>
                                                <span>Kirim Kode OTP WhatsApp</span>
                                            </>
                                        )}
                                    </button>
                                </form>
                            ) : (
                                <form onSubmit={handleVerifyOtp} className="auth-form">
                                    <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                                        <span style={{ fontSize: '13.5px', color: 'var(--text-muted)' }}>
                                            Kode 6 digit OTP dikirim ke <strong>+62{phoneWa}</strong>
                                        </span>

                                        {demoOtp && (
                                            <div style={{
                                                marginTop: '10px',
                                                padding: '10px 14px',
                                                backgroundColor: '#FEF3C7',
                                                border: '1.5px dashed #F59E0B',
                                                borderRadius: 'var(--radius-md)',
                                                color: '#92400E',
                                                fontSize: '13px'
                                            }}>
                                                💡 <strong>Simulasi OTP Demo:</strong> Kode OTP Anda adalah <strong>{demoOtp}</strong>
                                            </div>
                                        )}
                                    </div>

                                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '20px' }}>
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
                                                    fontSize: '20px',
                                                    fontWeight: 800,
                                                    borderRadius: 'var(--radius-md)',
                                                    border: digit ? '2px solid #25D366' : '1px solid var(--border-color)',
                                                    backgroundColor: digit ? '#F0FDF4' : '#FFFFFF'
                                                }}
                                            />
                                        ))}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="btn btn-block"
                                        style={{
                                            backgroundColor: '#25D366',
                                            color: '#FFFFFF',
                                            padding: '14px',
                                            fontSize: '15px',
                                            fontWeight: 800,
                                            borderRadius: 'var(--radius-md)',
                                            border: 'none',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '8px'
                                        }}
                                    >
                                        {isLoading ? <span>Memverifikasi...</span> : <span>Verifikasi &amp; Masuk</span>}
                                    </button>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginTop: '14px' }}>
                                        <button
                                            type="button"
                                            onClick={() => setOtpStep('INPUT_PHONE')}
                                            style={{ border: 'none', background: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }}
                                        >
                                            Ganti Nomor WA
                                        </button>

                                        <button
                                            type="button"
                                            disabled={!canResend}
                                            onClick={() => handleSendOtp()}
                                            style={{ border: 'none', background: 'none', color: canResend ? '#25D366' : 'var(--text-muted)', cursor: canResend ? 'pointer' : 'not-allowed', fontWeight: 600 }}
                                        >
                                            {canResend ? 'Kirim Ulang OTP' : `Kirim Ulang (${timerCount}s)`}
                                        </button>
                                    </div>
                                </form>
                            )
                        ) : (
                            <form onSubmit={handleEmailLogin} className="auth-form">
                                <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        required
                                        placeholder="nama@gmail.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="form-control"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="password">Password</label>
                                    <input
                                        type="password"
                                        id="password"
                                        required
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="form-control"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="btn btn-primary btn-block"
                                    style={{ padding: '14px', fontSize: '15px', fontWeight: 800 }}
                                >
                                    {isLoading ? <span>Memproses...</span> : <span>Masuk Akun</span>}
                                </button>
                            </form>
                        )}

                        {/* FOOTER REGISTER PROMPT */}
                        <div className="auth-form-footer" style={{ marginTop: '24px', textAlign: 'center' }}>
                            <p style={{ fontSize: '13.5px', color: 'var(--text-muted)' }}>
                                {isEn ? 'Dont have an account yet?' : 'Belum memiliki akun kebun?'}{' '}
                                <Link href="/register" style={{ color: 'var(--primary)', fontWeight: 700 }}>
                                    {isEn ? 'Register Free' : 'Daftar Akun Baru'}
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
                <div style={{ textAlign: 'center', color: 'var(--primary)', fontSize: '16px', fontWeight: 700 }}>
                    <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '28px', marginBottom: '12px' }}></i>
                    <p>Memuat Halaman Login...</p>
                </div>
            </div>
        }>
            <LoginFormInner />
        </Suspense>
    );
}
