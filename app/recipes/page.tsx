'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useShop } from '../../context/ShopContext';

interface ArticleItem {
    id: string;
    title: string;
    titleEn?: string;
    category: string;
    categoryEn?: string;
    image: string;
    readTime: string;
    author: string;
    summary: string;
    summaryEn?: string;
    points: string[];
    tags: string[];
    tagsEn?: string[];
}

interface RecipeItem {
    id: string;
    title: string;
    titleEn?: string;
    category: string;
    categoryEn?: string;
    image: string;
    prepTime: string;
    servings: string;
    difficulty: string;
    calories: string;
    summary: string;
    summaryEn?: string;
    ingredients: string[];
    steps: string[];
    tags: string[];
    tagsEn?: string[];
}

const ARTICLES_DATA: ArticleItem[] = [
    {
        id: 'artikel-pestisida',
        title: '5 Alasan Utama Memilih Sayur Bebas Pestisida Untuk Anak',
        titleEn: '5 Key Reasons to Choose Pesticide-Free Veggies for Kids',
        category: 'Edukasi Kesehatan',
        categoryEn: 'Health Education',
        image: 'https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?auto=format&fit=crop&w=800&q=80',
        readTime: '4 Min Read',
        author: 'Dr. Devsecora Nutritionist',
        summary: 'Residu pestisida kimia pada sayuran pertanian tanah biasa berisiko memicu gangguan sistem imun & sel cerna anak. Pelajari mengapa sayuran hidroponik steril jauh lebih aman.',
        summaryEn: 'Chemical pesticide residues on soil veggies pose risks to children digestive health. Learn why sterile hydroponic produce is vastly safer.',
        points: [
            '1. Menghindari Penumpukan Toksin Kimia Organofosfat pada Organ Anak.',
            '2. Menjaga Keseimbangan Mikroflora Usus & Sistem Pencernaan Bebas Bakteri Tanah.',
            '3. Penyerapan Nutrisi Vitamin C & Mineral 100% Lebih Optimal.',
            '4. Tekstur Manis Alami Membuat Anak Lebih Suka Makan Sayuran.',
            '5. Kepastian Kebersihan Kebun Green House Terkontrol Digital.'
        ],
        tags: ['Panduan Sehat', 'Bebas Toksin', 'Edukasi Gizi'],
        tagsEn: ['Health Guide', 'Toxin Free', 'Nutrition']
    },
    {
        id: 'artikel-simpan-sayur',
        title: 'Cara Menyimpan Sayur Kulkas Agar Tahan Segar Hingga 10 Hari',
        titleEn: 'How to Store Vegetables in Fridge to Stay Fresh up to 10 Days',
        category: 'Tips Dapur',
        categoryEn: 'Kitchen Tips',
        image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80',
        readTime: '3 Min Read',
        author: 'Devsecora Horticulture Team',
        summary: 'Jangan biarkan sayuran Anda cepat layu dan membusuk di kulkas. Simak tips ilmiah mengontrol kelembaban dan teknik bungkus khusus sayur hidroponik.',
        summaryEn: 'Do not let your vegetables wilt quickly. Learn scientific humidity control techniques for storing hydroponic produce.',
        points: [
            '1. Jangan mencuci sayur sebelum disimpan di kulkas jika belum mau dimasak (kelembaban memicu pembusukan).',
            '2. Gunakan wadah kedap udara atau bungkus bagian akar dengan tisu dapur yang sedikit lembab.',
            '3. Atur suhu chiller kulkas pada kisaran 4°C - 7°C (posisi laci sayur terbawah).',
            '4. Pisahkan penyimpanan sayuran daun dari buah yang mengeluarkan gas etilen seperti pisang dan apel.'
        ],
        tags: ['Tips Hemat Uang', 'Zero Waste', 'Simpan Higienis'],
        tagsEn: ['Money Saving', 'Zero Waste', 'Hygienic Storage']
    },
    {
        id: 'artikel-hidroponik-vs-tanah',
        title: 'Perbedaan Gizi Sayur Hidroponik vs Sayur Pasar Biasa',
        titleEn: 'Hydroponic vs Traditional Produce: Nutritional Differences',
        category: 'Riset Pertanian',
        categoryEn: 'Agri Research',
        image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
        readTime: '5 Min Read',
        author: 'Farm Agronomist',
        summary: 'Penelitian laboratorium menunjukkan sayur hidroponik memiliki kadar Vitamin C dan Klorofil hingga 30% lebih tinggi karena asupan air nutrisi mineral yang terukur konsisten.',
        summaryEn: 'Lab studies show hydroponic produce has up to 30% higher Vitamin C and Chlorophyll levels due to consistent nutrient feeding.',
        points: [
            '1. Kadar Vitamin C terkunci utuh karena dipetik pada suhu dingin jam 5 pagi.',
            '2. Tanaman tidak mengalami hambatan stres air yang menyebabkan rasa pahit pada daun.',
            '3. Media tanam rockwool steril 100% bebas dari telur parasit & cacing tanah.'
        ],
        tags: ['Riset Nutrisi', 'Bebas Pahit', 'Klorofil Tinggi'],
        tagsEn: ['Nutrition Research', 'Bitter Free', 'High Chlorophyll']
    }
];

const RECIPES_DATA: RecipeItem[] = [
    {
        id: 'gado-gado-hidroponik',
        title: 'Gado-Gado Spesial Khas Serang & Bumbu Kacang Sangrai',
        titleEn: 'Special Serang Gado-Gado with Roasted Peanut Sauce',
        category: 'Salad & Karedok',
        categoryEn: 'Salads & Raw Greens',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
        prepTime: '20 Mins',
        servings: '4 Servings',
        difficulty: 'Medium',
        calories: '280 Kcal',
        summary: 'Gado-gado sehat menggunakan rebusan singkat selada butterhead, bayam, dan kangkung hidroponik bebas ulat dengan siraman bumbu kacang sangrai lezat.',
        summaryEn: 'Healthy traditional Gado-Gado using blanched crisp butterhead lettuce, spinach, and sweet peanut dressing.',
        ingredients: [
            '100g Selada Butterhead Hidroponik (robek kasar)',
            '100g Bayam Hijau Hidroponik (rebus 1 menit)',
            '100g Kangkung Hidroponik (rebus 1 menit)',
            '200g Tahu & Tempe Goreng (potong dadu)',
            '2 butir Telur Rebus (belah dua)',
            '150g Kacang Tanah Sangrai (haluskan bersama cabai, gula merah, asam jawa, dan garam)'
        ],
        steps: [
            'Susun sayuran hidroponik rebus dan selada segar di atas piring saji.',
            'Tambahkan potongan tahu, tempe goreng, dan telur rebus.',
            'Siram melimpah dengan bumbu kacang sangrai halus yang sudah diseduh air hangat.',
            'Taburi bawang goreng dan kerupuk renyah. Sajikan segera.'
        ],
        tags: ['Kuliner Banten', 'Bumbu Sangrai', 'Tinggi Serat'],
        tagsEn: ['Banten Culinary', 'Roasted Sauce', 'High Fiber']
    },
    {
        id: 'sup-bayam-jagung-manis',
        title: 'Sup Bening Bayam Horenzo & Jagung Manis',
        titleEn: 'Clear Spinach & Sweet Corn Soup',
        category: 'Sup & Soto Nusantara',
        categoryEn: 'Soups & Stews',
        image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80',
        prepTime: '15 Mins',
        servings: '4 Servings',
        difficulty: 'Easy',
        calories: '95 Kcal',
        summary: 'Sup bening segar pengunggah selera kaya akan zat besi alami. Sangat disukai anak-anak dan keluarga untuk santap siang seimbang.',
        summaryEn: 'Light, comforting clear soup packed with bioavailable plant iron and sweet corn chunks for family lunch.',
        ingredients: [
            '200g Bayam Horenzo Hidroponik (petik daunnya)',
            '1 buah Jagung Manis (potong-potong)',
            '1 buah Tomat Ceri Hidroponik (belah dua)',
            '3 siung Bawang Merah (iris tipis)',
            '2cm Temu Kunci (memarkan)',
            '1 liter Air, Garam & Gula secukupnya'
        ],
        steps: [
            'Didihkan 1 liter air di dalam panci bersama irisan bawang merah dan memaran temu kunci.',
            'Masukkan potongan jagung manis, masak selama 5-7 menit hingga empuk manis.',
            'Bumbui dengan garam dan sedikit gula pasir.',
            'Masukkan bayam horenzo hidroponik dan tomat ceri, masak cukup 1-2 menit agar kandungan gizi tetap utuh. Angkat dan sajikan hangat.'
        ],
        tags: ['Tinggi Zat Besi (Fe)', 'Aman Untuk Asam Urat', 'Sup Penjaga Imunitas'],
        tagsEn: ['High Bioavailable Iron', 'Uric Acid Safe', 'Immune Boosting']
    },
    {
        id: 'tumis-kangkung-terasi',
        title: 'Tumis Kangkung Terasi Pedas Gurih',
        titleEn: 'Spicy Shrimp-Paste Stir-Fried Water Spinach',
        category: 'Tumisan Cepat',
        categoryEn: 'Quick Stir-Fry',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
        prepTime: '8 Mins',
        servings: '3 Servings',
        difficulty: 'Very Easy',
        calories: '140 Kcal',
        summary: 'Kangkung hidroponik super hijau tanpa batang ulet/keras, ditumis dengan bumbu terasi udang sangrai khas Nusantara yang harum gurih.',
        summaryEn: 'Tender mud-free water spinach sautéed with fragrant roasted shrimp paste and fiery red chillies.',
        ingredients: [
            '250g Kangkung Hidroponik Devsecora (petik renyah)',
            '4 siung Bawang Merah & 2 siung Bawang Putih (iris)',
            '5 buah Cabai Rawit Merah (iris serong)',
            '1 sdt Terasi Udang Bakar',
            '1 sdm Saus Tiram',
            'Minyak goreng secukupnya'
        ],
        steps: [
            'Panaskan minyak tumis, masukkan irisan bawang merah, bawang putih, cabai rawit, dan terasi udang bakar. Tumis hingga harum semerbak.',
            'Masukkan kangkung hidroponik bersih yang telah dicuci.',
            'Tambahkan saus tiram dan sedikit garam, aduk cepat dengan api besar selama 2 menit.',
            'Angkat dan sajikan renyah hijau harum.'
        ],
        tags: ['Tumis 8 Menit', 'Batang Renyah', 'Pedas Gurih'],
        tagsEn: ['8-Min Stir Fry', 'Crispy Stems', 'Spicy Savory']
    },
    {
        id: 'infused-water-mint-lemon',
        title: 'Es Mint Lemonade & Infused Water Kesegaran Alami',
        titleEn: 'Fresh Mint Lemonade & Detox Infused Water',
        category: 'Minuman & Juice Sehat',
        categoryEn: 'Drinks & Juices',
        image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
        prepTime: '5 Mins',
        servings: '2 Servings',
        difficulty: 'Very Easy',
        calories: '60 Kcal',
        summary: 'Minuman pelepas dahaga harum alami menggunakan daun mint hidroponik kaya minyak atsiri yang dipadukan dengan kesegaran jeruk nipis.',
        summaryEn: 'Zesty thirst-quencher crafting essential oils from bruised hydroponic mint leaves combined with fresh lime juice.',
        ingredients: [
            '15 lembar Daun Mint Hydroponic Devsecora (remas lembut)',
            '2 buah Jeruk Nipis / Lemon (peras airnya)',
            '2 sdm Madu Murni Alami',
            '300ml Air Kelapa Muda / Sparkling Soda',
            'Es batu secukupnya'
        ],
        steps: [
            'Masukkan daun mint hidroponik dan perasan jeruk nipis ke dalam gelas saji.',
            'Tekan-tekan daun mint dengan sendok agar aroma minyak atsiri alami keluar harum.',
            'Tambahkan madu murni dan es batu sesuai selera.',
            'Tuangkan air kelapa segar / sparkling soda dingin. Aduk rata dan hiasi dengan pucuk daun mint segar.'
        ],
        tags: ['Sensasi Segar Alami', 'Kaya Vitamin C', 'Anti Penat & Alami'],
        tagsEn: ['Natural Refreshment', 'Vitamin C Rich', 'Anti Stress']
    }
];

export default function RecipesPage() {
    const { t, language, isLoggedIn, openAuthModal, requireAuth } = useShop();
    const isEn = language === 'en';

    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedRecipeCat, setSelectedRecipeCat] = useState<string>('Semua');
    const [activeModalItem, setActiveModalItem] = useState<{
        type: 'article' | 'recipe';
        data: ArticleItem | RecipeItem;
    } | null>(null);

    const recipeCategories = isEn
        ? [
            { key: 'Semua', label: 'All Recipes', icon: 'fa-border-all' },
            { key: 'Quick Stir-Fry', label: 'Quick Stir-Fry', icon: 'fa-fire-burner' },
            { key: 'Salads & Raw Greens', label: 'Salads & Raw Greens', icon: 'fa-leaf' },
            { key: 'Soups & Stews', label: 'Soups & Stews', icon: 'fa-bowl-food' },
            { key: 'Drinks & Juices', label: 'Drinks & Juices', icon: 'fa-glass-water' }
        ]
        : [
            { key: 'Semua', label: 'Semua Resep', icon: 'fa-border-all' },
            { key: 'Tumisan Cepat', label: 'Tumisan Cepat', icon: 'fa-fire-burner' },
            { key: 'Salad & Karedok', label: 'Salad & Karedok', icon: 'fa-leaf' },
            { key: 'Sup & Soto Nusantara', label: 'Sup & Soto Nusantara', icon: 'fa-bowl-food' },
            { key: 'Minuman & Juice Sehat', label: 'Minuman & Juice Sehat', icon: 'fa-glass-water' }
        ];

    const filteredArticles = useMemo(() => {
        return ARTICLES_DATA.filter(art => {
            const q = searchQuery.toLowerCase().trim();
            if (!q) return true;
            const titleMatch = (isEn && art.titleEn ? art.titleEn : art.title).toLowerCase().includes(q);
            const summaryMatch = (isEn && art.summaryEn ? art.summaryEn : art.summary).toLowerCase().includes(q);
            return titleMatch || summaryMatch;
        });
    }, [searchQuery, isEn]);

    const filteredRecipes = useMemo(() => {
        return RECIPES_DATA.filter(rec => {
            const q = searchQuery.toLowerCase().trim();
            const matchesCat = selectedRecipeCat === 'Semua' || rec.category === selectedRecipeCat || rec.categoryEn === selectedRecipeCat;
            if (!q) return matchesCat;
            const titleMatch = (isEn && rec.titleEn ? rec.titleEn : rec.title).toLowerCase().includes(q);
            const summaryMatch = (isEn && rec.summaryEn ? rec.summaryEn : rec.summary).toLowerCase().includes(q);
            return matchesCat && (titleMatch || summaryMatch);
        });
    }, [selectedRecipeCat, searchQuery, isEn]);

    const handleOpenItem = (type: 'article' | 'recipe', data: ArticleItem | RecipeItem) => {
        setActiveModalItem({ type, data });
    };

    return (
        <main>
            {/* HERO BANNER SECTION */}
            <section className="shop-hero-section">
                <div className="container">
                    <div className="shop-hero-card">
                        <div className="shop-hero-content" style={{ maxWidth: '800px' }}>
                            <span className="sub-header-tag">
                                <i className="fa-solid fa-book-open-reader"></i> {t('recipes_tag')}
                            </span>
                            <h1 className="shop-title">{t('recipes_title')}</h1>
                            <p className="shop-subtitle">
                                {t('recipes_sub')}
                            </p>

                            {/* SEARCH BAR GLOBAL */}
                            <div className="recipe-search-box">
                                <div className="recipe-search-input-wrap">
                                    <input
                                        type="text"
                                        placeholder={isEn ? "Search articles, fridge storage tips, gado-gado, pakchoi..." : "Cari artikel gizi, simpan kulkas, gado-gado, pakcoy, karedok..."}
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="recipe-search-input"
                                    />
                                    <i className="fa-solid fa-magnifying-glass recipe-search-icon"></i>
                                </div>
                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={() => setSearchQuery('')}
                                        className="btn btn-outline"
                                        style={{ borderRadius: 'var(--radius-full)' }}
                                    >
                                        {t('reset_search')}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CONTAINER ATAS: ARTIKEL */}
            {filteredArticles.length > 0 && (
                <section className="section articles-section" style={{ padding: '60px 0' }}>
                    <div className="container">
                        <div className="section-header center">
                            <span className="sub-header-tag"><i className="fa-solid fa-newspaper"></i> {isEn ? 'ARTICLES SECTION' : 'BAGIAN ARTIKEL & TIPS'}</span>
                            <h2 className="section-title">{t('recipes_articles_header')}</h2>
                            <p className="section-subtitle">{isEn ? `Showing ${filteredArticles.length} nutrition articles matching your search.` : `Menampilkan ${filteredArticles.length} artikel nutrisi dan panduan kebun.`}</p>
                        </div>

                        <div className="recipe-grid">
                            {filteredArticles.map(article => {
                                const artTitle = isEn && article.titleEn ? article.titleEn : article.title;
                                const artSummary = isEn && article.summaryEn ? article.summaryEn : article.summary;
                                const artCat = isEn && article.categoryEn ? article.categoryEn : article.category;
                                const artTags = isEn && article.tagsEn ? article.tagsEn : article.tags;

                                return (
                                    <div
                                        key={article.id}
                                        className="recipe-card"
                                        onClick={() => handleOpenItem('article', article)}
                                    >
                                        <div className="recipe-card-img-wrap">
                                            <img src={article.image} alt={artTitle} />
                                            <span className="recipe-type-badge artikel">
                                                <i className="fa-solid fa-newspaper"></i> {artCat}
                                            </span>
                                        </div>

                                        <div className="recipe-card-body">
                                            <div className="recipe-card-meta">
                                                <span><i className="fa-regular fa-clock text-green"></i> {article.readTime}</span>
                                                <span><i className="fa-solid fa-user-doctor text-green"></i> {article.author}</span>
                                            </div>

                                            <h3 className="recipe-card-title">{artTitle}</h3>
                                            <p className="recipe-card-summary">{artSummary}</p>

                                            <div className="recipe-card-tags">
                                                {artTags.map((tag, idx) => (
                                                    <span key={idx} className="recipe-tag">{tag}</span>
                                                ))}
                                            </div>

                                            <div className="recipe-cta-btn">
                                                <span>{t('read_article')}</span>
                                                <i className="fa-solid fa-arrow-right"></i>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}

            {/* CONTAINER BAWAH: RESEP */}
            <section className="section recipes-section" style={{ padding: '60px 0' }}>
                <div className="container">
                    <div className="section-header center">
                        <span className="sub-header-tag"><i className="fa-solid fa-utensils"></i> {isEn ? 'INDONESIAN RECIPES' : 'RESEP MASAKAN SEHAT'}</span>
                        <h2 className="section-title">{t('recipes_main_header')}</h2>
                        <p className="section-subtitle">{isEn ? 'Cook delicious traditional dishes using fresh Devsecora hydroponic produce.' : 'Kreasi masakan sehat khas Indonesia menggunakan bahan-bahan sayur segar langsung dari kebun.'}</p>
                    </div>

                    {/* CATEGORY FILTER TABS */}
                    <div className="recipe-cat-tabs">
                        {recipeCategories.map((cat, idx) => (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => setSelectedRecipeCat(cat.key)}
                                className={`recipe-cat-tab ${selectedRecipeCat === cat.key ? 'active' : ''}`}
                            >
                                <i className={`fa-solid ${cat.icon}`}></i>
                                <span>{cat.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* RESULTS COUNT HEADER */}
                    <div className="recipe-results-header">
                        <h2>{selectedRecipeCat === 'Semua' ? (isEn ? 'Main Recipe Collection' : 'Koleksi Resep Kuliner Utama') : selectedRecipeCat}</h2>
                        <span>{filteredRecipes.length} {isEn ? 'Recipes Ready to Cook' : 'Resep Siap Dimasak'}</span>
                    </div>

                    {/* RECIPES GRID */}
                    <div className="recipe-grid">
                        {filteredRecipes.map(recipe => {
                            const recTitle = isEn && recipe.titleEn ? recipe.titleEn : recipe.title;
                            const recSummary = isEn && recipe.summaryEn ? recipe.summaryEn : recipe.summary;
                            const recCat = isEn && recipe.categoryEn ? recipe.categoryEn : recipe.category;
                            const recTags = isEn && recipe.tagsEn ? recipe.tagsEn : recipe.tags;

                            return (
                                <div
                                    key={recipe.id}
                                    className="recipe-card"
                                    onClick={() => handleOpenItem('recipe', recipe)}
                                >
                                    <div className="recipe-card-img-wrap">
                                        <img src={recipe.image} alt={recTitle} />
                                        <span className="recipe-type-badge resep">
                                            🍳 {recCat}
                                        </span>
                                    </div>

                                    <div className="recipe-card-body">
                                        <div className="recipe-card-meta">
                                            <span><i className="fa-regular fa-clock text-green"></i> {recipe.prepTime}</span>
                                            <span><i className="fa-solid fa-users text-green"></i> {recipe.servings}</span>
                                            <span><i className="fa-solid fa-bolt text-green"></i> {recipe.calories}</span>
                                        </div>

                                        <h3 className="recipe-card-title">{recTitle}</h3>
                                        <p className="recipe-card-summary">{recSummary}</p>

                                        <div className="recipe-card-tags">
                                            {recTags.map((tag, idx) => (
                                                <span key={idx} className="recipe-tag">{tag}</span>
                                            ))}
                                        </div>

                                        <div className="recipe-cta-btn">
                                            <span>{t('view_recipe')}</span>
                                            <i className="fa-solid fa-arrow-right"></i>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* INTERACTIVE DETAIL MODAL */}
            {activeModalItem && (
                <div className="recipe-modal-backdrop" onClick={() => setActiveModalItem(null)}>
                    <div className="recipe-modal-content" onClick={(e) => e.stopPropagation()}>
                        <button
                            type="button"
                            className="recipe-modal-close"
                            onClick={() => setActiveModalItem(null)}
                        >
                            <i className="fa-solid fa-xmark"></i>
                        </button>

                        {activeModalItem.type === 'article' ? (
                            /* ARTIKEL DETAIL MODAL */
                            <div className="recipe-modal-inner">
                                <div className="recipe-modal-header-img">
                                    <img src={(activeModalItem.data as ArticleItem).image} alt="" />
                                    <span className="recipe-type-badge artikel">
                                        <i className="fa-solid fa-newspaper"></i> {isEn && (activeModalItem.data as ArticleItem).categoryEn ? (activeModalItem.data as ArticleItem).categoryEn : (activeModalItem.data as ArticleItem).category}
                                    </span>
                                </div>

                                <div className="recipe-modal-body">
                                    <div className="recipe-card-meta" style={{ marginBottom: '12px' }}>
                                        <span><i className="fa-regular fa-clock text-green"></i> {(activeModalItem.data as ArticleItem).readTime}</span>
                                        <span><i className="fa-solid fa-user-doctor text-green"></i> {(activeModalItem.data as ArticleItem).author}</span>
                                    </div>

                                    <h2 className="recipe-modal-title">
                                        {isEn && (activeModalItem.data as ArticleItem).titleEn ? (activeModalItem.data as ArticleItem).titleEn : activeModalItem.data.title}
                                    </h2>

                                    <div className="recipe-modal-points">
                                        <h4>{isEn ? 'Key Nutrition Highlights:' : 'Poin Utama Pembahasan Nutrisi:'}</h4>
                                        <ul>
                                            {(activeModalItem.data as ArticleItem).points.map((pt, i) => (
                                                <li key={i}>{pt}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                                        <Link href="/shop" className="btn btn-primary">
                                            <i className="fa-solid fa-basket-shopping"></i> {t('buy_veg_recipe')}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* RESEP DETAIL MODAL */
                            <div className="recipe-modal-inner">
                                <div className="recipe-modal-header-img">
                                    <img src={(activeModalItem.data as RecipeItem).image} alt="" />
                                    <span className="recipe-type-badge resep">
                                        🍳 {isEn && (activeModalItem.data as RecipeItem).categoryEn ? (activeModalItem.data as RecipeItem).categoryEn : (activeModalItem.data as RecipeItem).category}
                                    </span>
                                </div>

                                <div className="recipe-modal-body">
                                    <div className="recipe-card-meta" style={{ marginBottom: '12px' }}>
                                        <span><i className="fa-regular fa-clock text-green"></i> {(activeModalItem.data as RecipeItem).prepTime}</span>
                                        <span><i className="fa-solid fa-users text-green"></i> {(activeModalItem.data as RecipeItem).servings}</span>
                                        <span><i className="fa-solid fa-bolt text-green"></i> {(activeModalItem.data as RecipeItem).calories}</span>
                                    </div>

                                    <h2 className="recipe-modal-title">
                                        {isEn && (activeModalItem.data as RecipeItem).titleEn ? (activeModalItem.data as RecipeItem).titleEn : activeModalItem.data.title}
                                    </h2>

                                    <div className="recipe-modal-columns" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', margin: '20px 0' }}>
                                        <div className="recipe-ingredients-box">
                                            <h4><i className="fa-solid fa-carrot text-green"></i> {isEn ? 'Fresh Ingredients:' : 'Bahan-Bahan Segar:'}</h4>
                                            <ul>
                                                {(activeModalItem.data as RecipeItem).ingredients.map((ing, i) => (
                                                    <li key={i}>{ing}</li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="recipe-steps-box">
                                            <h4><i className="fa-solid fa-fire text-green"></i> {isEn ? 'Cooking Steps:' : 'Langkah Memasak:'}</h4>
                                            <ol>
                                                {(activeModalItem.data as RecipeItem).steps.map((st, i) => (
                                                    <li key={i}>{st}</li>
                                                ))}
                                            </ol>
                                        </div>
                                    </div>

                                    <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
                                        <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                                            💡 {isEn ? 'Use fresh Devsecora hydroponic produce for maximum nutrients.' : 'Gunakan sayur segar hidroponik Devsecora untuk nutrisi terbaik.'}
                                        </div>
                                        <Link href="/shop" className="btn btn-primary">
                                            <i className="fa-solid fa-basket-shopping"></i> {t('buy_veg_recipe')}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </main>
    );
}
