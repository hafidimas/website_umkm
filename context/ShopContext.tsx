'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from '../types';
import { PRODUCTS_DATABASE } from '../data/products';

export type CurrencyType = 'IDR' | 'USD' | 'EUR' | 'SGD';
export type LanguageType = 'id' | 'en';
export type AuthReasonType = 'CART' | 'RECIPES' | 'WISHLIST' | 'GENERAL';
export type ThemeType = 'light' | 'dark';

export interface UserProfile {
    name: string;
    phoneWa?: string;
    email?: string;
}

interface ToastMessage {
    id: string;
    message: string;
    icon: string;
}

const EXCHANGE_RATES: Record<CurrencyType, number> = {
    IDR: 1,
    USD: 15800,
    EUR: 17200,
    SGD: 11800
};

const CURRENCY_SYMBOLS: Record<CurrencyType, string> = {
    IDR: 'Rp ',
    USD: '$ ',
    EUR: '€ ',
    SGD: 'S$ '
};

export const TRANSLATIONS = {
    id: {
        nav_home: 'Beranda',
        nav_shop: 'Toko Sayur',
        nav_categories: 'Kategori',
        nav_why_us: 'Mengapa Hidroponik?',
        nav_recipes: 'Artikel & Resep',
        add_to_cart: 'Tambah Keranjang',
        cart: 'Keranjang',
        wishlist: 'Wishlist',
        search_placeholder: 'Cari pakcoy, selada, tomat ceri, bayam...',
        register_login: 'Daftar / Masuk',
        all_categories: 'Semua Kategori',
        leafy: 'Sayuran Daun',
        fruits: 'Buah & Sayur Buah',
        herbs: 'Herbal & Rempah',
        kits: 'Starter Kit Kebun',
        harvest_today: 'PANEN HARI INI',
        bestsellers_title: 'Produk Sayur Terlaris',
        bestsellers_sub: 'Sayuran hidroponik paling diminati yang dipetik segar pagi ini dari kebun Devsecora.',
        view_all: 'Lihat Semua Sayuran',

        // Dropdown Items
        dropdown_all_veg: 'Semua Sayuran Ready',
        dropdown_leafy: 'Sayuran Daun Segar',
        dropdown_fruits: 'Buah & Sayur Buah',
        dropdown_herbs: 'Herbal & Rempah Organik',
        dropdown_mushrooms: 'Jamur & Microgreens',
        dropdown_kits: 'Nutrisi & Alat Kebun',
        dropdown_all_cat: 'Semua Kategori Kebun',

        // Hero Sections
        home_hero_tag: '100% PANEN SEGAR BEBAS PESTISIDA',
        home_hero_title: 'Sayuran Hidroponik Segar Dipetik Pagi Ini',
        home_hero_sub: 'Rasakan kesegaran daun renyah, manis alami, dan kaya nutrisi utuh tanpa pestisida kimia. Langsung dari green house steril Devsecora ke meja makan Anda.',
        btn_shop_now: 'Belanja Sayur Segar',
        btn_why_us: 'Mengapa Hidroponik?',

        // Categories Page
        cat_tag: 'RAGAM HASIL PANEN UNGGULAN',
        cat_title: 'Kategori Kebun Hidroponik',
        cat_sub: 'Jelajahi berbagai pilihan jenis tanaman segar hasil budidaya teknologi hidroponik presisi.',
        explore_cat: 'Jelajahi Kategori Sayur',

        // Why Us Page
        why_tag: 'KEUNGGULAN UTAMA SAYUR KAMI',
        why_title: '6 Alasan Sayur Hidroponik Lebih Sehat dan Lezat',
        why_sub: 'Mengapa ribuan keluarga beralih dari sayuran pasar biasa ke sayuran hidroponik steril Devsecora.',

        // Articles & Recipes Page
        recipes_tag: 'PANDUAN SEHAT & KULINER',
        recipes_title: 'Artikel Nutrisi & Resep Masakan Khas Indonesia',
        recipes_sub: 'Cari resep masakan Nusantara lezat dan artikel kesehatan ilmiah tentang cara mengolah serta menyimpan sayuran hidroponik.',
        recipes_articles_header: 'Artikel Nutrisi & Tips Perawatan Sayur',
        recipes_main_header: 'Resep Masakan Khas Indonesia',
        view_recipe: 'Lihat Resep & Cara Masak',
        read_article: 'Baca Artikel Lengkap',
        buy_veg_recipe: 'Beli Sayur Bahan Resep Ini',
        reset_search: 'Reset Pencarian',

        // Shop Page & Sidebar
        shop_title: 'Toko Sayur Hidroponik & Organik Kebun Segar',
        shop_sub: 'Seluruh hasil panen dipetik langsung setiap jam 05:00 WIB dari green house steril Devsecora. 100% bebas pestisida kimia sintetis.',
        filter_title: 'Filter Sayur',
        filter_cat: 'Kategori Produk',
        filter_stock: 'Status Ketersediaan',
        filter_ready: 'Ready Stock (Panen Pagi Ini)',
        filter_organic: '100% Bebas Pestisida',
        filter_price: 'Rentang Harga',
        filter_rating: 'Rating Pembeli',
        sort_by: 'Urutkan:',
        sort_popular: 'Terpopuler & Rating Tinggi',
        sort_low: 'Harga: Terendah ke Tertinggi',
        sort_high: 'Harga: Tertinggi ke Terendah',
        sort_name: 'Nama Produk A-Z',

        // Modal Product Detail
        harvest_time: 'Waktu Panen:',
        farm_origin: 'Asal Kebun:',
        nutrition_content: 'Kandungan Nutrisi:',
        storage_tip: 'Cara Simpan Kulkas:',
        culinary_uses: 'Saran Olahan Masakan:',
        reviews_count: 'ulasan pembeli',

        // Cart Drawer
        cart_title: 'Keranjang Sayur',
        empty_cart_title: 'Keranjang Sayur Kosong',
        empty_cart_sub: 'Yuk pilih sayur hidroponik segar panen hari ini!',
        subtotal: 'Subtotal:',
        free_shipping_note: 'Gratis ongkir otomatis untuk pesanan > Rp 100rb.',
        empty_cart_btn: 'Kosongkan Keranjang',
        checkout_btn: 'Lanjut Pembayaran',

        // Footer
        footer_desc: 'Kebun hidroponik terpercaya menyajikan sayuran & buah organik segar bernutrisi tinggi langsung dari kebun ke meja makan Anda.',
        footer_categories: 'Kategori Kebun',
        footer_services: 'Layanan Kebun',
        footer_guarantee: 'Garansi Kesegaran Sayur',
        footer_subscription: 'Langganan Sayur Mingguan',
        footer_consulting: 'Konsultasi Kebun Hidroponik',
        footer_rights: 'Seluruh Hak Cipta Dilindungi.'
    },
    en: {
        nav_home: 'Home',
        nav_shop: 'Fresh Shop',
        nav_categories: 'Categories',
        nav_why_us: 'Why Hydroponics?',
        nav_recipes: 'Articles & Recipes',
        add_to_cart: 'Add to Cart',
        cart: 'Cart',
        wishlist: 'Wishlist',
        search_placeholder: 'Search pakchoi, lettuce, cherry tomatoes, spinach...',
        register_login: 'Register / Login',
        all_categories: 'All Categories',
        leafy: 'Leafy Greens',
        fruits: 'Fruits & Veggies',
        herbs: 'Herbs & Spices',
        kits: 'Garden Starter Kits',
        harvest_today: 'HARVEST TODAY',
        bestsellers_title: 'Bestseller Vegetables',
        bestsellers_sub: 'Top hydroponic produce freshly harvested this morning from Devsecora farm.',
        view_all: 'View All Vegetables',

        // Dropdown Items
        dropdown_all_veg: 'All Available Vegetables',
        dropdown_leafy: 'Fresh Leafy Greens',
        dropdown_fruits: 'Fruits & Fruit Veggies',
        dropdown_herbs: 'Organic Herbs & Spices',
        dropdown_mushrooms: 'Mushrooms & Microgreens',
        dropdown_kits: 'Garden Kits & Nutrients',
        dropdown_all_cat: 'All Farm Categories',

        // Hero Sections
        home_hero_tag: '100% PESTICIDE-FREE FRESH HARVEST',
        home_hero_title: 'Fresh Hydroponic Vegetables Harvested Today',
        home_hero_sub: 'Enjoy crisp, naturally sweet, nutrient-dense vegetables grown without synthetic pesticides. Directly from Devsecora greenhouse to your table.',
        btn_shop_now: 'Shop Fresh Produce',
        btn_why_us: 'Why Hydroponics?',

        // Categories Page
        cat_tag: 'PREMIUM CROP VARIETIES',
        cat_title: 'Hydroponic Farm Categories',
        cat_sub: 'Explore our high-quality hydroponic varieties grown with precision digital farming.',
        explore_cat: 'Explore Veggie Category',

        // Why Us Page
        why_tag: 'OUR MAIN ADVANTAGES',
        why_title: '6 Reasons Hydroponic Produce is Healthier & Crisper',
        why_sub: 'Why thousands of families switch from traditional market veggies to Devsecora sterile produce.',

        // Articles & Recipes Page
        recipes_tag: 'HEALTH GUIDE & CULINARY',
        recipes_title: 'Nutrition Articles & Indonesian Recipes',
        recipes_sub: 'Search delicious traditional recipes and scientific health articles on storing hydroponic veggies.',
        recipes_articles_header: 'Nutrition Articles & Garden Care Tips',
        recipes_main_header: 'Traditional Indonesian Recipes',
        view_recipe: 'View Recipe & Cooking Guide',
        read_article: 'Read Full Article',
        buy_veg_recipe: 'Shop Fresh Produce Now',
        reset_search: 'Reset Search',

        // Shop Page & Sidebar
        shop_title: 'Hydroponic & Organic Fresh Produce Shop',
        shop_sub: 'All produce freshly picked every day at 05:00 AM from Devsecora sterile greenhouse. 100% synthetic pesticide-free.',
        filter_title: 'Filter Veggies',
        filter_cat: 'Product Categories',
        filter_stock: 'Stock Status',
        filter_ready: 'Ready Stock (Morning Harvest)',
        filter_organic: '100% Pesticide Free',
        filter_price: 'Price Range',
        filter_rating: 'Buyer Rating',
        sort_by: 'Sort By:',
        sort_popular: 'Most Popular & High Rating',
        sort_low: 'Price: Low to High',
        sort_high: 'Price: High to Low',
        sort_name: 'Product Name A-Z',

        // Modal Product Detail
        harvest_time: 'Harvest Time:',
        farm_origin: 'Farm Origin:',
        nutrition_content: 'Nutrition Content:',
        storage_tip: 'Fridge Storage Tip:',
        culinary_uses: 'Culinary Suggestions:',
        reviews_count: 'buyer reviews',

        // Cart Drawer
        cart_title: 'Vegetable Cart',
        empty_cart_title: 'Your Cart is Empty',
        empty_cart_sub: 'Pick fresh hydroponic produce harvested today!',
        subtotal: 'Subtotal:',
        free_shipping_note: 'Free shipping automatically for orders > Rp 100k.',
        empty_cart_btn: 'Empty Cart',
        checkout_btn: 'Proceed to Checkout',

        // Footer
        footer_desc: 'Trusted hydroponic farm serving high-nutrient fresh organic veggies & fruits direct from farm to your dining table.',
        footer_categories: 'Farm Categories',
        footer_services: 'Farm Services',
        footer_guarantee: 'Freshness Guarantee',
        footer_subscription: 'Weekly Vegetable Subscription',
        footer_consulting: 'Hydroponic Farm Consulting',
        footer_rights: 'All Rights Reserved.'
    }
};

interface ShopContextType {
    products: Product[];
    cart: CartItem[];
    wishlist: string[];
    selectedProduct: Product | null;
    isCartOpen: boolean;
    toasts: ToastMessage[];
    currency: CurrencyType;
    language: LanguageType;
    theme: ThemeType;
    hasRestorableCart: boolean;

    // AUTHENTICATION STATES & FUNCTIONS
    user: UserProfile | null;
    isLoggedIn: boolean;
    isAuthModalOpen: boolean;
    authReason: AuthReasonType;
    loginUser: (userData: UserProfile) => void;
    logoutUser: () => void;
    openAuthModal: (reason?: AuthReasonType) => void;
    closeAuthModal: () => void;
    requireAuth: (reason: AuthReasonType) => boolean;

    setCurrency: (c: CurrencyType) => void;
    setLanguage: (l: LanguageType) => void;
    toggleTheme: () => void;
    formatPrice: (amountInIDR: number) => string;
    t: (key: keyof typeof TRANSLATIONS['id']) => string;
    addToCart: (productId: string, qty?: number) => void;
    removeFromCart: (productId: string) => void;
    updateQty: (productId: string, delta: number) => void;
    emptyCart: () => void;
    restoreCart: () => void;
    toggleWishlist: (productId: string) => void;
    openProductModal: (productId: string) => void;
    closeProductModal: () => void;
    setIsCartOpen: (open: boolean) => void;
    showToast: (message: string, icon?: string) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [products] = useState<Product[]>(PRODUCTS_DATABASE);
    const [cart, setCart] = useState<CartItem[]>([
        { product: PRODUCTS_DATABASE[0], qty: 2 }
    ]);
    const [previousCart, setPreviousCart] = useState<CartItem[]>([]);
    const [wishlist, setWishlist] = useState<string[]>(['p3']);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
    const [toasts, setToasts] = useState<ToastMessage[]>([]);
    
    // Currency, Language & Theme States
    const [currency, setCurrencyState] = useState<CurrencyType>('IDR');
    const [language, setLanguageState] = useState<LanguageType>('id');
    const [theme, setTheme] = useState<ThemeType>('light');

    // AUTHENTICATION STATES
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
    const [authReason, setAuthReason] = useState<AuthReasonType>('GENERAL');

    // PERSIST USER & THEME IN LOCAL STORAGE
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedUser = localStorage.getItem('devsecora_user');
            if (savedUser) {
                try {
                    setUser(JSON.parse(savedUser));
                } catch (e) {}
            }

            const savedTheme = localStorage.getItem('devsecora_theme') as ThemeType;
            if (savedTheme === 'dark' || savedTheme === 'light') {
                setTheme(savedTheme);
                document.documentElement.setAttribute('data-theme', savedTheme);
            } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                setTheme('dark');
                document.documentElement.setAttribute('data-theme', 'dark');
            }
        }
    }, []);

    const toggleTheme = () => {
        const nextTheme: ThemeType = theme === 'light' ? 'dark' : 'light';
        setTheme(nextTheme);
        if (typeof window !== 'undefined') {
            localStorage.setItem('devsecora_theme', nextTheme);
            document.documentElement.setAttribute('data-theme', nextTheme);
        }
        showToast(
            language === 'id'
                ? `Mode tampilan diubah ke ${nextTheme === 'dark' ? 'Gelap 🌙' : 'Terang ☀️'}`
                : `Theme changed to ${nextTheme === 'dark' ? 'Dark 🌙' : 'Light ☀️'}`,
            nextTheme === 'dark' ? 'fa-moon' : 'fa-sun'
        );
    };

    const isLoggedIn = !!user;

    const loginUser = (userData: UserProfile) => {
        setUser(userData);
        if (typeof window !== 'undefined') {
            localStorage.setItem('devsecora_user', JSON.stringify(userData));
        }
        setIsAuthModalOpen(false);
        showToast(
            language === 'id' ? `Selamat datang kembali, ${userData.name}!` : `Welcome back, ${userData.name}!`,
            'fa-circle-user'
        );
    };

    const logoutUser = () => {
        setUser(null);
        if (typeof window !== 'undefined') {
            localStorage.removeItem('devsecora_user');
        }
        showToast(
            language === 'id' ? 'Anda telah berhasil keluar (logout)' : 'You have logged out successfully',
            'fa-right-from-bracket'
        );
    };

    const openAuthModal = (reason: AuthReasonType = 'GENERAL') => {
        if (typeof window !== 'undefined') {
            window.location.href = `/login?reason=${reason}`;
        }
    };

    const closeAuthModal = () => {
        setIsAuthModalOpen(false);
    };

    const requireAuth = (reason: AuthReasonType): boolean => {
        if (isLoggedIn) return true;
        if (typeof window !== 'undefined') {
            window.location.href = `/login?reason=${reason}`;
        }
        return false;
    };

    const setCurrency = (c: CurrencyType) => {
        setCurrencyState(c);
        showToast(
            language === 'id' ? `Mata uang diubah ke ${c}` : `Currency changed to ${c}`,
            'fa-coins'
        );
    };

    const setLanguage = (l: LanguageType) => {
        setLanguageState(l);
        showToast(
            l === 'id' ? 'Bahasa diubah ke Indonesia 🇮🇩' : 'Language changed to English 🇬🇧',
            'fa-globe'
        );
    };

    const formatPrice = (amountInIDR: number): string => {
        const rate = EXCHANGE_RATES[currency] || 1;
        const converted = amountInIDR / rate;

        if (currency === 'IDR') {
            return CURRENCY_SYMBOLS.IDR + Math.round(converted).toLocaleString('id-ID');
        } else if (currency === 'USD') {
            return CURRENCY_SYMBOLS.USD + converted.toFixed(2);
        } else if (currency === 'EUR') {
            return CURRENCY_SYMBOLS.EUR + converted.toFixed(2);
        } else if (currency === 'SGD') {
            return CURRENCY_SYMBOLS.SGD + converted.toFixed(2);
        }
        return CURRENCY_SYMBOLS.IDR + Math.round(amountInIDR).toLocaleString('id-ID');
    };

    const t = (key: keyof typeof TRANSLATIONS['id']): string => {
        return TRANSLATIONS[language]?.[key] || TRANSLATIONS['id'][key] || key;
    };

    const showToast = (message: string, icon: string = 'fa-check-circle') => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts(prev => [...prev, { id, message, icon }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 1000);
    };

    // PROTECT ADD TO CART: USER MUST BE LOGGED IN BEFORE SHOPPING / ADDING TO CART
    const addToCart = (productId: string, qtyToAdd = 1) => {
        if (!isLoggedIn) {
            openAuthModal('CART');
            return;
        }

        const target = products.find(p => p.id === productId);
        if (!target) return;

        setCart(prev => {
            const existing = prev.find(item => item.product.id === productId);
            if (existing) {
                return prev.map(item =>
                    item.product.id === productId
                        ? { ...item, qty: item.qty + qtyToAdd }
                        : item
                );
            }
            return [...prev, { product: target, qty: qtyToAdd }];
        });

        const msg = language === 'id'
            ? `"${target.title}" ditambahkan ke keranjang!`
            : `"${target.title}" added to cart!`;
        showToast(msg, 'fa-circle-check');
    };

    const removeFromCart = (productId: string) => {
        setCart(prev => prev.filter(item => item.product.id !== productId));
        const msg = language === 'id' ? 'Sayur dihapus dari keranjang' : 'Item removed from cart';
        showToast(msg, 'fa-trash-can');
    };

    const updateQty = (productId: string, delta: number) => {
        setCart(prev => {
            return prev.map(item => {
                if (item.product.id === productId) {
                    const newQty = item.qty + delta;
                    return newQty > 0 ? { ...item, qty: newQty } : null;
                }
                return item;
            }).filter(Boolean) as CartItem[];
        });
    };

    const emptyCart = () => {
        if (cart.length > 0) {
            setPreviousCart(cart);
        }
        setCart([]);
        const msg = language === 'id'
            ? 'Keranjang telah dikosongkan. Klik "Kembalikan" jika tidak sengaja.'
            : 'Cart emptied. Click "Restore" if accidental.';
        showToast(msg, 'fa-rotate-left');
    };

    const restoreCart = () => {
        if (previousCart.length > 0) {
            setCart(previousCart);
            setPreviousCart([]);
            const msg = language === 'id'
                ? 'Pilihan keranjang sebelumnya berhasil dikembalikan!'
                : 'Previous cart selection restored successfully!';
            showToast(msg, 'fa-circle-check');
        }
    };

    // PROTECT WISHLIST: USER MUST BE LOGGED IN BEFORE ADDING WISHLIST
    const toggleWishlist = (productId: string) => {
        if (!isLoggedIn) {
            openAuthModal('WISHLIST');
            return;
        }

        setWishlist(prev => {
            if (prev.includes(productId)) {
                showToast(language === 'id' ? 'Dihapus dari Wishlist' : 'Removed from Wishlist', 'fa-heart');
                return prev.filter(id => id !== productId);
            } else {
                showToast(language === 'id' ? 'Ditambahkan ke Wishlist!' : 'Added to Wishlist!', 'fa-heart');
                return [...prev, productId];
            }
        });
    };

    const openProductModal = (productId: string) => {
        const target = products.find(p => p.id === productId);
        if (target) setSelectedProduct(target);
    };

    const closeProductModal = () => {
        setSelectedProduct(null);
    };

    return (
        <ShopContext.Provider value={{
            products,
            cart,
            wishlist,
            selectedProduct,
            isCartOpen,
            toasts,
            currency,
            language,
            theme,
            hasRestorableCart: previousCart.length > 0,
            
            // Auth Props
            user,
            isLoggedIn,
            isAuthModalOpen,
            authReason,
            loginUser,
            logoutUser,
            openAuthModal,
            closeAuthModal,
            requireAuth,

            setCurrency,
            setLanguage,
            toggleTheme,
            formatPrice,
            t,
            addToCart,
            removeFromCart,
            updateQty,
            emptyCart,
            restoreCart,
            toggleWishlist,
            openProductModal,
            closeProductModal,
            setIsCartOpen,
            showToast
        }}>
            {children}
        </ShopContext.Provider>
    );
};

export const useShop = () => {
    const context = useContext(ShopContext);
    if (!context) {
        throw new Error('useShop must be used within a ShopProvider');
    }
    return context;
};
