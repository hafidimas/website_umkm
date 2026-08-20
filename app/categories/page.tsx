'use client';

import React from 'react';
import Link from 'next/link';
import { useShop } from '../../context/ShopContext';

export default function CategoriesPage() {
    const { t, language } = useShop();
    const isEn = language === 'en';

    return (
        <main>
            {/* HERO BANNER */}
            <section className="shop-hero-section">
                <div className="container">
                    <div className="shop-hero-card">
                        <div className="shop-hero-content">
                            <span className="sub-header-tag"><i className="fa-solid fa-layer-group"></i> {t('cat_tag')}</span>
                            <h1 className="shop-title">{t('cat_title')}</h1>
                            <p className="shop-subtitle">{t('cat_sub')}</p>
                            
                            <div className="shop-stats-pills">
                                <span className="shop-pill"><i className="fa-solid fa-seedling text-green"></i> {isEn ? '6 Specialist Categories' : '6 Kategori Spesialis'}</span>
                                <span className="shop-pill"><i className="fa-solid fa-droplet text-green"></i> {isEn ? '100% Pesticide Free' : '100% Bebas Pestisida'}</span>
                                <span className="shop-pill"><i className="fa-solid fa-truck-fast text-green"></i> {isEn ? 'Express 15-30 Mins' : 'Pengiriman 15-30 Menit'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CATEGORIES SHOWCASE GRID */}
            <section className="section categories-showcase-section">
                <div className="container">
                    <div className="section-header center">
                        <span className="sub-header-tag"><i className="fa-solid fa-seedling"></i> {t('cat_tag')}</span>
                        <h2 className="section-title">{t('cat_title')}</h2>
                        <p className="section-subtitle">{t('cat_sub')}</p>
                    </div>

                    <div className="categories-showcase-grid">
                        
                        {/* Category Card 1 */}
                        <div className="cat-showcase-card">
                            <div className="cat-card-img-wrap">
                                <img src="https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=80" alt="Sayuran Daun Hidroponik" />
                                <span className="cat-tag-badge">{isEn ? 'Harvested 05:00 AM' : 'Panen 05:00 WIB'}</span>
                                <span className="cat-stock-count">{isEn ? '6 Products Available' : '6 Produk Ready'}</span>
                            </div>
                            <div className="cat-card-body">
                                <div className="cat-icon-circle">
                                    <i className="fa-solid fa-leaf"></i>
                                </div>
                                <h3>{isEn ? 'Hydroponic Leafy Greens' : 'Sayuran Daun Hidroponik'}</h3>
                                <p>{isEn ? 'Pakchoi, Romaine Lettuce, Horenzo Spinach, Curly Kale, Water Spinach, and Bitter Greens crisp without bitterness.' : 'Pakcoy, Selada Romaine, Bayam Horenzo, Kale Keriting, Kangkung, dan Sawi Pahit segar renyah tanpa pahit.'}</p>
                                <div className="cat-benefits-pills">
                                    <span>{isEn ? 'Pure Nutrients' : 'Nutrisi Murni'}</span>
                                    <span>{isEn ? 'Pesticide Free' : 'Bebas Pestisida'}</span>
                                    <span>{isEn ? 'Crisp & Sweet' : 'Renyah Manis'}</span>
                                </div>
                                <Link href="/shop?cat=leafy" className="btn btn-outline btn-block cat-cta-btn">
                                    <span>{t('explore_cat')}</span>
                                    <i className="fa-solid fa-arrow-right"></i>
                                </Link>
                            </div>
                        </div>

                        {/* Category Card 2 */}
                        <div className="cat-showcase-card">
                            <div className="cat-card-img-wrap">
                                <img src="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80" alt="Buah & Sayur Buah" />
                                <span className="cat-tag-badge">{isEn ? 'Fresh & Naturally Sweet' : 'Segar & Manis Alami'}</span>
                                <span className="cat-stock-count">{isEn ? '2 Products Available' : '2 Produk Ready'}</span>
                            </div>
                            <div className="cat-card-body">
                                <div className="cat-icon-circle">
                                    <i className="fa-solid fa-apple-whole"></i>
                                </div>
                                <h3>{isEn ? 'Fruits & Fruit Veggies' : 'Buah & Sayur Buah'}</h3>
                                <p>{isEn ? 'Sweet Organic Cherry Tomatoes, Hydroponic Strawberry, and garden fresh chili high in antioxidants.' : 'Tomat Ceri Organik Manis, Strawberry Hidroponik Ciwidey, dan cabai kebun segar tinggi antioksidan.'}</p>
                                <div className="cat-benefits-pills">
                                    <span>Super Lycopene</span>
                                    <span>High Vitamin C</span>
                                    <span>Peak Harvest</span>
                                </div>
                                <Link href="/shop?cat=fruits" className="btn btn-outline btn-block cat-cta-btn">
                                    <span>{t('explore_cat')}</span>
                                    <i className="fa-solid fa-arrow-right"></i>
                                </Link>
                            </div>
                        </div>

                        {/* Category Card 3 */}
                        <div className="cat-showcase-card">
                            <div className="cat-card-img-wrap">
                                <img src="https://images.unsplash.com/photo-1608686207856-001b95cf60ca?auto=format&fit=crop&w=800&q=80" alt="Herbal & Rempah Organik" />
                                <span className="cat-tag-badge">{isEn ? 'Aromatics Fresh' : 'Aromatik Fresh'}</span>
                                <span className="cat-stock-count">{isEn ? '1 Product Available' : '1 Produk Ready'}</span>
                            </div>
                            <div className="cat-card-body">
                                <div className="cat-icon-circle">
                                    <i className="fa-solid fa-seedling"></i>
                                </div>
                                <h3>{isEn ? 'Organic Herbs & Spices' : 'Herbal & Rempah Organik'}</h3>
                                <p>{isEn ? 'Fresh aromatic Hydroponic Mint leaves, Rosemary, Thyme, and Basil for culinary dishes & beverages.' : 'Daun Mint Hydroponic harum segar, Rosemary, Thyme, dan Basil aromatik pengharum masakan & minuman.'}</p>
                                <div className="cat-benefits-pills">
                                    <span>{isEn ? 'Essential Oils' : 'Minyak Atsiri Alami'}</span>
                                    <span>{isEn ? 'Fragrant Aroma' : 'Aroma Harum'}</span>
                                    <span>{isEn ? 'Multi Usage' : 'Multi Olahan'}</span>
                                </div>
                                <Link href="/shop?cat=herbs" className="btn btn-outline btn-block cat-cta-btn">
                                    <span>{t('explore_cat')}</span>
                                    <i className="fa-solid fa-arrow-right"></i>
                                </Link>
                            </div>
                        </div>

                        {/* Category Card 4 */}
                        <div className="cat-showcase-card">
                            <div className="cat-card-img-wrap">
                                <img src="https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80" alt="Microgreens & Jamur" />
                                <span className="cat-tag-badge">Superfood Nutrition</span>
                                <span className="cat-stock-count">{isEn ? '2 Products Available' : '2 Produk Ready'}</span>
                            </div>
                            <div className="cat-card-body">
                                <div className="cat-icon-circle">
                                    <i className="fa-solid fa-wheat-awn"></i>
                                </div>
                                <h3>{isEn ? 'Microgreens & Mushrooms' : 'Microgreens & Jamur'}</h3>
                                <p>{isEn ? 'Nutrient dense sprouts and crisp White Oyster Mushrooms rich in natural immunomodulators.' : 'Kecambah buncis gizi tinggi dan Jamur Tiram Putih renyah kaya akan imunomodulator alami.'}</p>
                                <div className="cat-benefits-pills">
                                    <span>{isEn ? '40x Antioxidants' : 'Antioksidan 40x'}</span>
                                    <span>{isEn ? 'High Fiber' : 'Tinggi Serat'}</span>
                                    <span>{isEn ? 'Ready to Cook' : 'Siap Olah'}</span>
                                </div>
                                <Link href="/shop?cat=mushrooms" className="btn btn-outline btn-block cat-cta-btn">
                                    <span>{t('explore_cat')}</span>
                                    <i className="fa-solid fa-arrow-right"></i>
                                </Link>
                            </div>
                        </div>

                        {/* Category Card 5 */}
                        <div className="cat-showcase-card">
                            <div className="cat-card-img-wrap">
                                <img src="https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80" alt="Starter Kit & Nutrisi" />
                                <span className="cat-tag-badge">{isEn ? 'Home Gardening' : 'Kebun Mandiri'}</span>
                                <span className="cat-stock-count">{isEn ? '1 Kit Available' : '1 Paket Ready'}</span>
                            </div>
                            <div className="cat-card-body">
                                <div className="cat-icon-circle">
                                    <i className="fa-solid fa-box-open"></i>
                                </div>
                                <h3>{isEn ? 'Garden Starter Kit' : 'Starter Kit Kebun'}</h3>
                                <p>{isEn ? 'Complete home hydroponic kit: pure AB Mix nutrients, premium seeds, sterile rockwool, and pipe module.' : 'Paket lengkap nutrisi AB Mix murni, benih unggulan, rockwool steril, dan modul pipa berkebun rumahan.'}</p>
                                <div className="cat-benefits-pills">
                                    <span>{isEn ? 'Full Kit' : 'Modul Komplit'}</span>
                                    <span>Pure AB Mix</span>
                                    <span>{isEn ? 'Beginner Guide' : 'Panduan Pemula'}</span>
                                </div>
                                <Link href="/shop?cat=kits" className="btn btn-outline btn-block cat-cta-btn">
                                    <span>{t('explore_cat')}</span>
                                    <i className="fa-solid fa-arrow-right"></i>
                                </Link>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </main>
    );
}
