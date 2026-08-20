'use client';

import React from 'react';
import { Product } from '../types';
import { useShop } from '../context/ShopContext';

interface ProductCardProps {
    product: Product;
    isDetailed?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, isDetailed = false }) => {
    const { wishlist, toggleWishlist, addToCart, openProductModal, formatPrice, t, language } = useShop();
    const isWish = wishlist.includes(product.id);

    const isEn = language === 'en';

    const displayTitle = isEn && product.titleEn ? product.titleEn : product.title;
    const displayCategory = isEn && product.categoryNameEn ? product.categoryNameEn : product.categoryName;
    const displayWeight = isEn && product.weightEn ? product.weightEn : product.weight;
    const displayNutrition = isEn && product.nutritionEn ? product.nutritionEn : product.nutrition;

    return (
        <div className={`product-card ${isDetailed ? 'shop-detailed-card' : ''}`}>
            <div className="product-card-top-badges">
                <span className="product-badge-disc">{product.discount}</span>
            </div>

            <div className="product-actions-overlay">
                <button
                    type="button"
                    className={`btn-icon-action btn-wishlist-toggle ${isWish ? 'active' : ''}`}
                    onClick={() => toggleWishlist(product.id)}
                    title={isEn ? 'Add to Wishlist' : 'Tambah ke Wishlist'}
                >
                    <i className={`${isWish ? 'fa-solid' : 'fa-regular'} fa-heart`}></i>
                </button>
                <button
                    type="button"
                    className="btn-icon-action btn-quick-view"
                    onClick={() => openProductModal(product.id)}
                    title={isEn ? 'View Details' : 'Lihat Detail & Nutrisi'}
                >
                    <i className="fa-regular fa-eye"></i>
                </button>
            </div>

            <div className="product-img-wrap">
                <img src={product.image} alt={displayTitle} loading="lazy" />
            </div>

            <div className="product-info">
                <div className="product-meta-tags">
                    <span className="product-cat">
                        <i className="fa-solid fa-leaf"></i> {displayCategory}
                    </span>
                    <span className="product-weight-badge">
                        <i className="fa-solid fa-scale-balanced"></i> {displayWeight}
                    </span>
                </div>

                <h3 className="product-title">{displayTitle}</h3>

                <div className="nutrition-snippet">
                    <i className="fa-solid fa-seedling text-green"></i> {displayNutrition}
                </div>

                <div className="product-rating">
                    <i className="fa-solid fa-star"></i>
                    <span>{product.rating}</span>
                    <span className="review-count">({product.reviews} {t('reviews_count')})</span>
                </div>

                <div className="product-price-box">
                    <span className="price-current">{formatPrice(product.price)}</span>
                    <span className="price-original">{formatPrice(product.originalPrice)}</span>
                </div>
            </div>

            <div className="product-card-footer-btns">
                <button
                    type="button"
                    className="btn-add-cart"
                    onClick={() => addToCart(product.id)}
                >
                    <i className="fa-solid fa-basket-shopping"></i> {t('add_to_cart')}
                </button>
                <button
                    type="button"
                    className="btn-detail-quick"
                    onClick={() => openProductModal(product.id)}
                    title={isEn ? 'View Details' : 'Detail Sayur & Nutrisi'}
                >
                    <i className="fa-regular fa-eye"></i>
                </button>
            </div>
        </div>
    );
};
