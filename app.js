/* ==========================================================================
   DEVSECORA HYDROPONICS - INTERACTIVE JAVASCRIPT LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ----------------------------------------------------------------------
    // 1. HYDROPONIC PRODUCT DATABASE WITH VARIED RATINGS (3.0 - 5.0 STARS)
    // ----------------------------------------------------------------------
    const products = [
        {
            id: 'p1',
            title: 'Pakcoy Hidroponik Segar (250g)',
            category: 'leafy',
            categoryName: 'Sayuran Daun',
            price: 14500,
            originalPrice: 18000,
            rating: 4.9,
            reviews: 142,
            discount: '-19%',
            image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80',
            desc: 'Pakcoy segar organik hasil panen hidroponik tanpa pestisida. Tekstur renyah alami, rasa manis segar seimbang tanpa pahit.',
            weight: '250 Gram / Pack',
            harvestTime: 'Panen Pagi Ini (05:00 WIB)',
            stockStatus: '🟢 Ready Stock (25 Pack)',
            farmOrigin: 'Green House Steril Devsecora, Jakarta',
            nutrition: 'Tinggi Vitamin A, C, K, Kalsium & Zat Besi',
            storageTip: 'Bungkus tisu/kertas, simpan kulkas 4-8°C (Tahan 7-10 hari)',
            culinaryUses: 'Tumis garlic, sup bening, juice detox hijau, salad'
        },
        {
            id: 'p2',
            title: 'Selada Romaine Hydroponic (250g)',
            category: 'leafy',
            categoryName: 'Sayuran Daun',
            price: 16000,
            originalPrice: 20000,
            rating: 4.6,
            reviews: 98,
            discount: '-20%',
            image: 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?auto=format&fit=crop&w=600&q=80',
            desc: 'Daun selada romaine hidroponik hijau segar manis dan renyah. Dipetik jam 5 pagi, sangat ideal untuk bahan utama salad sehat.',
            weight: '250 Gram / Pack',
            harvestTime: 'Panen Pagi Ini (05:15 WIB)',
            stockStatus: '🟢 Ready Stock (30 Pack)',
            farmOrigin: 'Green House Steril Devsecora, Jakarta',
            nutrition: 'Kaya Asam Folat, Vitamin K, Fiber & Mineral Alami',
            storageTip: 'Simpan dalam wadah kedap di kulkas (Tahan 7 hari)',
            culinaryUses: 'Caesar Salad, Wraps sehat, burger bun pengganti roti'
        },
        {
            id: 'p3',
            title: 'Tomat Ceri Organik Manis (300g)',
            category: 'fruits',
            categoryName: 'Buah & Sayur Buah',
            price: 22500,
            originalPrice: 28000,
            rating: 4.2,
            reviews: 115,
            discount: '-20%',
            image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
            desc: 'Tomat ceri merah berkulit mulus dengan rasa asam-manis segar seimbang. Kaya antioksidan likopen dan vitamin C alami.',
            weight: '300 Gram / Box',
            harvestTime: 'Panen Pagi Ini (05:30 WIB)',
            stockStatus: '🟢 Ready Stock (18 Box)',
            farmOrigin: 'Kebun Hydro Fruit Devsecora, Bogor',
            nutrition: 'Tinggi Likopen Antioksidan, Vitamin C & Potassium',
            storageTip: 'Suhu ruang agar rasa maksimal atau kulkas agar dingin',
            culinaryUses: 'Camilan langsung, salad tomat, pasta sauce, panggang'
        },
        {
            id: 'p4',
            title: 'Bayam Jepang Horenzo (250g)',
            category: 'leafy',
            categoryName: 'Sayuran Daun',
            price: 18000,
            originalPrice: 24000,
            rating: 3.8,
            reviews: 86,
            discount: '-25%',
            image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80',
            desc: 'Bayam Horenzo lembut kaya zat besi dan zat hijau daun murni. Ditanam secara hidroponik bersih bebas tanah.',
            weight: '250 Gram / Pack',
            harvestTime: 'Panen Pagi Ini (05:10 WIB)',
            stockStatus: '🟢 Ready Stock (20 Pack)',
            farmOrigin: 'Green House Steril Devsecora, Jakarta',
            nutrition: 'Super Rich Iron (Zat Besi), Magnesium & Klorofil',
            storageTip: 'Cuci saat hendak dimasak saja, simpan kering di kulkas',
            culinaryUses: 'Horenzo Gomaae, sup bening bayam, smoothies zat besi'
        },
        {
            id: 'p5',
            title: 'Daun Mint Segar Hydroponic (100g)',
            category: 'herbs',
            categoryName: 'Herbal & Rempah',
            price: 12000,
            originalPrice: 15000,
            rating: 3.5,
            reviews: 64,
            discount: '-20%',
            image: 'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?auto=format&fit=crop&w=600&q=80',
            desc: 'Aroma menthol harum segar yang kuat. Sangat pas untuk campuran minuman dingin, mojito, teh herbal, atau hiasan hidangan.',
            weight: '100 Gram / Pack',
            harvestTime: 'Panen Pagi Ini (05:45 WIB)',
            stockStatus: '🟢 Ready Stock (15 Pack)',
            farmOrigin: 'Kebun Aromatik Devsecora, Bandung',
            nutrition: 'Minyak Atsiri Menthol, Antioksidan & Pencernaan',
            storageTip: 'Masukkan tangkai dalam gelas air sedikit di kulkas',
            culinaryUses: 'Teh mint segar, Mojito non-alkohol, infusi air, garnish'
        },
        {
            id: 'p6',
            title: 'Buah Strawberry Hidroponik (250g)',
            category: 'fruits',
            categoryName: 'Buah & Sayur Buah',
            price: 35000,
            originalPrice: 45000,
            rating: 5.0,
            reviews: 210,
            discount: '-22%',
            image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=600&q=80',
            desc: 'Buah stroberi merah merona manis segar panen kebun hidroponik. Bebas semprotan kimia pestisida, langsung bisa dikonsumsi.',
            weight: '250 Gram / Box',
            harvestTime: 'Panen Pagi Ini (06:00 WIB)',
            stockStatus: '🟢 Ready Stock (12 Box)',
            farmOrigin: 'Kebun Hydro Fruit Devsecora, Ciwidey',
            nutrition: 'Super Tinggi Vitamin C & Anti-Inflamasi Alami',
            storageTip: 'Simpan di kulkas tanpa mencuci terlebih dahulu',
            culinaryUses: 'Buah segar, oatmeal topping, strawberry juice, tart'
        },
        {
            id: 'p7',
            title: 'Microgreens Mix Superfood (150g)',
            category: 'mushrooms',
            categoryName: 'Microgreens',
            price: 28000,
            originalPrice: 35000,
            rating: 4.4,
            reviews: 52,
            discount: '-20%',
            image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80',
            desc: 'Tunas muda tanaman kaya nutrisi 40x lebih tinggi dibanding sayur dewasa. Pendamping steak, soup, dan garnish bernutrisi tinggi.',
            weight: '150 Gram / Box',
            harvestTime: 'Panen Pagi Ini (05:00 WIB)',
            stockStatus: '🟢 Ready Stock (14 Box)',
            farmOrigin: 'Indoor Hydro Farm Devsecora, Jakarta',
            nutrition: 'Nutrisi 40x Lebih Tinggi Dibanding Sayur Dewasa',
            storageTip: 'Simpan di box pendingin dengan kertas serap lembab',
            culinaryUses: 'Garnish steak, topping avocado toast, campuran salad'
        },
        {
            id: 'p8',
            title: 'Kale Keriting Hydroponic (200g)',
            category: 'leafy',
            categoryName: 'Sayuran Daun',
            price: 24000,
            originalPrice: 30000,
            rating: 4.1,
            reviews: 78,
            discount: '-20%',
            image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80',
            desc: 'Raja superfood kaya nutrisi dengan serat tinggi. Daun kale keriting hidroponik hijau pekat renyah kaya antioksidan.',
            weight: '200 Gram / Pack',
            harvestTime: 'Panen Pagi Ini (05:20 WIB)',
            stockStatus: '🟢 Ready Stock (15 Pack)',
            farmOrigin: 'Green House Steril Devsecora, Jakarta',
            nutrition: 'King of Superfoods: Vitamin C, K, Omega-3 & Fiber',
            storageTip: 'Bersihkan tangkai keras, simpan daun kering di kulkas',
            culinaryUses: 'Kale Chips panggang, Green Juice Detox, Salad Kale'
        },
        {
            id: 'p9',
            title: 'Jamur Tiram Organik Segar (250g)',
            category: 'mushrooms',
            categoryName: 'Jamur Organik',
            price: 15000,
            originalPrice: 18000,
            rating: 3.4,
            reviews: 94,
            discount: '-17%',
            image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80',
            desc: 'Jamur tiram putih bersih organik kaya akan protein nabati dan serat lembut. Ditanam di media steril bebas pestisida.',
            weight: '250 Gram / Pack',
            harvestTime: 'Panen Pagi Ini (04:30 WIB)',
            stockStatus: '🟢 Ready Stock (22 Pack)',
            farmOrigin: 'Kumbung Organik Devsecora, Lembang',
            nutrition: 'Protein Nabati Tinggi, Beta-Glukan & Bebas Lemak',
            storageTip: 'Bungkus kantong kertas di kulkas agar tidak lembab',
            culinaryUses: 'Jamur crispy, tumis jamur cabai garam, sup bening'
        },
        {
            id: 'p10',
            title: 'Paket Starter Kit Hidroponik Pemula',
            category: 'kits',
            categoryName: 'Starter Kit Kebun',
            price: 185000,
            originalPrice: 230000,
            rating: 4.7,
            reviews: 175,
            discount: '-19%',
            image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=600&q=80',
            desc: 'Paket lengkap menanam sayur hidroponik di rumah: Baki hidroponik 9 lubang, Rockwool, Benih Pakcoy & Selada, Nutrisi AB Mix 1L.',
            weight: '1 Set Lengkap Kebun',
            harvestTime: 'Ready Stock Siap Kirim',
            stockStatus: '🟢 Ready Stock (10 Set)',
            farmOrigin: 'Workshop Kebun Devsecora, Jakarta',
            nutrition: 'Perlengkapan Kebun Menanam Sendiri Di Rumah',
            storageTip: 'Simpan benih di tempat sejuk terhindar matahari',
            culinaryUses: 'Panen sayur hidroponik sendiri di balkon rumah'
        },
        {
            id: 'p11',
            title: 'Sawi Pahit Hydroponic (250g)',
            category: 'leafy',
            categoryName: 'Sayuran Daun',
            price: 13000,
            originalPrice: 16000,
            rating: 3.2,
            reviews: 41,
            discount: '-18%',
            image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80',
            desc: 'Sayur sawi pahit hijau segar dengan khas cita rasa herbal alami. Kaya khasiat pembersih darah dan sistem pencernaan.',
            weight: '250 Gram / Pack',
            harvestTime: 'Panen Pagi Ini (05:05 WIB)',
            stockStatus: '🟢 Ready Stock (18 Pack)',
            farmOrigin: 'Green House Steril Devsecora, Jakarta',
            nutrition: 'Tinggi Glukosinolat, Antioksidan & Vitamin A',
            storageTip: 'Bungkus kertas, simpan di kulkas bagian sayur',
            culinaryUses: 'Tumis jahe cabai, sup herbal jamur, asinan sawi'
        },
        {
            id: 'p12',
            title: 'Kangkung Hidroponik Segar (300g)',
            category: 'leafy',
            categoryName: 'Sayuran Daun',
            price: 12500,
            originalPrice: 15000,
            rating: 4.0,
            reviews: 108,
            discount: '-16%',
            image: 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?auto=format&fit=crop&w=600&q=80',
            desc: 'Kangkung batang renyah hidroponik bebas lumpur dan ulat. Panen bersih higienis siap olah menjadi tumis kangkung terasi lezat.',
            weight: '300 Gram / Pack',
            harvestTime: 'Panen Pagi Ini (05:25 WIB)',
            stockStatus: '🟢 Ready Stock (40 Pack)',
            farmOrigin: 'Green House Steril Devsecora, Jakarta',
            nutrition: 'Kaya Vitamin A, C, Karotenoid & Serat Alami',
            storageTip: 'Potong sedikit akar, simpan berdiri di wadah berair',
            culinaryUses: 'Tumis kangkung terasi, kangkung hotplate, plecing'
        }
    ];

    // ----------------------------------------------------------------------
    // 2. STATE MANAGEMENT
    // ----------------------------------------------------------------------
    let cart = [
        { id: 'p1', title: 'Pakcoy Hidroponik Segar (250g)', price: 14500, image: products[0].image, qty: 2 }
    ];
    let wishlist = new Set(['p3']);

    const formatRupiah = (amount) => 'Rp ' + amount.toLocaleString('id-ID');

    // Parse URL Parameter e.g. shop.html?cat=leafy
    const urlParams = new URLSearchParams(window.location.search);
    let initialCatParam = urlParams.get('cat') || 'all';

    // ----------------------------------------------------------------------
    // 3. RENDER PRODUCTS GRID (FOR INDEX & SHOP PAGES)
    // ----------------------------------------------------------------------
    const productsContainer = document.getElementById('productsContainer');
    const shopProductsContainer = document.getElementById('shopProductsContainer');
    const resultsCountEl = document.getElementById('resultsCount');

    const createProductCardHTML = (p, isDetailed = false) => {
        const isWishlist = wishlist.has(p.id);
        return `
            <div class="product-card ${isDetailed ? 'shop-detailed-card' : ''}" data-id="${p.id}" data-category="${p.category}">
                <div class="product-card-top-badges">
                    <span class="product-badge-disc">${p.discount}</span>
                    <span class="stock-pill-badge">${p.stockStatus}</span>
                </div>

                <div class="product-actions-overlay">
                    <button class="btn-icon-action btn-wishlist-toggle ${isWishlist ? 'active' : ''}" data-id="${p.id}" title="Tambah ke Wishlist">
                        <i class="${isWishlist ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
                    </button>
                    <button class="btn-icon-action btn-quick-view" data-id="${p.id}" title="Lihat Detail & Nutrisi">
                        <i class="fa-regular fa-eye"></i>
                    </button>
                </div>

                <div class="product-img-wrap">
                    <img src="${p.image}" alt="${p.title}" loading="lazy">
                </div>

                <div class="product-info">
                    <div class="product-meta-tags">
                        <span class="product-cat"><i class="fa-solid fa-leaf"></i> ${p.categoryName}</span>
                        <span class="product-weight-badge"><i class="fa-solid fa-scale-balanced"></i> ${p.weight}</span>
                    </div>

                    <h3 class="product-title">${p.title}</h3>

                    <div class="harvest-info-pill">
                        <i class="fa-regular fa-clock"></i> ${p.harvestTime}
                    </div>

                    <div class="nutrition-snippet">
                        <i class="fa-solid fa-seedling text-green"></i> ${p.nutrition}
                    </div>

                    <div class="product-rating">
                        <i class="fa-solid fa-star"></i>
                        <span>${p.rating}</span>
                        <span class="review-count">(${p.reviews} ulasan)</span>
                    </div>

                    <div class="product-price-box">
                        <span class="price-current">${formatRupiah(p.price)}</span>
                        <span class="price-original">${formatRupiah(p.originalPrice)}</span>
                    </div>
                </div>

                <div class="product-card-footer-btns">
                    <button class="btn-add-cart" data-id="${p.id}">
                        <i class="fa-solid fa-basket-shopping"></i> Tambah Keranjang
                    </button>
                    <button class="btn-detail-quick btn-quick-view" data-id="${p.id}">
                        Detail Sayur
                    </button>
                </div>
            </div>
        `;
    };

    const renderProducts = (items) => {
        const html = items.length === 0 ? `
            <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: var(--text-muted); background: #FFFFFF; border-radius: var(--radius-lg); border: 1px solid var(--border-light);">
                <i class="fa-solid fa-leaf" style="font-size: 3.5rem; margin-bottom: 14px; color: var(--border-color);"></i>
                <h3 style="font-size: 18px; color: var(--dark); margin-bottom: 6px;">Tidak ada sayuran yang cocok</h3>
                <p style="font-size: 13px;">Coba atur ulang filter pencarian atau kata kunci Anda.</p>
            </div>
        ` : items.map(p => createProductCardHTML(p, !!shopProductsContainer)).join('');

        if (productsContainer) productsContainer.innerHTML = html;
        if (shopProductsContainer) shopProductsContainer.innerHTML = html;
        if (resultsCountEl) {
            resultsCountEl.innerHTML = `Menampilkan <strong>${items.length}</strong> dari <strong>${products.length}</strong> produk sayur segar`;
        }

        attachProductEvents();
    };

    // ----------------------------------------------------------------------
    // 4. CART & WISHLIST LOGIC
    // ----------------------------------------------------------------------
    const cartCountEl = document.getElementById('cartCount');
    const cartDrawerCountEl = document.getElementById('cartDrawerCount');
    const cartHeaderTotalEl = document.getElementById('cartHeaderTotal');
    const cartSubtotalAmountEl = document.getElementById('cartSubtotalAmount');
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const cartDrawerOverlay = document.getElementById('cartDrawerOverlay');

    const updateCartUI = () => {
        const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

        if (cartCountEl) cartCountEl.textContent = totalCount;
        if (cartDrawerCountEl) cartDrawerCountEl.textContent = totalCount;
        if (cartHeaderTotalEl) cartHeaderTotalEl.textContent = formatRupiah(subtotal);
        if (cartSubtotalAmountEl) cartSubtotalAmountEl.textContent = formatRupiah(subtotal);
        
        const bottomCartBadge = document.getElementById('bottomCartBadge');
        if (bottomCartBadge) bottomCartBadge.textContent = totalCount;

        if (cartItemsContainer) {
            if (cart.length === 0) {
                cartItemsContainer.innerHTML = `
                    <div class="empty-cart-msg">
                        <i class="fa-solid fa-basket-shopping"></i>
                        <p style="font-weight: 700; margin-bottom: 4px;">Keranjang Sayur Kosong</p>
                        <span style="font-size: 12px;">Yuk pilih sayur hidroponik segar panen hari ini!</span>
                    </div>
                `;
            } else {
                cartItemsContainer.innerHTML = cart.map(item => `
                    <div class="cart-item">
                        <img src="${item.image}" alt="${item.title}" class="cart-item-img">
                        <div class="cart-item-info">
                            <h4 class="cart-item-title">${item.title}</h4>
                            <div class="cart-item-price">${formatRupiah(item.price)}</div>
                            <div class="qty-controls">
                                <button class="qty-btn btn-qty-minus" data-id="${item.id}">-</button>
                                <span class="qty-val">${item.qty}</span>
                                <button class="qty-btn btn-qty-plus" data-id="${item.id}">+</button>
                            </div>
                        </div>
                        <button class="btn-remove-item" data-id="${item.id}" title="Hapus Sayur">
                            <i class="fa-regular fa-trash-can"></i>
                        </button>
                    </div>
                `).join('');
            }
        }
        attachCartItemEvents();
    };

    const addToCart = (productId, qtyToAdd = 1) => {
        const targetProd = products.find(p => p.id === productId);
        if (!targetProd) return;

        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.qty += qtyToAdd;
        } else {
            cart.push({
                id: targetProd.id,
                title: targetProd.title,
                price: targetProd.price,
                image: targetProd.image,
                qty: qtyToAdd
            });
        }
        updateCartUI();
        showToast(`"${targetProd.title}" ditambahkan ke keranjang!`, 'fa-circle-check');
    };

    const removeFromCart = (productId) => {
        cart = cart.filter(item => item.id !== productId);
        updateCartUI();
        showToast('Sayur dihapus dari keranjang', 'fa-trash-can');
    };

    const changeQty = (productId, delta) => {
        const item = cart.find(i => i.id === productId);
        if (item) {
            item.qty += delta;
            if (item.qty <= 0) removeFromCart(productId);
            else updateCartUI();
        }
    };

    // ----------------------------------------------------------------------
    // 5. EVENT ATTACHMENTS
    // ----------------------------------------------------------------------
    const attachProductEvents = () => {
        document.querySelectorAll('.btn-add-cart').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                addToCart(id);
            });
        });

        document.querySelectorAll('.btn-wishlist-toggle').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                const isWish = wishlist.has(id);
                if (isWish) {
                    wishlist.delete(id);
                    showToast('Dihapus dari Wishlist', 'fa-heart');
                } else {
                    wishlist.add(id);
                    showToast('Ditambahkan ke Wishlist!', 'fa-heart');
                }
                updateWishlistBadges();
                renderProducts(getCurrentFilteredProducts());
            });
        });

        document.querySelectorAll('.btn-quick-view').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                openQuickViewModal(id);
            });
        });
    };

    const attachCartItemEvents = () => {
        document.querySelectorAll('.btn-qty-minus').forEach(btn => {
            btn.addEventListener('click', (e) => changeQty(e.currentTarget.getAttribute('data-id'), -1));
        });

        document.querySelectorAll('.btn-qty-plus').forEach(btn => {
            btn.addEventListener('click', (e) => changeQty(e.currentTarget.getAttribute('data-id'), 1));
        });

        document.querySelectorAll('.btn-remove-item').forEach(btn => {
            btn.addEventListener('click', (e) => removeFromCart(e.currentTarget.getAttribute('data-id')));
        });
    };

    // Cart Drawer Triggers
    const btnCartTrigger = document.getElementById('btnCartTrigger');
    const btnCloseCart = document.getElementById('btnCloseCart');
    const btnEmptyCart = document.getElementById('btnEmptyCart');
    const btnCheckout = document.getElementById('btnCheckout');

    if (btnCartTrigger && cartDrawerOverlay) {
        btnCartTrigger.addEventListener('click', () => cartDrawerOverlay.classList.add('active'));
    }
    if (btnCloseCart && cartDrawerOverlay) {
        btnCloseCart.addEventListener('click', () => cartDrawerOverlay.classList.remove('active'));
    }
    if (cartDrawerOverlay) {
        cartDrawerOverlay.addEventListener('click', (e) => {
            if (e.target === cartDrawerOverlay) cartDrawerOverlay.classList.remove('active');
        });
    }
    if (btnEmptyCart) {
        btnEmptyCart.addEventListener('click', () => {
            if (cart.length > 0) {
                cart = [];
                updateCartUI();
                showToast('Keranjang belanja telah dikosongkan', 'fa-info-circle');
            }
        });
    }
    if (btnCheckout) {
        btnCheckout.addEventListener('click', () => {
            if (cart.length === 0) {
                showToast('Keranjang sayur Anda masih kosong!', 'fa-triangle-exclamation');
            } else {
                showToast('Terima kasih! Mengarahkan ke pembayaran sayur segar...', 'fa-credit-card');
                setTimeout(() => cartDrawerOverlay.classList.remove('active'), 1500);
            }
        });
    }

    // ----------------------------------------------------------------------
    // 6. SHOP FILTER & SORTING LOGIC (INCLUDING RATING RANGES 3.0 - 5.0)
    // ----------------------------------------------------------------------
    let activeFilterCategory = initialCatParam;
    const searchInput = document.getElementById('searchInput');
    const searchCategorySelect = document.getElementById('searchCategory');
    const btnSearch = document.getElementById('btnSearch');
    const sortSelect = document.getElementById('sortSelect');
    const priceRangeInput = document.getElementById('priceRange');
    const priceMaxLabel = document.getElementById('priceMaxLabel');
    const checkOrganic = document.getElementById('checkOrganic');
    const checkReadyStock = document.getElementById('checkReadyStock');
    const btnResetFilters = document.getElementById('btnResetFilters');
    const ratingFilterRadios = document.querySelectorAll('input[name="ratingFilter"]');

    // Sidebar Category Buttons Handler
    const catFilterBtns = document.querySelectorAll('.cat-filter-btn');
    if (catFilterBtns.length > 0) {
        catFilterBtns.forEach(btn => {
            if (btn.getAttribute('data-cat') === activeFilterCategory) {
                catFilterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            }
            btn.addEventListener('click', (e) => {
                catFilterBtns.forEach(b => b.classList.remove('active'));
                e.currentTarget.classList.add('active');
                activeFilterCategory = e.currentTarget.getAttribute('data-cat');
                renderProducts(getCurrentFilteredProducts());
            });
        });
    }

    // Price Range Slider
    if (priceRangeInput && priceMaxLabel) {
        priceRangeInput.addEventListener('input', (e) => {
            const val = parseInt(e.target.value);
            priceMaxLabel.textContent = `Maks: ${formatRupiah(val)}`;
            renderProducts(getCurrentFilteredProducts());
        });
    }

    // Rating Filter Radios Listener
    ratingFilterRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            renderProducts(getCurrentFilteredProducts());
        });
    });

    // Checkboxes & Sort Handlers
    if (checkOrganic) checkOrganic.addEventListener('change', () => renderProducts(getCurrentFilteredProducts()));
    if (checkReadyStock) checkReadyStock.addEventListener('change', () => renderProducts(getCurrentFilteredProducts()));
    if (sortSelect) sortSelect.addEventListener('change', () => renderProducts(getCurrentFilteredProducts()));

    if (btnResetFilters) {
        btnResetFilters.addEventListener('click', () => {
            activeFilterCategory = 'all';
            if (catFilterBtns) {
                catFilterBtns.forEach(b => b.classList.toggle('active', b.getAttribute('data-cat') === 'all'));
            }
            if (priceRangeInput) priceRangeInput.value = 200000;
            if (priceMaxLabel) priceMaxLabel.textContent = `Maks: ${formatRupiah(200000)}`;
            if (checkOrganic) checkOrganic.checked = true;
            if (checkReadyStock) checkReadyStock.checked = true;
            if (searchInput) searchInput.value = '';
            
            // Reset rating radios to 'all'
            const allRatingRadio = document.querySelector('input[name="ratingFilter"][value="all"]');
            if (allRatingRadio) allRatingRadio.checked = true;

            renderProducts(getCurrentFilteredProducts());
            showToast('Filter telah direset ke awal', 'fa-rotate-left');
        });
    }

    const getCurrentFilteredProducts = () => {
        const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
        const searchCategory = searchCategorySelect ? searchCategorySelect.value : 'all';
        const maxPrice = priceRangeInput ? parseInt(priceRangeInput.value) : 200000;

        const selectedRatingRadio = document.querySelector('input[name="ratingFilter"]:checked');
        const ratingVal = selectedRatingRadio ? selectedRatingRadio.value : 'all';

        let filtered = products.filter(p => {
            const matchesQuery = p.title.toLowerCase().includes(query) || p.desc.toLowerCase().includes(query) || p.nutrition.toLowerCase().includes(query);
            const matchesCategory = (activeFilterCategory === 'all' || p.category === activeFilterCategory);
            const matchesSearchCat = (searchCategory === 'all' || p.category === searchCategory);
            const matchesPrice = p.price <= maxPrice;

            let matchesRating = true;
            if (ratingVal === '4.5') matchesRating = p.rating >= 4.5;
            else if (ratingVal === '4.0') matchesRating = p.rating >= 4.0 && p.rating < 4.5;
            else if (ratingVal === '3.0') matchesRating = p.rating >= 3.0 && p.rating < 4.0;

            return matchesQuery && matchesCategory && matchesSearchCat && matchesPrice && matchesRating;
        });

        // Apply Sorting
        const sortVal = sortSelect ? sortSelect.value : 'popular';
        if (sortVal === 'price-low') {
            filtered.sort((a, b) => a.price - b.price);
        } else if (sortVal === 'price-high') {
            filtered.sort((a, b) => b.price - a.price);
        } else if (sortVal === 'name') {
            filtered.sort((a, b) => a.title.localeCompare(b.title));
        } else {
            filtered.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
        }

        return filtered;
    };

    if (searchInput) searchInput.addEventListener('input', () => renderProducts(getCurrentFilteredProducts()));
    if (searchCategorySelect) searchCategorySelect.addEventListener('change', () => renderProducts(getCurrentFilteredProducts()));
    if (btnSearch) btnSearch.addEventListener('click', () => renderProducts(getCurrentFilteredProducts()));

    // ----------------------------------------------------------------------
    // 7. COMPREHENSIVE VEGETABLE DETAIL MODAL SYSTEM
    // ----------------------------------------------------------------------
    const quickViewModal = document.getElementById('quickViewModal');
    const btnCloseModal = document.getElementById('btnCloseModal');
    const modalProductContent = document.getElementById('modalProductContent');

    const openQuickViewModal = (productId) => {
        const p = products.find(prod => prod.id === productId);
        if (!p || !modalProductContent) return;

        modalProductContent.innerHTML = `
            <div class="modal-detail-grid">
                <div class="modal-img-container">
                    <img src="${p.image}" alt="${p.title}" class="modal-main-img">
                    <div class="modal-badges-row">
                        <span class="modal-stock-badge">${p.stockStatus}</span>
                        <span class="modal-organic-badge"><i class="fa-solid fa-seedling"></i> 100% Bebas Pestisida</span>
                    </div>
                </div>

                <div class="modal-info-container">
                    <div class="modal-header-meta">
                        <span class="product-cat"><i class="fa-solid fa-leaf"></i> ${p.categoryName}</span>
                        <span class="modal-weight"><i class="fa-solid fa-scale-balanced"></i> ${p.weight}</span>
                    </div>

                    <h2 class="modal-product-title">${p.title}</h2>

                    <div class="modal-rating-row">
                        <div class="stars">
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                            <strong>${p.rating}</strong>
                        </div>
                        <span class="reviews-count">(${p.reviews} ulasan pembeli)</span>
                    </div>

                    <div class="modal-price-box">
                        <span class="modal-price-current">${formatRupiah(p.price)}</span>
                        <span class="modal-price-original">${formatRupiah(p.originalPrice)}</span>
                        <span class="modal-discount-tag">${p.discount}</span>
                    </div>

                    <p class="modal-description">${p.desc}</p>

                    <!-- Rich Specifications Grid -->
                    <div class="modal-spec-grid">
                        <div class="spec-card">
                            <i class="fa-regular fa-clock text-green"></i>
                            <div>
                                <strong>Waktu Panen:</strong>
                                <span>${p.harvestTime}</span>
                            </div>
                        </div>
                        <div class="spec-card">
                            <i class="fa-solid fa-location-dot text-green"></i>
                            <div>
                                <strong>Asal Kebun:</strong>
                                <span>${p.farmOrigin}</span>
                            </div>
                        </div>
                        <div class="spec-card">
                            <i class="fa-solid fa-heart-pulse text-green"></i>
                            <div>
                                <strong>Kandungan Nutrisi:</strong>
                                <span>${p.nutrition}</span>
                            </div>
                        </div>
                        <div class="spec-card">
                            <i class="fa-solid fa-snowflake text-green"></i>
                            <div>
                                <strong>Cara Simpan Kulkas:</strong>
                                <span>${p.storageTip}</span>
                            </div>
                        </div>
                        <div class="spec-card full-width">
                            <i class="fa-solid fa-utensils text-green"></i>
                            <div>
                                <strong>Saran Olahan Masakan:</strong>
                                <span>${p.culinaryUses}</span>
                            </div>
                        </div>
                    </div>

                    <div class="modal-action-row">
                        <div class="modal-qty-selector">
                            <button type="button" class="btn-modal-qty" id="modalQtyMinus">-</button>
                            <span id="modalQtyVal">1</span>
                            <button type="button" class="btn-modal-qty" id="modalQtyPlus">+</button>
                        </div>
                        <button class="btn btn-primary btn-block btn-lg" id="modalAddToCartBtn" data-id="${p.id}">
                            <i class="fa-solid fa-basket-shopping"></i> Tambah Ke Keranjang Sayur
                        </button>
                    </div>
                </div>
            </div>
        `;

        let currentModalQty = 1;
        const modalQtyVal = document.getElementById('modalQtyVal');
        const modalQtyMinus = document.getElementById('modalQtyMinus');
        const modalQtyPlus = document.getElementById('modalQtyPlus');
        const modalAddToCartBtn = document.getElementById('modalAddToCartBtn');

        if (modalQtyMinus) {
            modalQtyMinus.addEventListener('click', () => {
                if (currentModalQty > 1) {
                    currentModalQty--;
                    if (modalQtyVal) modalQtyVal.textContent = currentModalQty;
                }
            });
        }

        if (modalQtyPlus) {
            modalQtyPlus.addEventListener('click', () => {
                currentModalQty++;
                if (modalQtyVal) modalQtyVal.textContent = currentModalQty;
            });
        }

        if (modalAddToCartBtn) {
            modalAddToCartBtn.addEventListener('click', () => {
                addToCart(p.id, currentModalQty);
                if (quickViewModal) quickViewModal.classList.remove('active');
            });
        }

        if (quickViewModal) quickViewModal.classList.add('active');
    };

    if (btnCloseModal && quickViewModal) {
        btnCloseModal.addEventListener('click', () => quickViewModal.classList.remove('active'));
    }
    if (quickViewModal) {
        quickViewModal.addEventListener('click', (e) => {
            if (e.target === quickViewModal) quickViewModal.classList.remove('active');
        });
    }

    // ----------------------------------------------------------------------
    // 8. TOAST NOTIFICATION UTILITY
    // ----------------------------------------------------------------------
    const toastContainer = document.getElementById('toastContainer');
    const showToast = (message, iconClass = 'fa-info-circle') => {
        if (!toastContainer) return;
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<i class="fa-solid ${iconClass}"></i><span>${message}</span>`;
        toastContainer.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3500);
    };

    // ----------------------------------------------------------------------
    // 9. MOBILE NAVIGATION & WISHLIST BADGES
    // ----------------------------------------------------------------------
    const btnMobileToggle = document.getElementById('btnMobileToggle');
    const btnCloseMobileNav = document.getElementById('btnCloseMobileNav');
    const mobileNavOverlay = document.getElementById('mobileNavOverlay');
    const btnBottomCart = document.getElementById('btnBottomCart');
    const btnBottomWishlist = document.getElementById('btnBottomWishlist');

    if (btnMobileToggle && mobileNavOverlay) {
        btnMobileToggle.addEventListener('click', () => mobileNavOverlay.classList.add('active'));
    }
    if (btnCloseMobileNav && mobileNavOverlay) {
        btnCloseMobileNav.addEventListener('click', () => mobileNavOverlay.classList.remove('active'));
    }
    if (btnBottomCart && cartDrawerOverlay) {
        btnBottomCart.addEventListener('click', () => cartDrawerOverlay.classList.add('active'));
    }
    if (btnBottomWishlist) {
        btnBottomWishlist.addEventListener('click', () => showToast(`Wishlist Anda memiliki ${wishlist.size} sayuran`, 'fa-heart'));
    }

    const updateWishlistBadges = () => {
        const wishlistCountEl = document.getElementById('wishlistCount');
        const bottomWishlistBadge = document.getElementById('bottomWishlistBadge');
        if (wishlistCountEl) wishlistCountEl.textContent = wishlist.size;
        if (bottomWishlistBadge) bottomWishlistBadge.textContent = wishlist.size;
    };

    // INITIAL RENDERS
    renderProducts(getCurrentFilteredProducts());
    updateCartUI();
    updateWishlistBadges();

});
