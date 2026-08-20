'use client';

import React from 'react';
import Link from 'next/link';
import { useShop } from '../context/ShopContext';

export const CartDrawer: React.FC = () => {
    const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQty, emptyCart, restoreCart, hasRestorableCart, showToast, formatPrice, t, language } = useShop();
    const isEn = language === 'en';

    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.qty), 0);

    return (
        <div
            className={`cart-drawer-overlay ${isCartOpen ? 'active' : ''}`}
            onClick={(e) => {
                if (e.target === e.currentTarget) setIsCartOpen(false);
            }}
        >
            <div className="cart-drawer">
                <div className="cart-drawer-header">
                    <h3><i className="fa-solid fa-basket-shopping"></i> {t('cart_title')} ({totalQty})</h3>
                    <button
                        type="button"
                        className="btn-close-drawer"
                        onClick={() => setIsCartOpen(false)}
                        aria-label="Tutup Keranjang"
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>

                <div className="cart-drawer-body">
                    {cart.length === 0 ? (
                        <div className="empty-cart-msg">
                            <i className="fa-solid fa-basket-shopping"></i>
                            <p style={{ fontWeight: 700, marginBottom: '4px' }}>{t('empty_cart_title')}</p>
                            <span style={{ fontSize: '12px', marginBottom: '14px', display: 'block' }}>{t('empty_cart_sub')}</span>

                            {/* UNDO / RESTORE CART BUTTON IN DRAWER (RAPIH & KOMPAK) */}
                            {hasRestorableCart && (
                                <button
                                    type="button"
                                    onClick={restoreCart}
                                    className="btn btn-outline"
                                    style={{
                                        fontWeight: 700,
                                        fontSize: '12.5px',
                                        padding: '8px 16px',
                                        borderRadius: 'var(--radius-full)',
                                        marginTop: '6px',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        borderColor: 'var(--primary)',
                                        color: 'var(--primary)',
                                        backgroundColor: '#F0FDF4'
                                    }}
                                >
                                    <i className="fa-solid fa-rotate-left" style={{ fontSize: '12px', color: 'var(--primary)' }}></i>
                                    <span>{isEn ? 'Restore Previous Cart' : 'Kembalikan Keranjang Saya'}</span>
                                </button>
                            )}
                        </div>
                    ) : (
                        cart.map(item => (
                            <div className="cart-item" key={item.product.id}>
                                <img src={item.product.image} alt={item.product.title} className="cart-item-img" />
                                <div className="cart-item-info">
                                    <h4 className="cart-item-title">{item.product.title}</h4>
                                    <div className="cart-item-price">{formatPrice(item.product.price)}</div>
                                    <div className="qty-controls">
                                        <button
                                            type="button"
                                            className="qty-btn"
                                            onClick={() => updateQty(item.product.id, -1)}
                                        >-</button>
                                        <span className="qty-val">{item.qty}</span>
                                        <button
                                            type="button"
                                            className="qty-btn"
                                            onClick={() => updateQty(item.product.id, 1)}
                                        >+</button>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    className="btn-remove-item"
                                    onClick={() => removeFromCart(item.product.id)}
                                    title="Hapus Sayur"
                                >
                                    <i className="fa-regular fa-trash-can"></i>
                                </button>
                            </div>
                        ))
                    )}
                </div>

                <div className="cart-drawer-footer">
                    <div className="cart-subtotal">
                        <span>{t('subtotal')}</span>
                        <strong>{formatPrice(subtotal)}</strong>
                    </div>
                    <p className="shipping-note"><i className="fa-solid fa-truck-fast"></i> {t('free_shipping_note')}</p>
                    <div className="cart-actions">
                        <button type="button" className="btn btn-outline btn-block" onClick={emptyCart}>{t('empty_cart_btn')}</button>
                        <Link
                            href="/cart"
                            className="btn btn-primary btn-block"
                            onClick={() => setIsCartOpen(false)}
                            style={{ justifyContent: 'center' }}
                        >
                            {t('checkout_btn')} <i className="fa-solid fa-arrow-right"></i>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};
