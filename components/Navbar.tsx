'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useShop, CurrencyType, LanguageType } from '../context/ShopContext';

export const Navbar: React.FC = () => {
    const pathname = usePathname();
    const {
        cart,
        wishlist,
        setIsCartOpen,
        currency,
        language,
        theme,
        toggleTheme,
        setCurrency,
        setLanguage,
        formatPrice,
        t,

        // Auth Context
        user,
        isLoggedIn,
        logoutUser,
        openAuthModal,
        requireAuth
    } = useShop();

    const totalCartQty = cart.reduce((sum, item) => sum + item.qty, 0);
    const cartSubtotal = cart.reduce((sum, item) => sum + (item.product.price * item.qty), 0);

    return (
        <>
            {/* 1. MAIN HEADER */}
            <header className="main-header">
                <div className="container header-container">
                    {/* Mobile Menu Toggle Button */}
                    <button
                        type="button"
                        className="btn-mobile-toggle"
                        onClick={() => {}}
                        aria-label="Buka Menu"
                    >
                        <i className="fa-solid fa-bars"></i>
                    </button>

                    {/* Brand Logo */}
                    <Link href="/" className="brand-logo">
                        <div className="logo-icon">
                            <i className="fa-solid fa-seedling"></i>
                        </div>
                        <div className="logo-text">
                            <span className="brand-name">Devsecora</span>
                            <span className="brand-sub">HYDRO FARM &amp; PRODUCE</span>
                        </div>
                    </Link>

                    {/* Search Bar */}
                    <div className="header-search">
                        <select className="search-category" id="searchCategory" aria-label="Kategori Pencarian">
                            <option value="all">{t('all_categories')}</option>
                            <option value="leafy">{t('leafy')}</option>
                            <option value="fruits">{t('fruits')}</option>
                            <option value="herbs">{t('herbs')}</option>
                            <option value="kits">{t('kits')}</option>
                        </select>
                        <div className="search-input-wrap">
                            <input
                                type="text"
                                id="searchInput"
                                placeholder={t('search_placeholder')}
                                autoComplete="off"
                            />
                            <button type="button" className="btn-search" aria-label="Cari Produk">
                                <i className="fa-solid fa-magnifying-glass"></i>
                            </button>
                        </div>
                    </div>

                    {/* Header Actions */}
                    <div className="header-actions">
                        {isLoggedIn ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', backgroundColor: '#F0FDF4', borderRadius: 'var(--radius-full)', border: '1px solid #BBF7D0' }}>
                                <i className="fa-solid fa-circle-user" style={{ color: 'var(--primary)', fontSize: '18px' }}></i>
                                <span style={{ fontSize: '12.5px', fontWeight: 800, color: 'var(--dark)' }}>
                                    Halo, {user?.name ? user.name.split(' ')[0] : 'Member'}
                                </span>
                                <button
                                    type="button"
                                    onClick={logoutUser}
                                    title="Keluar / Logout"
                                    style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#DC2626', fontSize: '13px', marginLeft: '4px' }}
                                >
                                    <i className="fa-solid fa-right-from-bracket"></i>
                                </button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                className="action-btn"
                                onClick={() => openAuthModal('GENERAL')}
                                title={t('register_login')}
                            >
                                <i className="fa-regular fa-user"></i>
                                <span className="action-label">{t('register_login')}</span>
                            </button>
                        )}

                        <button
                            type="button"
                            className="action-btn"
                            onClick={() => requireAuth('WISHLIST')}
                            title={t('wishlist')}
                        >
                            <i className="fa-regular fa-heart"></i>
                            {isLoggedIn && wishlist.length > 0 && (
                                <span className="badge badge-wishlist">{wishlist.length}</span>
                            )}
                            <span className="action-label">{t('wishlist')}</span>
                        </button>

                        <button
                            type="button"
                            className="action-btn btn-cart-trigger"
                            onClick={() => {
                                if (requireAuth('CART')) {
                                    setIsCartOpen(true);
                                }
                            }}
                            title={t('cart')}
                        >
                            <div className="cart-icon-wrap">
                                <i className="fa-solid fa-basket-shopping"></i>
                                {isLoggedIn && totalCartQty > 0 && (
                                    <span className="badge badge-cart">{totalCartQty}</span>
                                )}
                            </div>
                            <div className="cart-summary">
                                <span className="cart-text">{t('cart')}</span>
                                {isLoggedIn && totalCartQty > 0 && (
                                    <span className="cart-total">{formatPrice(cartSubtotal)}</span>
                                )}
                            </div>
                        </button>
                    </div>
                </div>
            </header>

            {/* 2. NAVIGATION MENU */}
            <nav className="nav-menu-bar">
                <div className="container nav-container">
                    <ul className="nav-links">
                        <li>
                            <Link href="/" className={pathname === '/' ? 'active' : ''}>{t('nav_home')}</Link>
                        </li>
                        <li className="dropdown">
                            <Link href="/shop" className={pathname === '/shop' ? 'active' : ''}>
                                {t('nav_shop')} <i className="fa-solid fa-chevron-down nav-arrow"></i>
                            </Link>
                            <ul className="dropdown-menu">
                                <li><Link href="/shop">{t('dropdown_all_veg')}</Link></li>
                                <li><Link href="/shop?cat=leafy">{t('dropdown_leafy')}</Link></li>
                                <li><Link href="/shop?cat=fruits">{t('dropdown_fruits')}</Link></li>
                                <li><Link href="/shop?cat=herbs">{t('dropdown_herbs')}</Link></li>
                                <li><Link href="/shop?cat=kits">{t('dropdown_kits')}</Link></li>
                            </ul>
                        </li>
                        <li className="dropdown">
                            <Link href="/categories" className={pathname === '/categories' ? 'active' : ''}>
                                {t('nav_categories')} <i className="fa-solid fa-chevron-down nav-arrow"></i>
                            </Link>
                            <ul className="dropdown-menu">
                                <li><Link href="/categories">{t('dropdown_all_cat')}</Link></li>
                                <li><Link href="/shop?cat=leafy">{t('dropdown_leafy')}</Link></li>
                                <li><Link href="/shop?cat=fruits">{t('dropdown_fruits')}</Link></li>
                                <li><Link href="/shop?cat=herbs">{t('dropdown_herbs')}</Link></li>
                                <li><Link href="/shop?cat=mushrooms">{t('dropdown_mushrooms')}</Link></li>
                                <li><Link href="/shop?cat=kits">{t('dropdown_kits')}</Link></li>
                            </ul>
                        </li>
                        <li><Link href="/why-us" className={pathname === '/why-us' ? 'active' : ''}>{t('nav_why_us')}</Link></li>
                        <li>
                            <Link href="/recipes" className={pathname === '/recipes' ? 'active' : ''}>
                                {t('nav_recipes')}
                            </Link>
                        </li>
                    </ul>

                    {/* NAV RIGHT GROUP - CLEANED & FUNCTIONAL */}
                    <div className="nav-right-group">
                        <div className="nav-selectors">
                            {/* THEME TOGGLE - Modern Day/Night Slider */}
                            <button
                                type="button"
                                onClick={toggleTheme}
                                className={`day-night-toggle ${theme === 'dark' ? 'is-night' : 'is-day'}`}
                                title={theme === 'dark' ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
                                aria-label="Ganti Tema Tampilan"
                            >
                                <span className="toggle-track">
                                    <span className="track-day">
                                        <span className="cloud cloud-1"></span>
                                        <span className="cloud cloud-2"></span>
                                    </span>
                                    <span className="track-night">
                                        <span className="star star-1"></span>
                                        <span className="star star-2"></span>
                                        <span className="star star-3"></span>
                                        <span className="star star-4"></span>
                                    </span>
                                    <span className="toggle-thumb">
                                        <span className="thumb-sun"></span>
                                        <span className="thumb-moon"></span>
                                    </span>
                                </span>
                            </button>

                            {/* LANGUAGE SWITCHER */}
                            <select
                                id="langSelect"
                                value={language}
                                onChange={(e) => setLanguage(e.target.value as LanguageType)}
                                className="nav-select-clean"
                                aria-label="Pilih Bahasa"
                            >
                                <option value="id">🇮🇩 ID</option>
                                <option value="en">🇬🇧 EN</option>
                            </select>

                            {/* CURRENCY SWITCHER */}
                            <select
                                id="currencySelect"
                                value={currency}
                                onChange={(e) => setCurrency(e.target.value as CurrencyType)}
                                className="nav-select-clean"
                                aria-label="Pilih Mata Uang"
                            >
                                <option value="IDR">IDR (Rp)</option>
                                <option value="USD">USD ($)</option>
                                <option value="EUR">EUR (€)</option>
                                <option value="SGD">SGD (S$)</option>
                            </select>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
};
