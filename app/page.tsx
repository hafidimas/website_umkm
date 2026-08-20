'use client';

import React from 'react';
import Link from 'next/link';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';

export default function HomePage() {
    const { products, t } = useShop();

    return (
        <main>
            {/* HERO BANNER SECTION */}
            <section className="hero-section" id="home">
                <div className="container">
                    <div className="hero-card modern-hero-card">
                        <div className="hero-content">
                            <span className="modern-hero-badge"><i className="fa-solid fa-wand-magic-sparkles"></i> {t('home_hero_tag')}</span>
                            <h1 className="hero-title">{t('home_hero_title')}</h1>
                            <p className="hero-subtitle">{t('home_hero_sub')}</p>
                            
                            <div className="hero-feature-pills">
                                <span className="pill-tag"><i className="fa-solid fa-seedling"></i> 100% Organik</span>
                                <span className="pill-tag"><i className="fa-solid fa-bolt"></i> Fast Delivery</span>
                                <span className="pill-tag"><i className="fa-solid fa-droplet"></i> 95% Eco Water</span>
                            </div>

                            <div className="hero-buttons">
                                <Link href="/shop" className="btn btn-glow-primary">
                                    <i className="fa-solid fa-basket-shopping"></i> {t('btn_shop_now')} <i className="fa-solid fa-arrow-right"></i>
                                </Link>
                                <Link href="/why-us" className="btn btn-glass">
                                    <i className="fa-solid fa-circle-info"></i> {t('btn_why_us')}
                                </Link>
                            </div>
                        </div>

                        <div className="modern-hero-visual">
                            <img
                                src="https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80"
                                alt="Panen Sayuran Hidroponik Segar Devsecora"
                                className="modern-hero-img"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* BESTSELLERS SECTION */}
            <section className="section bestsellers-section" id="bestsellers">
                <div className="container">
                    <div className="section-header">
                        <div>
                            <span className="sub-header-tag"><i className="fa-solid fa-fire"></i> {t('harvest_today')}</span>
                            <h2 className="section-title">{t('bestsellers_title')}</h2>
                            <p className="section-subtitle">{t('bestsellers_sub')}</p>
                        </div>
                        <Link href="/shop" className="view-all-link">
                            {t('view_all')} <i className="fa-solid fa-arrow-right"></i>
                        </Link>
                    </div>

                    <div className="products-grid">
                        {products.slice(0, 8).map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </section>

            {/* WHY US SECTION - ENHANCED & CLEAN */}
            <section className="section why-us-section" id="why-us">
                <div className="container">
                    <div className="section-header center">
                        <span className="sub-header-tag"><i className="fa-solid fa-seedling"></i> {t('why_tag')}</span>
                        <h2 className="section-title">{t('why_title')}</h2>
                        <p className="section-subtitle">{t('why_sub')}</p>
                    </div>

                    <div className="why-us-grid">
                        {/* Card 1 */}
                        <div className="why-card">
                            <div className="why-card-top">
                                <div className="why-icon-box">
                                    <i className="fa-solid fa-shield-halved text-green"></i>
                                </div>
                            </div>
                            <h3>100% Bebas Pestisida</h3>
                            <p>Ditanam di dalam green house steril terproteksi kelambu micro-mesh. Terisolasi penuh dari hama tanah tanpa perlu semprotan pestisida racun sintetis.</p>
                            <div className="why-card-footer">
                                <span className="why-tag-pill"><i className="fa-solid fa-circle-check"></i> Clean &amp; Safe</span>
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className="why-card">
                            <div className="why-card-top">
                                <div className="why-icon-box">
                                    <i className="fa-regular fa-clock text-green"></i>
                                </div>
                                <span className="why-card-badge">Fresh Daily</span>
                            </div>
                            <h3>Panen Jam 05:00 Pagi</h3>
                            <p>Seluruh tanaman dipetik saat suhu udara paling dingin di pagi hari untuk mengunci kandungan air (turgor sel) dan nutrisi alami vitamin utuh.</p>
                            <div className="why-card-footer">
                                <span className="why-tag-pill"><i className="fa-solid fa-sun"></i> Fresh Harvest</span>
                            </div>
                        </div>

                        {/* Card 3 */}
                        <div className="why-card">
                            <div className="why-card-top">
                                <div className="why-icon-box">
                                    <i className="fa-solid fa-bottle-water text-green"></i>
                                </div>
                                <span className="why-card-badge">Eco Water</span>
                            </div>
                            <h3>95% Hemat Air &amp; Steril</h3>
                            <p>Sistem resirkulasi air nutrisi tertutup (NFT &amp; Deep Flow) yang terukur kadar pH &amp; PPM-nya secara digital. Bebas dari telur cacing dan parasit tanah.</p>
                            <div className="why-card-footer">
                                <span className="why-tag-pill"><i className="fa-solid fa-droplet"></i> Eco Technology</span>
                            </div>
                        </div>

                        {/* Card 4 */}
                        <div className="why-card">
                            <div className="why-card-top">
                                <div className="why-icon-box">
                                    <i className="fa-solid fa-truck-fast text-green"></i>
                                </div>
                                <span className="why-card-badge">Fast Delivery</span>
                            </div>
                            <h3>Pengiriman Ekstra Cepat</h3>
                            <p>Dikemas dengan kurir berpendingin atau kantong higienis. Sayur sampai di rumah Anda dalam 15 - 30 menit masih dalam kondisi segar dingin.</p>
                            <div className="why-card-footer">
                                <span className="why-tag-pill"><i className="fa-solid fa-bolt"></i> Direct Express</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
