'use client';

import React from 'react';
import { useShop } from '../../context/ShopContext';

export default function WhyUsPage() {
    const { t, language } = useShop();
    const isEn = language === 'en';

    const comparisonData = [
        {
            param: isEn ? 'Pesticides and Chemicals' : 'Pestisida dan Bahan Kimia',
            soil: isEn ? 'Risk of toxic chemical pesticide residues on leaves' : 'Berisiko residu racun pestisida sintetis pada daun',
            hydro: isEn ? '100% Chemical Pesticide-Free, grown in mesh greenhouse' : '100% Bebas Pestisida Kimia, terlindung kelambu steril'
        },
        {
            param: isEn ? 'Cleanliness and Parasites' : 'Kebersihan dan Parasit',
            soil: isEn ? 'Contaminated with mud soil and earthworm parasite eggs' : 'Terkontaminasi lumpur kotor dan telur cacing tanah',
            hydro: isEn ? '100% Mud-Free, grown cleanly in sterile suspended rockwool' : 'Media Steril 100% Bebas Lumpur, melayang di rockwool'
        },
        {
            param: isEn ? 'Taste and Leaf Texture' : 'Rasa dan Tekstur Daun',
            soil: isEn ? 'Often bitter taste, tough fiber leaves and wilts quickly' : 'Sering terasa pahit, serat ulet dan cepat membusuk',
            hydro: isEn ? 'Naturally sweet, crisp, non-bitter and stays fresh 10 days' : 'Manis Alami, renyah, bebas pahit dan tahan segar 10 hari'
        }
    ];

    return (
        <main>
            {/* HERO BANNER SECTION */}
            <section className="shop-hero-section">
                <div className="container">
                    <div className="shop-hero-card">
                        <div className="shop-hero-content">
                            <span className="sub-header-tag">
                                <i className="fa-solid fa-seedling"></i> {t('why_tag')}
                            </span>
                            <h1 className="shop-title">{t('why_title')}</h1>
                            <p className="shop-subtitle">{t('why_sub')}</p>
                            
                            <div className="shop-stats-pills">
                                <span className="shop-pill"><i className="fa-solid fa-shield-halved text-green"></i> {isEn ? '100% Pesticide Free' : '100% Bebas Pestisida'}</span>
                                <span className="shop-pill"><i className="fa-solid fa-droplet text-green"></i> {isEn ? '95% Water Saving' : 'Hemat Air 95%'}</span>
                                <span className="shop-pill"><i className="fa-solid fa-bolt text-green"></i> {isEn ? '2x Faster Growth' : 'Panen 2x Lebih Cepat'}</span>
                                <span className="shop-pill"><i className="fa-solid fa-wand-magic-sparkles text-green"></i> {isEn ? '100% Sterile Crops' : 'Tanaman 100% Steril'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6 PILAR KEUNGGULAN HIDROPONIK */}
            <section className="section why-us-main-section">
                <div className="container">
                    <div className="section-header center">
                        <span className="sub-header-tag"><i className="fa-solid fa-seedling"></i> {isEn ? 'OUR MAIN ADVANTAGES' : 'KEUNGGULAN UTAMA SAYUR KAMI'}</span>
                        <h2 className="section-title">{isEn ? '6 Reasons Hydroponic Produce is Healthier and Crisper' : '6 Alasan Sayur Hidroponik Lebih Sehat dan Lezat'}</h2>
                        <p className="section-subtitle">{isEn ? 'Why thousands of families switch from traditional market veggies to Devsecora sterile produce.' : 'Mengapa ribuan keluarga beralih dari sayuran pasar biasa ke sayuran hidroponik steril Devsecora.'}</p>
                    </div>

                    <div className="why-us-grid">
                        <div className="why-card">
                            <div className="why-card-top">
                                <div className="why-icon-box">
                                    <i className="fa-solid fa-shield-halved"></i>
                                </div>
                            </div>
                            <h3>{isEn ? '100% Chemical Pesticide-Free' : '100% Bebas Pestisida Kimia'}</h3>
                            <p>{isEn ? 'Grown inside micro-mesh protected greenhouses. Isolated from soil pests without synthetic chemical sprays.' : 'Ditanam di dalam green house terlindung kelambu halus steril. Tanaman terisolasi dari serangga hama sehingga tidak memerlukan semprotan racun pestisida sintetis.'}</p>
                            <div className="why-card-footer">
                                <span className="why-tag-pill"><i className="fa-solid fa-circle-check"></i> Clean and Safe</span>
                            </div>
                        </div>

                        <div className="why-card">
                            <div className="why-card-top">
                                <div className="why-icon-box">
                                    <i className="fa-solid fa-flask-vial"></i>
                                </div>
                            </div>
                            <h3>{isEn ? 'Precise Mineral Nutrition' : 'Nutrisi Mineral Presisi dan Utuh'}</h3>
                            <p>{isEn ? 'Plant roots absorb 100% precision formulated nitrogen, calcium, magnesium, and iron from pure water.' : 'Akar tanaman terendam air nutrisi yang diformulasikan secara presisi mengandung nitrogen, kalsium, magnesium, dan zat besi utuh yang diserap 100% oleh sayuran.'}</p>
                            <div className="why-card-footer">
                                <span className="why-tag-pill"><i className="fa-solid fa-circle-check"></i> Pure Nutrition</span>
                            </div>
                        </div>

                        <div className="why-card">
                            <div className="why-card-top">
                                <div className="why-icon-box">
                                    <i className="fa-solid fa-hand-holding-droplet"></i>
                                </div>
                            </div>
                            <h3>{isEn ? '95% Water Saving and Eco-Friendly' : '95% Lebih Hemat Air dan Eco-Friendly'}</h3>
                            <p>{isEn ? 'Closed-loop water circulation continuously hydrates roots without wasting water into the ground.' : 'Sistem air sirkulasi tertutup membasahi akar secara berulang tanpa terbuang ke tanah, menjadikannya pertanian ramah lingkungan.'}</p>
                            <div className="why-card-footer">
                                <span className="why-tag-pill"><i className="fa-solid fa-circle-check"></i> Save Water 95%</span>
                            </div>
                        </div>

                        <div className="why-card">
                            <div className="why-card-top">
                                <div className="why-icon-box">
                                    <i className="fa-solid fa-face-smile"></i>
                                </div>
                            </div>
                            <h3>{isEn ? 'Naturally Crisp and Bitterness Free' : 'Tekstur Renyah Alami dan Bebas Pahit'}</h3>
                            <p>{isEn ? 'Hydroponic crops never suffer from soil drought stress, yielding sweeter, crunchier, and non-bitter leaves.' : 'Tanaman hidroponik tidak pernah mengalami hambatan tumbuh akibat kekeringan tanah. Hasilnya, daun lebih manis, renyah, segar, dan bebas rasa pahit.'}</p>
                            <div className="why-card-footer">
                                <span className="why-tag-pill"><i className="fa-solid fa-circle-check"></i> Crisp and Sweet</span>
                            </div>
                        </div>

                        <div className="why-card">
                            <div className="why-card-top">
                                <div className="why-icon-box">
                                    <i className="fa-solid fa-wand-magic-sparkles"></i>
                                </div>
                            </div>
                            <h3>{isEn ? 'Free from Soil Mud, Caterpillars and Parasites' : 'Bebas Lumpur, Ulat, dan Parasit Tanah'}</h3>
                            <p>{isEn ? 'Grown cleanly in suspended sterile rockwool. Zero earthworms, soil parasites, or dirty mud residue.' : 'Ditanam bersih di media rockwool steril melayang. Tidak ada cacing tanah, parasit tanah, atau sisa lumpur kotor yang menempel.'}</p>
                            <div className="why-card-footer">
                                <span className="why-tag-pill"><i className="fa-solid fa-circle-check"></i> 100% Sterile</span>
                            </div>
                        </div>

                        <div className="why-card">
                            <div className="why-card-top">
                                <div className="why-icon-box">
                                    <i className="fa-regular fa-clock"></i>
                                </div>
                            </div>
                            <h3>{isEn ? 'Harvested Daily at 05:00 AM' : 'Dipetik Pagi Jam 05:00 WIB'}</h3>
                            <p>{isEn ? 'Crops are picked at cool 05:00 AM temperatures to lock in Vitamin C and chlorophyll, then delivered in 15-30 mins.' : 'Seluruh sayuran dipetik langsung saat udara dingin jam 5 pagi untuk mengunci kadar Vitamin C dan klorofil, lalu dikirim cepat dalam 15-30 menit.'}</p>
                            <div className="why-card-footer">
                                <span className="why-tag-pill"><i className="fa-solid fa-circle-check"></i> Peak Harvest</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* PERBANDINGAN PERTANIAN TANAH VS HIDROPONIK */}
            <section className="section comparison-section">
                <div className="container">
                    <div className="section-header center">
                        <span className="sub-header-tag"><i className="fa-solid fa-scale-balanced"></i> {isEn ? 'QUALITY COMPARISON' : 'PERBANDINGAN KUALITAS'}</span>
                        <h2 className="section-title">{isEn ? 'Traditional Soil Farm vs Devsecora Hydroponics' : 'Pertanian Tanah Biasa vs Hidroponik Devsecora'}</h2>
                        <p className="section-subtitle">{isEn ? 'See clear quality differences between market vegetables and sterile hydroponics.' : 'Lihat perbedaan nyata antara sayuran pasar biasa dengan keunggulan hidroponik steril.'}</p>
                    </div>

                    <div className="comparison-grid">
                        {comparisonData.map((item, idx) => (
                            <div key={idx} className="comparison-card">
                                <h3 className="comparison-param-title">{item.param}</h3>
                                <div className="comparison-cols">
                                    <div className="comp-col soil-col">
                                        <div className="comp-col-header">
                                            <i className="fa-solid fa-xmark text-red"></i>
                                            <span>{isEn ? 'Traditional Soil Farm' : 'Sayuran Pasar / Tanah'}</span>
                                        </div>
                                        <p>{item.soil}</p>
                                    </div>
                                    <div className="comp-col hydro-col">
                                        <div className="comp-col-header">
                                            <i className="fa-solid fa-check text-green"></i>
                                            <span>{isEn ? 'Devsecora Hydroponics' : 'Sayuran Hidroponik Devsecora'}</span>
                                        </div>
                                        <p>{item.hydro}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
