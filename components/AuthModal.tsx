'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useShop } from '../context/ShopContext';

export const AuthModal: React.FC = () => {
    const {
        isAuthModalOpen,
        closeAuthModal,
        authReason,
        loginUser,
        showToast,
        language
    } = useShop();

    const isEn = language === 'en';

    const [loginMethod, setLoginMethod] = useState<'whatsapp' | 'email'>('whatsapp');
    const [name, setName] = useState('');
    const [phoneWa, setPhoneWa] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // OTP STATES
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
            interval = setInterval(() => {
                setTimerCount(prev => prev - 1);
            }, 1000);
        } else if (timerCount === 0) {
            setCanResend(true);
        }
        return () => clearInterval(interval);
    }, [otpStep, timerCount]);

    if (!isAuthModalOpen) return null;

    // REASON HEADER CONTENT
    const getReasonHeader = () => {
        if (authReason === 'CART') {
            return {
                icon: 'fa-basket-shopping',
                color: '#166534',
                title: isEn ? 'Login Required to Shop Vegetables' : 'Login Terlebih Dahulu Untuk Belanja Sayuran',
                desc: isEn ? 'Please log in to add fresh hydroponic produce to your cart and proceed to checkout.' : 'Silakan login terlebih dahulu untuk menambah sayuran segar ke keranjang belanja Anda.'
            };
        }
        if (authReason === 'RECIPES') {
            return {
                icon: 'fa-utensils',
                color: '#D97706',
                title: isEn ? 'Login Required to Access Recipes' : 'Login Terlebih Dahulu Untuk Melihat Resep',
                desc: isEn ? 'Please log in to view complete Indonesian culinary recipes and nutrition guides.' : 'Silakan login terlebih dahulu untuk melihat seluruh resep masakan khas Indonesia & artikel nutrisi.'
            };
        }
        if (authReason === 'WISHLIST') {
            return {
                icon: 'fa-heart',
                color: '#DC2626',
                title: isEn ? 'Login Required to Save Wishlist' : 'Login Terlebih Dahulu Untuk Menambah Wishlist',
                desc: isEn ? 'Please log in to save your favorite vegetables into your personal wishlist.' : 'Silakan login terlebih dahulu untuk menyimpan produk sayur favorit Anda ke daftar wishlist.'
            };
        }
        return {
            icon: 'fa-user-lock',
            color: 'var(--primary)',
            title: isEn ? 'Welcome to Devsecora Hydro Farm' : 'Masuk / Daftar Akun Kebun Devsecora',
            desc: isEn ? 'Log in or create an account to enjoy easy shopping & healthy recipes.' : 'Masuk atau buat akun baru untuk pengalaman belanja sayur segar & resep masakan.'
        };
    };

    const reasonInfo = getReasonHeader();

    // HANDLER SEND OTP WA
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

    // HANDLER VERIFY OTP WA
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
                const loggedInName = name.trim() || `Pelanggan WA (${phoneWa.slice(-4)})`;
                loginUser({
                    name: loggedInName,
                    phoneWa: phoneWa
                });
            } else {
                showToast(result.message || 'Kode OTP salah', 'fa-triangle-exclamation');
            }
        } catch (err: any) {
            showToast('Gagal memverifikasi OTP', 'fa-triangle-exclamation');
        } finally {
            setIsLoading(false);
        }
    };

    // HANDLER EMAIL LOGIN
    const handleEmailLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            showToast(isEn ? 'Please enter email and password' : 'Lengkapi Email dan Password Anda', 'fa-triangle-exclamation');
            return;
        }

        setIsLoading(true);
        setTimeout(() => {
            const userName = name.trim() || email.split('@')[0];
            loginUser({
                name: userName,
                email: email
            });
            setIsLoading(false);
        }, 600);
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

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(5px)',
            zIndex: 999999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
        }}>
            <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-xl)',
                width: '100%',
                maxWidth: '480px',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-xl)',
                animation: 'modalSlideUp 0.3s ease-out'
            }}>
                {/* MODAL HEADER */}
                <div style={{
                    padding: '24px 24px 20px',
                    textAlign: 'center',
                    borderBottom: '1px solid var(--border-light)',
                    position: 'relative',
                    backgroundColor: '#F8FAFC'
                }}>
                    <button
                        type="button"
                        onClick={closeAuthModal}
                        style={{
                            position: 'absolute',
                            top: '16px',
                            right: '16px',
                            border: 'none',
                            background: 'none',
                            fontSize: '20px',
                            color: 'var(--text-muted)',
                            cursor: 'pointer'
                        }}
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>

                    <div style={{
                        width: '54px',
                        height: '54px',
                        borderRadius: '50%',
                        backgroundColor: '#F0FDF4',
                        color: reasonInfo.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '24px',
                        margin: '0 auto 12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
                    }}>
                        <i className={`fa-solid ${reasonInfo.icon}`}></i>
                    </div>

                    <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--dark)', marginBottom: '6px' }}>
                        {reasonInfo.title}
                    </h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
                        {reasonInfo.desc}
                    </p>
                </div>

                {/* LOGIN TABS SWITCHER */}
                <div style={{ display: 'flex', borderBottom: '1px solid var(--border-light)', backgroundColor: '#FFFFFF' }}>
                    <button
                        type="button"
                        onClick={() => { setLoginMethod('whatsapp'); setOtpStep('INPUT_PHONE'); }}
                        style={{
                            flex: 1,
                            padding: '12px',
                            border: 'none',
                            background: 'none',
                            fontSize: '13.5px',
                            fontWeight: 700,
                            color: loginMethod === 'whatsapp' ? '#25D366' : 'var(--text-muted)',
                            borderBottom: loginMethod === 'whatsapp' ? '3px solid #25D366' : 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px'
                        }}
                    >
                        <i className="fa-brands fa-whatsapp" style={{ fontSize: '16px' }}></i>
                        <span>WhatsApp Fast OTP</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setLoginMethod('email')}
                        style={{
                            flex: 1,
                            padding: '12px',
                            border: 'none',
                            background: 'none',
                            fontSize: '13.5px',
                            fontWeight: 700,
                            color: loginMethod === 'email' ? 'var(--primary)' : 'var(--text-muted)',
                            borderBottom: loginMethod === 'email' ? '3px solid var(--primary)' : 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px'
                        }}
                    >
                        <i className="fa-solid fa-envelope"></i>
                        <span>Email / Password</span>
                    </button>
                </div>

                {/* MODAL BODY FORM */}
                <div style={{ padding: '24px' }}>
                    {loginMethod === 'whatsapp' ? (
                        otpStep === 'INPUT_PHONE' ? (
                            <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--dark)', marginBottom: '6px' }}>
                                        {isEn ? 'Your Name' : 'Nama Lengkap Anda'} <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>(Opsional)</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder={isEn ? 'e.g. Ibu Ratna' : 'contoh: Ibu Ratna'}
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        style={{ width: '100%', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '14px' }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--dark)', marginBottom: '6px' }}>
                                        {isEn ? 'Active WhatsApp Number' : 'Nomor WhatsApp Aktif'} <span style={{ color: '#EF4444' }}>*</span>
                                    </label>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <span style={{ padding: '12px 14px', backgroundColor: '#F1F5F9', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', fontSize: '14px', fontWeight: 700, color: 'var(--dark)' }}>
                                            +62
                                        </span>
                                        <input
                                            type="tel"
                                            required
                                            placeholder="81234567890"
                                            value={phoneWa}
                                            onChange={(e) => setPhoneWa(e.target.value.replace(/[^0-9]/g, ''))}
                                            style={{ flex: 1, padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '14px' }}
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="btn"
                                    style={{
                                        backgroundColor: '#25D366',
                                        color: '#FFFFFF',
                                        padding: '14px',
                                        fontSize: '14.5px',
                                        fontWeight: 800,
                                        borderRadius: 'var(--radius-md)',
                                        border: 'none',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px',
                                        marginTop: '6px'
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
                            /* OTP VERIFICATION STEP */
                            <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                                <div style={{ textAlign: 'center' }}>
                                    <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                                        Kode 6 digit OTP dikirim ke <strong>+62{phoneWa}</strong>
                                    </span>

                                    {/* DEMO OTP BANNER */}
                                    {demoOtp && (
                                        <div style={{
                                            margin: '12px 0',
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
                                                width: '44px',
                                                height: '50px',
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
                                    className="btn"
                                    style={{
                                        backgroundColor: '#25D366',
                                        color: '#FFFFFF',
                                        padding: '14px',
                                        fontSize: '14.5px',
                                        fontWeight: 800,
                                        borderRadius: 'var(--radius-md)',
                                        border: 'none',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px'
                                    }}
                                >
                                    {isLoading ? <span>Memverifikasi...</span> : <span>Verifikasi &amp; Masuk</span>}
                                </button>

                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', color: 'var(--text-muted)' }}>
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
                        /* EMAIL LOGIN FORM */
                        <form onSubmit={handleEmailLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--dark)', marginBottom: '6px' }}>
                                    {isEn ? 'Your Name' : 'Nama Lengkap'} <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>(Opsional)</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder={isEn ? 'e.g. Budi Santoso' : 'contoh: Budi Santoso'}
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    style={{ width: '100%', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '14px' }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--dark)', marginBottom: '6px' }}>
                                    Email <span style={{ color: '#EF4444' }}>*</span>
                                </label>
                                <input
                                    type="email"
                                    required
                                    placeholder="nama@gmail.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    style={{ width: '100%', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '14px' }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--dark)', marginBottom: '6px' }}>
                                    Password <span style={{ color: '#EF4444' }}>*</span>
                                </label>
                                <input
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    style={{ width: '100%', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '14px' }}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="btn btn-primary"
                                style={{
                                    padding: '14px',
                                    fontSize: '14.5px',
                                    fontWeight: 800,
                                    borderRadius: 'var(--radius-md)',
                                    marginTop: '6px'
                                }}
                            >
                                {isLoading ? <span>Proses Masuk...</span> : <span>Masuk Akun</span>}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};
