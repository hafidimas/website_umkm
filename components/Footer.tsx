'use client';

import React from 'react';
import Link from 'next/link';
import { useShop } from '../context/ShopContext';

export const Footer: React.FC = () => {
    const { t, language } = useShop();
    const isEn = language === 'en';

    return (
        <footer className="main-footer">
            <div className="container footer-container" style={{ gridTemplateColumns: '1.8fr 1.6fr 1fr 1fr', gap: '32px' }}>
                {/* BRAND & ABOUT COL */}
                <div className="footer-col brand-col">
                    <Link href="/" className="brand-logo footer-logo">
                        <div className="logo-icon">
                            <i className="fa-solid fa-seedling"></i>
                        </div>
                        <div className="logo-text">
                            <span className="brand-name white-text">Devsecora</span>
                            <span className="brand-sub">HYDRO FARM &amp; PRODUCE</span>
                        </div>
                    </Link>
                    <p className="footer-desc" style={{ fontSize: '13px', lineHeight: '1.6', marginBottom: '16px' }}>
                        {t('footer_desc')}
                    </p>

                    {/* SOSMED ICONS (SEMUA BERWARNA HIJAU BRAND) */}
                    <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                        <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer" style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }} title="WhatsApp Admin">
                            <i className="fa-brands fa-whatsapp"></i>
                        </a>
                        <a href="#" style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }} title="Instagram">
                            <i className="fa-brands fa-instagram"></i>
                        </a>
                        <a href="#" style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }} title="TikTok">
                            <i className="fa-brands fa-tiktok"></i>
                        </a>
                        <a href="#" style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }} title="YouTube">
                            <i className="fa-brands fa-youtube"></i>
                        </a>
                    </div>
                </div>

                {/* FARM LOCATION & CONTACT INFO COL */}
                <div className="footer-col">
                    <h4 style={{ color: '#FFFFFF', fontSize: '15px', fontWeight: 700, marginBottom: '16px' }}>
                        <i className="fa-solid fa-house-chimney-crack" style={{ color: 'var(--primary)', marginRight: '8px' }}></i>
                        {isEn ? 'Devsecora Farm Info' : 'Informasi & Lokasi Kebun'}
                    </h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', color: '#A3B8A5' }}>
                        <li style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                            <i className="fa-solid fa-location-dot" style={{ color: 'var(--primary)', marginTop: '3px', fontSize: '14px' }}></i>
                            <div>
                                <strong style={{ color: '#FFFFFF', display: 'block' }}>{isEn ? 'Greenhouse Farm Address:' : 'Alamat Green House Utama:'}</strong>
                                <span>Jl. Raya Cipocok Jaya No. 45, Kec. Cipocok Jaya, Kota Serang, Banten 42121</span>
                            </div>
                        </li>
                        <li style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <i className="fa-brands fa-whatsapp" style={{ color: 'var(--primary)', fontSize: '15px' }}></i>
                            <div>
                                <strong style={{ color: '#FFFFFF', display: 'inline', marginRight: '6px' }}>WhatsApp Admin:</strong>
                                <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer" style={{ color: '#A3B8A5', textDecoration: 'underline' }}>+62 812-3456-7890</a>
                            </div>
                        </li>
                        <li style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <i className="fa-regular fa-envelope" style={{ color: 'var(--primary)', fontSize: '14px' }}></i>
                            <div>
                                <strong style={{ color: '#FFFFFF', display: 'inline', marginRight: '6px' }}>Email Kebun:</strong>
                                <span>info@devsecorafarm.com</span>
                            </div>
                        </li>
                        <li style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                            <i className="fa-regular fa-clock" style={{ color: 'var(--primary)', marginTop: '3px', fontSize: '14px' }}></i>
                            <div>
                                <strong style={{ color: '#FFFFFF', display: 'block' }}>{isEn ? 'Operating Hours:' : 'Jam Operasional:'}</strong>
                                <span>{isEn ? 'Mon - Sat: 05:00 AM - 05:00 PM WIB' : 'Senin - Sabtu: 05:00 - 17:00 WIB'}</span>
                            </div>
                        </li>
                    </ul>
                </div>

                {/* CATEGORIES COL */}
                <div className="footer-col">
                    <h4 style={{ color: '#FFFFFF', fontSize: '15px', fontWeight: 700, marginBottom: '16px' }}>{t('footer_categories')}</h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                        <li><Link href="/shop?cat=leafy" style={{ color: '#A3B8A5' }}>{t('dropdown_leafy')}</Link></li>
                        <li><Link href="/shop?cat=fruits" style={{ color: '#A3B8A5' }}>{t('dropdown_fruits')}</Link></li>
                        <li><Link href="/shop?cat=herbs" style={{ color: '#A3B8A5' }}>{t('dropdown_herbs')}</Link></li>
                        <li><Link href="/shop?cat=mushrooms" style={{ color: '#A3B8A5' }}>{t('dropdown_mushrooms')}</Link></li>
                        <li><Link href="/shop?cat=kits" style={{ color: '#A3B8A5' }}>{t('dropdown_kits')}</Link></li>
                    </ul>
                </div>

                {/* SERVICES COL */}
                <div className="footer-col">
                    <h4 style={{ color: '#FFFFFF', fontSize: '15px', fontWeight: 700, marginBottom: '16px' }}>{t('footer_services')}</h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                        <li><Link href="/why-us" style={{ color: '#A3B8A5' }}>{t('footer_guarantee')}</Link></li>
                        <li><Link href="/recipes" style={{ color: '#A3B8A5' }}>{t('footer_subscription')}</Link></li>
                        <li><Link href="/why-us" style={{ color: '#A3B8A5' }}>{t('footer_consulting')}</Link></li>
                        <li><Link href="/categories" style={{ color: '#A3B8A5' }}>{isEn ? 'Smart Hydroponic Tech' : 'Teknologi Hidroponik Digital'}</Link></li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                <div className="container footer-bottom-content">
                    <p>&copy; 2026 <strong>Devsecora Hydroponics Farm</strong> (Cipocok, Serang, Banten). {t('footer_rights')}</p>
                </div>
            </div>
        </footer>
    );
};
