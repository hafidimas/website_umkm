'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useShop } from '../../context/ShopContext';

export default function CartPage() {
    const { cart, updateQty, removeFromCart, emptyCart, restoreCart, hasRestorableCart, formatPrice, t, language } = useShop();
    const isEn = language === 'en';

    const [couponCode, setCouponCode] = useState('');
    const [discountAmount, setDiscountAmount] = useState(0);
    const [couponApplied, setCouponApplied] = useState(false);

    // Hitung Subtotal dalam IDR
    const cartSubtotalIDR = cart.reduce((sum, item) => sum + (item.product.price * item.qty), 0);
    const freeShippingThresholdIDR = 100000;
    const isFreeShipping = cartSubtotalIDR >= freeShippingThresholdIDR;
    const progressPercent = Math.min(100, (cartSubtotalIDR / freeShippingThresholdIDR) * 100);
    const remainingForFreeShip = Math.max(0, freeShippingThresholdIDR - cartSubtotalIDR);

    // Ongkir & Total Akhir
    const shippingCostIDR = isFreeShipping || cart.length === 0 ? 0 : 15000;
    const finalTotalIDR = Math.max(0, cartSubtotalIDR - discountAmount + shippingCostIDR);

    const handleApplyCoupon = (e: React.FormEvent) => {
        e.preventDefault();
        const cleanCode = couponCode.trim().toUpperCase();

        if (cleanCode === 'KEBUN10' || cleanCode === 'PANENSEGAR') {
            const disc = Math.round(cartSubtotalIDR * 0.1);
            setDiscountAmount(disc);
            setCouponApplied(true);
        } else {
            alert(isEn ? 'Invalid voucher code. Try "PANENSEGAR"' : 'Kode voucher tidak valid. Coba gunakan "PANENSEGAR"');
        }
    };

    return (
        <main style={{ backgroundColor: '#F9F8F3', minHeight: '85vh', paddingBottom: '80px' }}>
            {/* HERO BANNER */}
            <section className="shop-hero-section">
                <div className="container">
                    <div className="shop-hero-card">
                        <div className="shop-hero-content">
                            <span className="sub-header-tag">
                                <i className="fa-solid fa-basket-shopping"></i> {t('cart_title')}
                            </span>
                            <h1 className="shop-title">
                                {isEn ? 'Your Vegetable Shopping Cart' : 'Keranjang Belanja Sayur Segar'}
                            </h1>
                            <p className="shop-subtitle">
                                {isEn ? 'Review your freshly harvested produce before proceeding to 15-30 minute express delivery.' : 'Periksa kembali daftar sayuran hidroponik pilihan Anda sebelum melanjutkan ke tahap pengiriman express.'}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <div className="container" style={{ marginTop: '40px' }}>
                {cart.length === 0 ? (
                    /* EMPTY CART STATE WITH CLEAN RESTORE OPTION */
                    <div style={{
                        background: '#FFFFFF',
                        borderRadius: 'var(--radius-xl)',
                        padding: '50px 24px',
                        textAlign: 'center',
                        boxShadow: 'var(--shadow-sm)',
                        border: '1px solid var(--border-light)',
                        maxWidth: '620px',
                        margin: '0 auto'
                    }}>
                        <div style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            backgroundColor: '#F0FDF4',
                            color: 'var(--primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '36px',
                            margin: '0 auto 16px'
                        }}>
                            <i className="fa-solid fa-basket-shopping"></i>
                        </div>
                        <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--dark)', marginBottom: '6px' }}>
                            {t('empty_cart_title')}
                        </h2>
                        <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px', maxWidth: '420px', margin: '0 auto 24px' }}>
                            {t('empty_cart_sub')}
                        </p>

                        {/* RAPIH & KOMPAK UNDO / RESTORE CART BANNER */}
                        {hasRestorableCart && (
                            <div style={{
                                backgroundColor: '#F0FDF4',
                                border: '1px dashed #BBF7D0',
                                padding: '14px 20px',
                                borderRadius: 'var(--radius-lg)',
                                marginBottom: '24px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '14px',
                                maxWidth: '100%'
                            }}>
                                <span style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--dark)' }}>
                                    <i className="fa-solid fa-circle-info" style={{ marginRight: '6px', color: 'var(--primary)' }}></i>
                                    {isEn ? 'Salah memencet kosongkan keranjang?' : 'Salah memencet kosongkan keranjang?'}
                                </span>
                                <button
                                    type="button"
                                    onClick={restoreCart}
                                    className="btn btn-outline"
                                    style={{
                                        padding: '8px 16px',
                                        fontSize: '12.5px',
                                        fontWeight: 700,
                                        borderRadius: 'var(--radius-full)',
                                        borderColor: 'var(--primary)',
                                        color: 'var(--primary)',
                                        backgroundColor: '#FFFFFF',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '6px'
                                    }}
                                >
                                    <i className="fa-solid fa-rotate-left" style={{ fontSize: '12px' }}></i>
                                    <span>{isEn ? 'Restore Cart' : 'Kembalikan Keranjang Saya'}</span>
                                </button>
                            </div>
                        )}

                        <div>
                            <Link href="/shop" className="btn btn-primary" style={{ padding: '12px 28px', fontSize: '14.5px', fontWeight: 700 }}>
                                <i className="fa-solid fa-leaf"></i>
                                <span>{isEn ? 'Explore Vegetable Shop' : 'Jelajahi Toko Sayur'}</span>
                            </Link>
                        </div>
                    </div>
                ) : (
                    /* CART CONTENTS & SUMMARY GRID */
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '32px', alignItems: 'start' }}>
                        {/* LEFT COLUMN: ITEM LIST */}
                        <div>
                            {/* FREE SHIPPING PROGRESS BAR */}
                            <div style={{
                                background: '#FFFFFF',
                                borderRadius: 'var(--radius-lg)',
                                padding: '20px 24px',
                                marginBottom: '24px',
                                border: '1px solid var(--border-light)',
                                boxShadow: 'var(--shadow-sm)'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                    <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--dark)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <i className="fa-solid fa-truck-fast text-green"></i>
                                        {isFreeShipping
                                            ? (isEn ? '🎉 Congratulations! You unlocked FREE SHIPPING!' : '🎉 Selamat! Anda mendapatkan GRATIS ONGKIR!')
                                            : (isEn ? `Add ${formatPrice(remainingForFreeShip)} more for FREE SHIPPING` : `Tambah ${formatPrice(remainingForFreeShip)} lagi untuk GRATIS ONGKIR!`)}
                                    </span>
                                    <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--primary)' }}>{Math.round(progressPercent)}%</span>
                                </div>
                                <div style={{ height: '8px', backgroundColor: '#E2E8F0', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                                    <div style={{ height: '100%', width: `${progressPercent}%`, backgroundColor: 'var(--primary)', borderRadius: 'var(--radius-full)', transition: 'width 0.4s ease' }}></div>
                                </div>
                            </div>

                            {/* ITEM CARDS LIST */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                                {cart.map(item => {
                                    const p = item.product;
                                    const displayTitle = isEn && p.titleEn ? p.titleEn : p.title;
                                    const displayCategory = isEn && p.categoryNameEn ? p.categoryNameEn : p.categoryName;
                                    const displayWeight = isEn && p.weightEn ? p.weightEn : p.weight;
                                    const itemSubtotal = p.price * item.qty;

                                    return (
                                        <div
                                            key={p.id}
                                            style={{
                                                background: '#FFFFFF',
                                                borderRadius: 'var(--radius-lg)',
                                                padding: '20px',
                                                display: 'grid',
                                                gridTemplateColumns: '100px 1fr auto',
                                                gap: '20px',
                                                alignItems: 'center',
                                                border: '1px solid var(--border-light)',
                                                boxShadow: 'var(--shadow-sm)'
                                            }}
                                        >
                                            {/* Thumbnail */}
                                            <div style={{ width: '100px', height: '90px', borderRadius: 'var(--radius-md)', overflow: 'hidden', backgroundColor: '#F8FAFC' }}>
                                                <img src={p.image} alt={displayTitle} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            </div>

                                            {/* Details */}
                                            <div>
                                                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--primary)', backgroundColor: '#F0FDF4', padding: '3px 8px', borderRadius: 'var(--radius-full)', display: 'inline-block', marginBottom: '4px' }}>
                                                    <i className="fa-solid fa-leaf"></i> {displayCategory}
                                                </span>
                                                <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--dark)', marginBottom: '4px' }}>{displayTitle}</h3>
                                                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                                                    <span>{displayWeight}</span> • <span style={{ fontWeight: 700, color: 'var(--dark)' }}>{formatPrice(p.price)}</span>
                                                </div>

                                                {/* Qty Selector */}
                                                <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '2px' }}>
                                                    <button
                                                        type="button"
                                                        onClick={() => updateQty(p.id, -1)}
                                                        style={{ width: '30px', height: '30px', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 800, color: 'var(--dark)' }}
                                                    >-</button>
                                                    <span style={{ width: '32px', textAlign: 'center', fontWeight: 700, fontSize: '14px' }}>{item.qty}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => updateQty(p.id, 1)}
                                                        style={{ width: '30px', height: '30px', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 800, color: 'var(--dark)' }}
                                                    >+</button>
                                                </div>
                                            </div>

                                            {/* Subtotal & Delete */}
                                            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between', height: '100%' }}>
                                                <button
                                                    type="button"
                                                    onClick={() => removeFromCart(p.id)}
                                                    style={{ border: 'none', background: 'none', color: '#EF4444', cursor: 'pointer', padding: '4px', fontSize: '16px' }}
                                                    title={isEn ? 'Remove Item' : 'Hapus Item'}
                                                >
                                                    <i className="fa-regular fa-trash-can"></i>
                                                </button>
                                                <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--primary)' }}>
                                                    {formatPrice(itemSubtotal)}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* BOTTOM ACTION BUTTONS */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <button
                                    type="button"
                                    onClick={emptyCart}
                                    className="btn btn-outline"
                                    style={{ color: '#EF4444', borderColor: '#FECDD3' }}
                                >
                                    <i className="fa-regular fa-trash-can"></i>
                                    <span>{t('empty_cart_btn')}</span>
                                </button>
                                <Link href="/shop" className="btn btn-outline">
                                    <i className="fa-solid fa-plus"></i>
                                    <span>{isEn ? 'Add More Veggies' : 'Tambah Sayuran Lain'}</span>
                                </Link>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: ORDER SUMMARY CARD */}
                        <div style={{ position: 'sticky', top: '100px' }}>
                            <div style={{
                                background: '#FFFFFF',
                                borderRadius: 'var(--radius-xl)',
                                padding: '28px 24px',
                                border: '1px solid var(--border-light)',
                                boxShadow: 'var(--shadow-md)'
                            }}>
                                <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--dark)', marginBottom: '20px', borderBottom: '1px solid var(--border-light)', paddingBottom: '14px' }}>
                                    {isEn ? 'Order Summary' : 'Ringkasan Pesanan'}
                                </h3>

                                {/* PROMO VOUCHER FORM */}
                                <form onSubmit={handleApplyCoupon} style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: 'var(--dark)', marginBottom: '6px' }}>
                                        {isEn ? 'Voucher Code (Try "PANENSEGAR")' : 'Kode Voucher (Coba "PANENSEGAR")'}
                                    </label>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <input
                                            type="text"
                                            placeholder="PANENSEGAR"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value)}
                                            style={{
                                                flex: 1,
                                                padding: '10px 12px',
                                                borderRadius: 'var(--radius-md)',
                                                border: '1px solid var(--border-color)',
                                                fontSize: '13px',
                                                textTransform: 'uppercase'
                                            }}
                                        />
                                        <button
                                            type="submit"
                                            className="btn btn-outline"
                                            style={{ padding: '10px 16px', fontSize: '13px', fontWeight: 700 }}
                                        >
                                            {isEn ? 'Apply' : 'Gunakan'}
                                        </button>
                                    </div>
                                    {couponApplied && (
                                        <span style={{ fontSize: '12px', color: '#166534', fontWeight: 700, marginTop: '4px', display: 'block' }}>
                                            ✓ {isEn ? 'Voucher PANENSEGAR Applied (10% OFF)' : 'Voucher PANENSEGAR Berhasil (Diskon 10%)'}
                                        </span>
                                    )}
                                </form>

                                {/* PRICING BREAKDOWN */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px', fontSize: '14px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                                        <span>{t('subtotal')} ({cart.reduce((s, i) => s + i.qty, 0)} item)</span>
                                        <span style={{ fontWeight: 700, color: 'var(--dark)' }}>{formatPrice(cartSubtotalIDR)}</span>
                                    </div>

                                    {discountAmount > 0 && (
                                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#166534' }}>
                                            <span>Diskon Voucher</span>
                                            <span style={{ fontWeight: 700 }}>-{formatPrice(discountAmount)}</span>
                                        </div>
                                    )}

                                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                                        <span>{isEn ? 'Est. Express Shipping' : 'Est. Ongkir Express'}</span>
                                        <span style={{ fontWeight: 700, color: isFreeShipping ? '#166534' : 'var(--dark)' }}>
                                            {isFreeShipping ? (isEn ? 'FREE' : 'GRATIS') : formatPrice(shippingCostIDR)}
                                        </span>
                                    </div>

                                    <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--dark)' }}>Total Akhir</span>
                                        <span style={{ fontSize: '22px', fontWeight: 800, color: 'var(--primary)' }}>{formatPrice(finalTotalIDR)}</span>
                                    </div>
                                </div>

                                {/* CHECKOUT CTA BUTTON */}
                                <Link
                                    href="/checkout"
                                    className="btn btn-primary btn-block"
                                    style={{
                                        padding: '16px',
                                        fontSize: '15px',
                                        fontWeight: 700,
                                        borderRadius: 'var(--radius-md)',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <span>{t('checkout_btn')}</span>
                                    <i className="fa-solid fa-arrow-right"></i>
                                </Link>

                                <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '12px', color: 'var(--text-muted)' }}>
                                    <i className="fa-solid fa-shield-heart text-green" style={{ marginRight: '4px' }}></i>
                                    {isEn ? '100% Fresh Harvest Guarantee & Safe Payment' : 'Garansi 100% Segar & Pembayaran Aman'}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
