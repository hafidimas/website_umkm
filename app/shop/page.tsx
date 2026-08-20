'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useShop } from '../../context/ShopContext';
import { FilterSidebar } from '../../components/FilterSidebar';
import { ProductCard } from '../../components/ProductCard';
import { FilterState } from '../../types';

function ShopContent() {
    const searchParams = useSearchParams();
    const catParam = searchParams.get('cat') || 'all';
    const { products, showToast, t } = useShop();

    const [filterState, setFilterState] = useState<FilterState>({
        category: catParam,
        searchQuery: '',
        maxPrice: 200000,
        organicOnly: true,
        readyStockOnly: true,
        rating: 'all',
        sortBy: 'popular',
    });

    const filteredProducts = useMemo(() => {
        let result = products.filter(p => {
            const matchesQuery = p.title.toLowerCase().includes(filterState.searchQuery.toLowerCase()) ||
                                 p.desc.toLowerCase().includes(filterState.searchQuery.toLowerCase()) ||
                                 p.nutrition.toLowerCase().includes(filterState.searchQuery.toLowerCase());

            const matchesCat = filterState.category === 'all' || p.category === filterState.category;
            const matchesPrice = p.price <= filterState.maxPrice;

            let matchesRating = true;
            if (filterState.rating === '4.5') matchesRating = p.rating >= 4.5;
            else if (filterState.rating === '4.0') matchesRating = p.rating >= 4.0 && p.rating < 4.5;
            else if (filterState.rating === '3.0') matchesRating = p.rating >= 3.0 && p.rating < 4.0;

            return matchesQuery && matchesCat && matchesPrice && matchesRating;
        });

        if (filterState.sortBy === 'price-low') {
            result.sort((a, b) => a.price - b.price);
        } else if (filterState.sortBy === 'price-high') {
            result.sort((a, b) => b.price - a.price);
        } else if (filterState.sortBy === 'name') {
            result.sort((a, b) => a.title.localeCompare(b.title));
        } else {
            result.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
        }

        return result;
    }, [products, filterState]);

    const handleResetFilters = () => {
        setFilterState({
            category: 'all',
            searchQuery: '',
            maxPrice: 200000,
            organicOnly: true,
            readyStockOnly: true,
            rating: 'all',
            sortBy: 'popular',
        });
        showToast('Filter telah direset', 'fa-rotate-left');
    };

    return (
        <main>
            {/* SHOP HERO BANNER */}
            <section className="shop-hero-section">
                <div className="container">
                    <div className="shop-hero-card">
                        <div className="shop-hero-content">
                            <span className="sub-header-tag"><i className="fa-solid fa-leaf"></i> {t('harvest_today')}</span>
                            <h1 className="shop-title">{t('shop_title')}</h1>
                            <p className="shop-subtitle">{t('shop_sub')}</p>
                            
                            <div className="shop-stats-pills">
                                <span className="shop-pill"><i className="fa-solid fa-circle text-green"></i> 12+ {t('all_categories')}</span>
                                <span className="shop-pill"><i className="fa-solid fa-truck-fast"></i> Express Delivery</span>
                                <span className="shop-pill"><i className="fa-solid fa-shield-heart"></i> {t('footer_guarantee')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* MAIN SHOP EXPERIENCE */}
            <section className="section shop-main-section">
                <div className="container">
                    <div className="shop-layout">
                        {/* Left Sidebar Filter */}
                        <FilterSidebar
                            filterState={filterState}
                            setFilterState={setFilterState}
                            onReset={handleResetFilters}
                        />

                        {/* Right Content Area */}
                        <main className="shop-content">
                            {/* Shop Controls Bar */}
                            <div className="shop-controls-bar">
                                <div className="results-info">
                                    <span>Showing <strong>{filteredProducts.length}</strong> of <strong>{products.length}</strong> products</span>
                                </div>

                                <div className="shop-sort-wrap">
                                    <label htmlFor="sortSelect">{t('sort_by')}</label>
                                    <select
                                        id="sortSelect"
                                        value={filterState.sortBy}
                                        onChange={(e) => setFilterState(prev => ({ ...prev, sortBy: e.target.value as any }))}
                                    >
                                        <option value="popular">{t('sort_popular')}</option>
                                        <option value="price-low">{t('sort_low')}</option>
                                        <option value="price-high">{t('sort_high')}</option>
                                        <option value="name">{t('sort_name')}</option>
                                    </select>
                                </div>
                            </div>

                            {/* Products Detailed Grid */}
                            {filteredProducts.length === 0 ? (
                                <div style={{
                                    gridColumn: '1 / -1',
                                    textAlign: 'center',
                                    padding: '60px 20px',
                                    color: 'var(--text-muted)',
                                    background: '#FFFFFF',
                                    borderRadius: 'var(--radius-lg)',
                                    border: '1px solid var(--border-light)'
                                }}>
                                    <i className="fa-solid fa-leaf" style={{ fontSize: '3.5rem', marginBottom: '14px', color: 'var(--border-color)' }}></i>
                                    <h3 style={{ fontSize: '18px', color: 'var(--dark)', marginBottom: '6px' }}>No products found</h3>
                                    <p style={{ fontSize: '13px' }}>Try resetting your filter parameters or search term.</p>
                                </div>
                            ) : (
                                <div className="shop-products-grid">
                                    {filteredProducts.map(p => (
                                        <ProductCard key={p.id} product={p} isDetailed={true} />
                                    ))}
                                </div>
                            )}
                        </main>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default function ShopPage() {
    return (
        <Suspense fallback={<div className="container" style={{ padding: '60px 0', textAlign: 'center' }}>Loading shop catalog...</div>}>
            <ShopContent />
        </Suspense>
    );
}
