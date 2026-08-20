'use client';

import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';

export const ProductModal: React.FC = () => {
    const { selectedProduct, closeProductModal, addToCart, formatPrice, t, language } = useShop();
    const [modalQty, setModalQty] = useState<number>(1);

    if (!selectedProduct) return null;

    const p = selectedProduct;
    const isEn = language === 'en';

    const displayTitle = isEn && p.titleEn ? p.titleEn : p.title;
    const displayCategory = isEn && p.categoryNameEn ? p.categoryNameEn : p.categoryName;
    const displayWeight = isEn && p.weightEn ? p.weightEn : p.weight;
    const displayNutrition = isEn && p.nutritionEn ? p.nutritionEn : p.nutrition;

    const handleAddToCartModal = () => {
        addToCart(p.id, modalQty);
        closeProductModal();
    };

    return (
        <div
            className="modal-overlay active"
            onClick={(e) => {
                if (e.target === e.currentTarget) closeProductModal();
            }}
        >
            <div className="modal-card detailed-modal-card">
                <button type="button" className="modal-close" onClick={closeProductModal} aria-label="Tutup Modal">
                    <i className="fa-solid fa-xmark"></i>
                </button>
                <div className="modal-body">
                    <div className="modal-detail-grid">
                        <div className="modal-img-container">
                            <img src={p.image} alt={displayTitle} className="modal-main-img" />
                            <div className="modal-badges-row">
                                <span className="modal-stock-badge">{p.stockStatus}</span>
                                <span className="modal-organic-badge"><i className="fa-solid fa-seedling"></i> 100% {t('filter_organic')}</span>
                            </div>
                        </div>

                        <div className="modal-info-container">
                            <div className="modal-header-meta">
                                <span className="product-cat"><i className="fa-solid fa-leaf"></i> {displayCategory}</span>
                                <span className="modal-weight"><i className="fa-solid fa-scale-balanced"></i> {displayWeight}</span>
                            </div>

                            <h2 className="modal-product-title">{displayTitle}</h2>

                            <div className="modal-rating-row">
                                <div className="stars">
                                    <i className="fa-solid fa-star"></i>
                                    <i className="fa-solid fa-star"></i>
                                    <i className="fa-solid fa-star"></i>
                                    <i className="fa-solid fa-star"></i>
                                    <i className="fa-solid fa-star"></i>
                                    <strong style={{ marginLeft: '4px' }}>{p.rating}</strong>
                                </div>
                                <span className="reviews-count">({p.reviews} {t('reviews_count')})</span>
                            </div>

                            <div className="modal-price-box">
                                <span className="modal-price-current">{formatPrice(p.price)}</span>
                                <span className="modal-price-original">{formatPrice(p.originalPrice)}</span>
                                <span className="modal-discount-tag">{p.discount}</span>
                            </div>

                            <p className="modal-description">{p.desc}</p>

                            {/* Specifications Grid */}
                            <div className="modal-spec-grid">
                                <div className="spec-card">
                                    <i className="fa-regular fa-clock text-green"></i>
                                    <div>
                                        <strong>{t('harvest_time')}</strong>
                                        <span>{p.harvestTime}</span>
                                    </div>
                                </div>
                                <div className="spec-card">
                                    <i className="fa-solid fa-location-dot text-green"></i>
                                    <div>
                                        <strong>{t('farm_origin')}</strong>
                                        <span>{p.farmOrigin}</span>
                                    </div>
                                </div>
                                <div className="spec-card">
                                    <i className="fa-solid fa-heart-pulse text-green"></i>
                                    <div>
                                        <strong>{t('nutrition_content')}</strong>
                                        <span>{displayNutrition}</span>
                                    </div>
                                </div>
                                <div className="spec-card">
                                    <i className="fa-solid fa-snowflake text-green"></i>
                                    <div>
                                        <strong>{t('storage_tip')}</strong>
                                        <span>{p.storageTip}</span>
                                    </div>
                                </div>
                                <div className="spec-card full-width">
                                    <i className="fa-solid fa-utensils text-green"></i>
                                    <div>
                                        <strong>{t('culinary_uses')}</strong>
                                        <span>{p.culinaryUses}</span>
                                    </div>
                                </div>
                            </div>

                            {/* ACTION ROW WITH COMPACT QUANTITY & SUBMIT BUTTON */}
                            <div className="modal-action-row">
                                <div className="modal-qty-selector">
                                    <button
                                        type="button"
                                        className="btn-modal-qty"
                                        onClick={() => setModalQty(prev => Math.max(1, prev - 1))}
                                        aria-label="Kurangi Jumlah"
                                    >-</button>
                                    <span id="modalQtyVal">{modalQty}</span>
                                    <button
                                        type="button"
                                        className="btn-modal-qty"
                                        onClick={() => setModalQty(prev => prev + 1)}
                                        aria-label="Tambah Jumlah"
                                    >+</button>
                                </div>
                                <button
                                    type="button"
                                    className="btn-modal-submit"
                                    onClick={handleAddToCartModal}
                                >
                                    <i className="fa-solid fa-basket-shopping"></i>
                                    <span>{t('add_to_cart')}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
