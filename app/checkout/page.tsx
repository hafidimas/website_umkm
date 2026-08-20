'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useShop } from '../../context/ShopContext';
import { AddressMapPicker } from '../../components/AddressMapPicker';

// KOORDINAT PUSAT KEBUN DEVSECORA CIPOCOK JAYA, SERANG
const CIPOCOK_LAT = -6.1362;
const CIPOCOK_LNG = 106.1685;
const MAX_RADIUS_KM = 10.0;

// RUMUS HAVERSINE UNTUK MENGHITUNG JARAK PRESISI DALAM KILOMETER
const calculateDistanceKm = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius bumi dalam KM
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

export default function CheckoutPage() {
    const router = useRouter();
    const { cart, emptyCart, formatPrice, t, language } = useShop();
    const isEn = language === 'en';

    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [customerAddress, setCustomerAddress] = useState('');
    const [shippingNotes, setShippingNotes] = useState('');
    const [shippingType, setShippingType] = useState<'INSTANT' | 'SAME_DAY' | 'SCHEDULED'>('INSTANT');
    
    // STATE UNTUK PETA INTERAKTIF PICKER
    const [isMapModalOpen, setIsMapModalOpen] = useState(false);

    // STATE UNTUK DETAIL PENGIRIMAN TERJADWAL
    const [scheduledDate, setScheduledDate] = useState<'TODAY' | 'TOMORROW' | 'DAY_AFTER'>('TOMORROW');
    const [scheduledTimeSlot, setScheduledTimeSlot] = useState<string>('06:00 - 08:00 WIB');

    const [paymentMethod, setPaymentMethod] = useState<'WHATSAPP_DIRECT' | 'QRIS_BANK'>('WHATSAPP_DIRECT');
    const [isLoading, setIsLoading] = useState(false);

    // APABILA ALAMAT SUDAH DIISI OLEH PENGGUNA
    const hasAddress = customerAddress.trim().length > 0;

    // SISTEM ONGKIR BERTINGKAT BERDASARKAN JARAK (TIERED DISTANCE GEOLOCATION)
    const getAddressZoneInfo = (address: string) => {
        const addr = address.toLowerCase();
        
        if (!address.trim()) {
            return {
                zoneName: isEn ? 'Enter address to calculate shipping fee' : 'Ketik alamat Anda di atas untuk kalkulasi ongkir',
                baseInstant: 5000,
                baseSameDay: 3000,
                baseScheduled: 4000,
                badge: isEn ? 'Enter Address' : 'Masukkan Alamat',
                color: '#64748B',
                isDefault: true,
                isAllowed: true
            };
        }

        // APABILA TERDAPAT KOORDINAT GPS (DARI PETA PICKER)
        const gpsMatch = address.match(/GPS:\s*(-?\d+\.\d+),\s*(-?\d+\.\d+)/);
        if (gpsMatch) {
            const lat = parseFloat(gpsMatch[1]);
            const lng = parseFloat(gpsMatch[2]);
            const dist = calculateDistanceKm(CIPOCOK_LAT, CIPOCOK_LNG, lat, lng);

            if (dist > MAX_RADIUS_KM) {
                return {
                    zoneName: isEn ? 'Sorry, you are outside our delivery area' : 'Mohon maaf, anda berada diluar batas pengiriman kami',
                    baseInstant: 0,
                    baseSameDay: 0,
                    baseScheduled: 0,
                    badge: isEn ? 'Delivery Unavailable' : 'Di Luar Batas Area',
                    color: '#DC2626',
                    isDefault: false,
                    isAllowed: false,
                    distanceKm: dist
                };
            } else if (dist <= 3.0) {
                // ZONA 1 (SANGAT DEKAT: 0 - 3 KM)
                return {
                    zoneName: isEn ? `Zone 1 - Very Close (${dist.toFixed(1)} km from Cipocok)` : `Zona 1 - Sangat Dekat (${dist.toFixed(1)} km dari Kebun)`,
                    baseInstant: 5000,
                    baseSameDay: 3000,
                    baseScheduled: 4000,
                    badge: isEn ? 'Zone 1 (0-3 km)' : 'Zona 1 (0-3 km)',
                    color: '#166534',
                    isDefault: false,
                    isAllowed: true,
                    distanceKm: dist
                };
            } else if (dist <= 6.0) {
                // ZONA 2 (SEDANG: 3 - 6 KM)
                return {
                    zoneName: isEn ? `Zone 2 - Medium Distance (${dist.toFixed(1)} km from Cipocok)` : `Zona 2 - Jarak Sedang (${dist.toFixed(1)} km dari Kebun)`,
                    baseInstant: 10000,
                    baseSameDay: 7000,
                    baseScheduled: 8000,
                    badge: isEn ? 'Zone 2 (3-6 km)' : 'Zona 2 (3-6 km)',
                    color: '#0284C7',
                    isDefault: false,
                    isAllowed: true,
                    distanceKm: dist
                };
            } else {
                // ZONA 3 (JAUH: 6 - 10 KM)
                return {
                    zoneName: isEn ? `Zone 3 - Far Distance (${dist.toFixed(1)} km from Cipocok)` : `Zona 3 - Jarak Jauh (${dist.toFixed(1)} km dari Kebun)`,
                    baseInstant: 16000,
                    baseSameDay: 10000,
                    baseScheduled: 12000,
                    badge: isEn ? 'Zone 3 (6-10 km)' : 'Zona 3 (6-10 km)',
                    color: '#D97706',
                    isDefault: false,
                    isAllowed: true,
                    distanceKm: dist
                };
            }
        }

        // CEK KATA KUNCI SECARA EKSPLISIT DILUAR JANGKAUAN (Cilegon, Pandeglang, Tangerang, Jakarta, Bandung, dll)
        const isExplicitlyOutside = 
            addr.includes('cilegon') || addr.includes('pandeglang') || addr.includes('rangkas') ||
            addr.includes('lebak') || addr.includes('tangerang') || addr.includes('tangsel') ||
            addr.includes('jakarta') || addr.includes('bogor') || addr.includes('depok') ||
            addr.includes('bekasi') || addr.includes('bandung') || addr.includes('surabaya') ||
            addr.includes('semarang') || addr.includes('jogja') || addr.includes('yogyakarta');

        if (isExplicitlyOutside) {
            return {
                zoneName: isEn ? 'Sorry, you are outside our delivery area' : 'Mohon maaf, anda berada diluar batas pengiriman kami',
                baseInstant: 0,
                baseSameDay: 0,
                baseScheduled: 0,
                badge: isEn ? 'Delivery Unavailable' : 'Di Luar Batas Area',
                color: '#DC2626',
                isDefault: false,
                isAllowed: false
            };
        }

        // ESTIMASI TIER BERBASIS KATA KUNCI APABILA TIDAK GUNAKAN GPS
        const isZone1Text = addr.includes('cipocok') || addr.includes('ciceri') || addr.includes('42121');
        const isZone2Text = addr.includes('serang') || addr.includes('uin') || addr.includes('curug') || addr.includes('taktakan') || addr.includes('walantaka') || addr.includes('42111') || addr.includes('42112');
        const isZone3Text = addr.includes('ciruas') || addr.includes('kramatwatu') || addr.includes('kasemen') || addr.includes('karangantu') || addr.includes('baros') || addr.includes('42122') || addr.includes('42123') || addr.includes('42124') || addr.includes('42171') || addr.includes('42181');

        if (isZone1Text) {
            return {
                zoneName: isEn ? 'Zone 1 - Very Close (Cipocok Local Area)' : 'Zona 1 - Sangat Dekat (Area Kebun Cipocok)',
                baseInstant: 5000,
                baseSameDay: 3000,
                baseScheduled: 4000,
                badge: isEn ? 'Zone 1 (0-3 km)' : 'Zona 1 (0-3 km)',
                color: '#166534',
                isDefault: false,
                isAllowed: true
            };
        }

        if (isZone2Text) {
            return {
                zoneName: isEn ? 'Zone 2 - Serang Core Area' : 'Zona 2 - Area Serang Kota & Sekitar',
                baseInstant: 10000,
                baseSameDay: 7000,
                baseScheduled: 8000,
                badge: isEn ? 'Zone 2 (3-6 km)' : 'Zona 2 (3-6 km)',
                color: '#0284C7',
                isDefault: false,
                isAllowed: true
            };
        }

        if (isZone3Text) {
            return {
                zoneName: isEn ? 'Zone 3 - Outer Serang Area' : 'Zona 3 - Area Sekitar Outer Serang',
                baseInstant: 16000,
                baseSameDay: 10000,
                baseScheduled: 12000,
                badge: isEn ? 'Zone 3 (6-10 km)' : 'Zona 3 (6-10 km)',
                color: '#D97706',
                isDefault: false,
                isAllowed: true
            };
        }

        // ALAMAT LAIN DILUAR JANGKAUAN
        return {
            zoneName: isEn ? 'Sorry, you are outside our delivery area' : 'Mohon maaf, anda berada diluar batas pengiriman kami',
            baseInstant: 0,
            baseSameDay: 0,
            baseScheduled: 0,
            badge: isEn ? 'Delivery Unavailable' : 'Di Luar Batas Area',
            color: '#DC2626',
            isDefault: false,
            isAllowed: false
        };
    };

    const zone = getAddressZoneInfo(customerAddress);

    // Hitung Subtotal dalam IDR
    const cartSubtotalIDR = cart.reduce((sum, item) => sum + (item.product.price * item.qty), 0);
    const isFreeShipping = cartSubtotalIDR >= 100000;
    
    // Ongkir dinamis berdasarkan zona alamat & tipe pengiriman
    let baseShippingFee = zone.baseInstant;
    if (shippingType === 'INSTANT') baseShippingFee = zone.baseInstant;
    else if (shippingType === 'SAME_DAY') baseShippingFee = zone.baseSameDay;
    else if (shippingType === 'SCHEDULED') baseShippingFee = zone.baseScheduled;

    // Hanya hitung ongkir jika alamat diisi & diperbolehkan
    const shippingCostIDR = !hasAddress || !zone.isAllowed ? 0 : (isFreeShipping || cart.length === 0 ? 0 : baseShippingFee);
    const finalTotalIDR = cartSubtotalIDR + shippingCostIDR;

    const getScheduledDateText = () => {
        if (scheduledDate === 'TODAY') return isEn ? 'Today' : 'Hari Ini';
        if (scheduledDate === 'TOMORROW') return isEn ? 'Tomorrow' : 'Besok';
        return isEn ? 'Day After Tomorrow' : 'Lusa';
    };

    const handleConfirmOrder = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!customerName || !customerPhone || !customerAddress) {
            alert(isEn ? 'Please fill in all recipient info fields' : 'Mohon lengkapi Nama, WhatsApp, dan Alamat Pengiriman Anda');
            return;
        }

        if (!zone.isAllowed) {
            alert(isEn 
                ? 'Sorry, you are outside our delivery area.' 
                : 'Mohon maaf, anda berada diluar batas pengiriman kami'
            );
            return;
        }

        setIsLoading(true);

        const shippingLabel = shippingType === 'INSTANT'
            ? 'Instan (15-30 Menit)'
            : shippingType === 'SAME_DAY'
                ? 'Same Day (6-8 Jam)'
                : `Terjadwal (${getScheduledDateText()}, Jam: ${scheduledTimeSlot})`;

        try {
            const orderPayload = {
                customerName,
                customerPhone,
                customerAddress,
                shippingNotes: `[Tipe Pengiriman: ${shippingLabel} | Asal: Cipocok Serang 42121 | ${zone.zoneName}] ${shippingNotes}`,
                paymentMethod,
                items: cart.map(i => ({
                    productId: i.product.id,
                    qty: i.qty,
                    price: i.product.price
                }))
            };

            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderPayload)
            });

            const result = await res.json();

            if (result.success) {
                emptyCart();
                alert(result.message || 'Pesanan berhasil dibuat!');

                if (result.waRedirectUrl) {
                    window.open(result.waRedirectUrl, '_blank');
                }

                router.push('/shop');
            } else {
                alert(result.message || 'Gagal memproses pesanan');
            }
        } catch (err: any) {
            alert('Terjadi kesalahan koneksi server');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main style={{ backgroundColor: '#F9F8F3', minHeight: '85vh', paddingBottom: '80px' }}>
            {/* HERO BANNER */}
            <section className="shop-hero-section">
                <div className="container">
                    <div className="shop-hero-card">
                        <div className="shop-hero-content">
                            <span className="sub-header-tag">
                                <i className="fa-solid fa-truck-fast"></i> {isEn ? 'EXPRESS CHECKOUT' : 'CHECKOUT & PENGIRIMAN'}
                            </span>
                            <h1 className="shop-title">
                                {isEn ? 'Checkout Fresh Hydroponic Produce' : 'Pengiriman Sayur Segar Kebun'}
                            </h1>
                            <p className="shop-subtitle">
                                {isEn ? 'Freshly harvested from Devsecora Farm in Cipocok Serang 42121.' : 'Hasil panen segar langsung dari Kebun Devsecora Cipocok Serang.'}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <div className="container" style={{ marginTop: '40px' }}>
                {cart.length === 0 ? (
                    <div style={{ background: '#FFFFFF', borderRadius: 'var(--radius-xl)', padding: '60px 20px', textAlign: 'center' }}>
                        <h2>{isEn ? 'Your Cart is Empty' : 'Keranjang Belanja Masih Kosong'}</h2>
                        <Link href="/shop" className="btn btn-primary" style={{ marginTop: '16px' }}>{isEn ? 'Explore Shop' : 'Kembali Belanja'}</Link>
                    </div>
                ) : (
                    <form onSubmit={handleConfirmOrder} style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '32px', alignItems: 'start' }}>
                        {/* LEFT COLUMN: FORM DETAILS */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            {/* SECTION 1: RECIPIENT DATA */}
                            <div style={{
                                background: '#FFFFFF',
                                borderRadius: 'var(--radius-xl)',
                                padding: '28px 24px',
                                border: '1px solid var(--border-light)',
                                boxShadow: 'var(--shadow-sm)'
                            }}>
                                <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--dark)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <i className="fa-solid fa-user text-green"></i>
                                    {isEn ? '1. Recipient & Shipping Address' : '1. Data Penerima & Alamat Pengiriman'}
                                </h3>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--dark)', marginBottom: '6px' }}>
                                            {isEn ? 'Recipient Full Name' : 'Nama Lengkap Penerima'} <span style={{ color: '#EF4444' }}>*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            placeholder={isEn ? 'e.g. Ibu Ratna' : 'contoh: Ibu Ratna'}
                                            value={customerName}
                                            onChange={(e) => setCustomerName(e.target.value)}
                                            style={{ width: '100%', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '14px' }}
                                        />
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--dark)', marginBottom: '6px' }}>
                                            {isEn ? 'Active WhatsApp Number' : 'Nomor WhatsApp Aktif'} <span style={{ color: '#EF4444' }}>*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            required
                                            placeholder="08123456789"
                                            value={customerPhone}
                                            onChange={(e) => setCustomerPhone(e.target.value)}
                                            style={{ width: '100%', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '14px' }}
                                        />
                                    </div>
                                </div>

                                <div style={{ marginBottom: '16px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                        <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--dark)', margin: 0 }}>
                                            {isEn ? 'Full Shipping Address' : 'Alamat Lengkap Pengiriman'} <span style={{ color: '#EF4444' }}>*</span>
                                        </label>
                                        
                                        {/* BUTTON BUKA PETA INTERAKTIF */}
                                        <button
                                            type="button"
                                            onClick={() => setIsMapModalOpen(true)}
                                            style={{
                                                backgroundColor: '#F0FDF4',
                                                color: 'var(--primary)',
                                                border: '1px solid #BBF7D0',
                                                padding: '6px 14px',
                                                borderRadius: 'var(--radius-full)',
                                                fontSize: '12.5px',
                                                fontWeight: 700,
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                boxShadow: 'var(--shadow-sm)'
                                            }}
                                        >
                                            <i className="fa-solid fa-map-location-dot" style={{ fontSize: '14px', color: 'var(--primary)' }}></i>
                                            <span>{isEn ? 'Pin Location on Map' : 'Pilih Titik Lokasi Di Peta'}</span>
                                        </button>
                                    </div>

                                    <textarea
                                        required
                                        rows={3}
                                        placeholder={isEn ? 'Street name, house number, subdistrict, city name...' : 'Jl. Raya Cipocok Jaya No. 12, Cipocok Jaya, Kota Serang, Banten 42121...'}
                                        value={customerAddress}
                                        onChange={(e) => setCustomerAddress(e.target.value)}
                                        style={{ width: '100%', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '14px', fontFamily: 'inherit' }}
                                    ></textarea>

                                    {/* DYNAMIC SHIPPING ZONE INDICATOR BERBASIS CIPOCOK JAYA */}
                                    <div style={{
                                        marginTop: '10px',
                                        padding: '12px 16px',
                                        backgroundColor: zone.isAllowed ? '#F8FAFC' : '#FEF2F2',
                                        borderRadius: 'var(--radius-md)',
                                        border: zone.isAllowed ? '1px solid var(--border-light)' : '1.5px solid #FCA5A5',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        fontSize: '12.5px'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <i className={zone.isAllowed ? "fa-solid fa-location-dot" : "fa-solid fa-circle-xmark"} style={{ color: zone.color, fontSize: '16px' }}></i>
                                            <span style={{ color: zone.isAllowed ? 'var(--dark)' : '#B91C1C', fontWeight: 600 }}>
                                                {zone.zoneName}
                                            </span>
                                        </div>
                                        <span style={{
                                            fontSize: '11px',
                                            fontWeight: 700,
                                            color: zone.color,
                                            backgroundColor: '#FFFFFF',
                                            padding: '3px 10px',
                                            borderRadius: 'var(--radius-full)',
                                            border: `1px solid ${zone.color}`
                                        }}>
                                            {zone.badge}
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--dark)', marginBottom: '6px' }}>
                                        <i className="fa-solid fa-note-sticky" style={{ color: 'var(--primary)', marginRight: '6px' }}></i>
                                        {isEn ? 'Courier Landmark Notes (Block, House Color, Gate, etc.)' : 'Catatan Patokan Kurir (Blok Berapa, Warna Cat Rumah, Pagar, dll)'}
                                    </label>
                                    <input
                                        type="text"
                                        placeholder={isEn ? 'e.g. Block A No. 12, White Wall, Green Gate, Near Security Post' : 'contoh: Blok A No. 12, Tembok Putih, Pagar Hijau, Dekat Pos Satpam'}
                                        value={shippingNotes}
                                        onChange={(e) => setShippingNotes(e.target.value)}
                                        style={{ width: '100%', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '14px' }}
                                    />
                                </div>
                            </div>

                            {/* SECTION 2: TIPE PENGIRIMAN (INSTAN / SAME DAY / TERJADWAL) */}
                            <div style={{
                                background: '#FFFFFF',
                                borderRadius: 'var(--radius-xl)',
                                padding: '28px 24px',
                                border: '1px solid var(--border-light)',
                                boxShadow: 'var(--shadow-sm)'
                            }}>
                                <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--dark)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <i className="fa-solid fa-truck-fast text-green"></i>
                                    {isEn ? '2. Delivery Type Option' : '2. Tipe Pengiriman'}
                                </h3>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {/* OPTION A: INSTAN 15-30 MENIT */}
                                    <div
                                        onClick={() => zone.isAllowed && setShippingType('INSTANT')}
                                        style={{
                                            padding: '16px 20px',
                                            borderRadius: 'var(--radius-lg)',
                                            border: shippingType === 'INSTANT' && zone.isAllowed ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                                            backgroundColor: !zone.isAllowed ? '#F8FAFC' : (shippingType === 'INSTANT' ? '#F0FDF4' : '#FFFFFF'),
                                            opacity: !zone.isAllowed ? 0.6 : 1,
                                            cursor: !zone.isAllowed ? 'not-allowed' : 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between'
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                            <div style={{
                                                width: '42px',
                                                height: '42px',
                                                borderRadius: '50%',
                                                backgroundColor: '#FEF3C7',
                                                color: '#D97706',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '18px'
                                            }}>
                                                <i className="fa-solid fa-bolt-lightning"></i>
                                            </div>
                                            <div>
                                                <strong style={{ fontSize: '14.5px', color: 'var(--dark)', display: 'block' }}>
                                                    {isEn ? 'Express Instant (15 - 30 Mins)' : 'Pengiriman Instan (15 - 30 Menit)'}
                                                </strong>
                                                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                                                    {isEn ? 'Direct express courier delivery from Cipocok farm' : 'Langsung dikirim kurir instan dari kebun Cipocok Serang'}
                                                </span>
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            {!hasAddress ? (
                                                <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748B', backgroundColor: '#F1F5F9', padding: '4px 10px', borderRadius: 'var(--radius-full)' }}>
                                                    {isEn ? 'Enter Address' : 'Masukkan Alamat'}
                                                </span>
                                            ) : !zone.isAllowed ? (
                                                <span style={{ fontSize: '12px', fontWeight: 600, color: '#DC2626', backgroundColor: '#FEE2E2', padding: '4px 10px', borderRadius: 'var(--radius-full)' }}>
                                                    {isEn ? 'Unavailable' : 'Di Luar Area'}
                                                </span>
                                            ) : (
                                                <>
                                                    <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--primary)', display: 'block' }}>
                                                        {isFreeShipping ? (isEn ? 'FREE' : 'GRATIS') : formatPrice(zone.baseInstant)}
                                                    </span>
                                                    <span style={{ fontSize: '11px', fontWeight: 700, backgroundColor: '#DCFCE7', color: '#166534', padding: '2px 8px', borderRadius: 'var(--radius-full)' }}>TERCEPAT</span>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* OPTION B: SAME DAY (6-8 JAM) */}
                                    <div
                                        onClick={() => zone.isAllowed && setShippingType('SAME_DAY')}
                                        style={{
                                            padding: '16px 20px',
                                            borderRadius: 'var(--radius-lg)',
                                            border: shippingType === 'SAME_DAY' && zone.isAllowed ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                                            backgroundColor: !zone.isAllowed ? '#F8FAFC' : (shippingType === 'SAME_DAY' ? '#F0FDF4' : '#FFFFFF'),
                                            opacity: !zone.isAllowed ? 0.6 : 1,
                                            cursor: !zone.isAllowed ? 'not-allowed' : 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between'
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                            <div style={{
                                                width: '42px',
                                                height: '42px',
                                                borderRadius: '50%',
                                                backgroundColor: '#E0E7FF',
                                                color: '#4F46E5',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '18px'
                                            }}>
                                                <i className="fa-solid fa-truck-ramp-box"></i>
                                            </div>
                                            <div>
                                                <strong style={{ fontSize: '14.5px', color: 'var(--dark)', display: 'block' }}>
                                                    {isEn ? 'Same Day Delivery (6 - 8 Hours)' : 'Pengiriman Same Day (6 - 8 Jam)'}
                                                </strong>
                                                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                                                    {isEn ? 'Delivered on the same day before 17:00' : 'Tiba di hari yang sama sebelum pukul 17:00 WIB'}
                                                </span>
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            {!hasAddress ? (
                                                <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748B', backgroundColor: '#F1F5F9', padding: '4px 10px', borderRadius: 'var(--radius-full)' }}>
                                                    {isEn ? 'Enter Address' : 'Masukkan Alamat'}
                                                </span>
                                            ) : !zone.isAllowed ? (
                                                <span style={{ fontSize: '12px', fontWeight: 600, color: '#DC2626', backgroundColor: '#FEE2E2', padding: '4px 10px', borderRadius: 'var(--radius-full)' }}>
                                                    {isEn ? 'Unavailable' : 'Di Luar Area'}
                                                </span>
                                            ) : (
                                                <>
                                                    <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--dark)', display: 'block' }}>
                                                        {isFreeShipping ? (isEn ? 'FREE' : 'GRATIS') : formatPrice(zone.baseSameDay)}
                                                    </span>
                                                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{isEn ? 'Economical' : 'Hemat'}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* OPTION C: PENGIRIMAN TERJADWAL */}
                                    <div
                                        onClick={() => zone.isAllowed && setShippingType('SCHEDULED')}
                                        style={{
                                            padding: '16px 20px',
                                            borderRadius: 'var(--radius-lg)',
                                            border: shippingType === 'SCHEDULED' && zone.isAllowed ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                                            backgroundColor: !zone.isAllowed ? '#F8FAFC' : (shippingType === 'SCHEDULED' ? '#F0FDF4' : '#FFFFFF'),
                                            opacity: !zone.isAllowed ? 0.6 : 1,
                                            cursor: !zone.isAllowed ? 'not-allowed' : 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between'
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                            <div style={{
                                                width: '42px',
                                                height: '42px',
                                                borderRadius: '50%',
                                                backgroundColor: '#FCE7F3',
                                                color: '#DB2777',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '18px'
                                            }}>
                                                <i className="fa-regular fa-calendar-check"></i>
                                            </div>
                                            <div>
                                                <strong style={{ fontSize: '14.5px', color: 'var(--dark)', display: 'block' }}>
                                                    {isEn ? 'Scheduled Delivery (Custom Time Slot)' : 'Pengiriman Terjadwal (Pilih Tanggal & Jam)'}
                                                </strong>
                                                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                                                    {isEn ? 'Pick custom harvest & delivery time slot for maximum freshness' : 'Pilih tanggal & slot jam panen khusus sesuai kebutuhan Anda'}
                                                </span>
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            {!hasAddress ? (
                                                <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748B', backgroundColor: '#F1F5F9', padding: '4px 10px', borderRadius: 'var(--radius-full)' }}>
                                                    {isEn ? 'Enter Address' : 'Masukkan Alamat'}
                                                </span>
                                            ) : !zone.isAllowed ? (
                                                <span style={{ fontSize: '12px', fontWeight: 600, color: '#DC2626', backgroundColor: '#FEE2E2', padding: '4px 10px', borderRadius: 'var(--radius-full)' }}>
                                                    {isEn ? 'Unavailable' : 'Di Luar Area'}
                                                </span>
                                            ) : (
                                                <>
                                                    <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--dark)', display: 'block' }}>
                                                        {isFreeShipping ? (isEn ? 'FREE' : 'GRATIS') : formatPrice(zone.baseScheduled)}
                                                    </span>
                                                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{isEn ? 'Custom' : 'Fleksibel'}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* PANEL SUB-PILIHAN DETAIL WAKTU UNTUK PENGIRIMAN TERJADWAL */}
                                    {shippingType === 'SCHEDULED' && zone.isAllowed && (
                                        <div style={{
                                            marginTop: '8px',
                                            padding: '20px',
                                            backgroundColor: '#F0FDF4',
                                            borderRadius: 'var(--radius-lg)',
                                            border: '1.5px dashed #BBF7D0',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '18px'
                                        }}>
                                            {/* 1. PILIH TANGGAL PENGIRIMAN */}
                                            <div>
                                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--dark)', marginBottom: '8px' }}>
                                                    <i className="fa-regular fa-calendar-days" style={{ marginRight: '6px', color: 'var(--primary)' }}></i>
                                                    {isEn ? 'Select Delivery Date:' : 'Pilih Hari & Tanggal Panen:'}
                                                </label>
                                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                                                    {[
                                                        { key: 'TODAY', label: isEn ? 'Today' : 'Hari Ini', sub: isEn ? 'Fresh Today' : 'Panen Hari Ini' },
                                                        { key: 'TOMORROW', label: isEn ? 'Tomorrow' : 'Besok', sub: isEn ? '05:00 AM Crop' : 'Panen 05:00 WIB' },
                                                        { key: 'DAY_AFTER', label: isEn ? 'Day After' : 'Lusa', sub: isEn ? '05:00 AM Crop' : 'Panen 05:00 WIB' }
                                                    ].map(d => (
                                                        <div
                                                            key={d.key}
                                                            onClick={() => setScheduledDate(d.key as any)}
                                                            style={{
                                                                padding: '10px 8px',
                                                                textAlign: 'center',
                                                                borderRadius: 'var(--radius-md)',
                                                                border: scheduledDate === d.key ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                                                                backgroundColor: scheduledDate === d.key ? '#FFFFFF' : '#F8FAFC',
                                                                boxShadow: scheduledDate === d.key ? 'var(--shadow-sm)' : 'none',
                                                                cursor: 'pointer'
                                                            }}
                                                        >
                                                            <strong style={{ fontSize: '13px', display: 'block', color: 'var(--dark)' }}>{d.label}</strong>
                                                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{d.sub}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* 2. PILIH SLOT JAM PENGIRIMAN */}
                                            <div>
                                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--dark)', marginBottom: '8px' }}>
                                                    <i className="fa-regular fa-clock" style={{ marginRight: '6px', color: 'var(--primary)' }}></i>
                                                    {isEn ? 'Select Delivery Time Slot:' : 'Pilih Slot Jam Tiba Di Rumah:'}
                                                </label>
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                                    {[
                                                        { key: '06:00 - 08:00 WIB', title: '06:00 - 08:00 WIB', badge: '☀️ Slot Pagi Paling Segar' },
                                                        { key: '08:00 - 10:00 WIB', title: '08:00 - 10:00 WIB', badge: '🌤️ Slot Sarapan' },
                                                        { key: '11:00 - 13:00 WIB', title: '11:00 - 13:00 WIB', badge: '🌤️ Slot Makan Siang' },
                                                        { key: '15:00 - 17:00 WIB', title: '15:00 - 17:00 WIB', badge: '🌇 Slot Makan Malam' }
                                                    ].map(slot => (
                                                        <div
                                                            key={slot.key}
                                                            onClick={() => setScheduledTimeSlot(slot.key)}
                                                            style={{
                                                                padding: '12px 14px',
                                                                borderRadius: 'var(--radius-md)',
                                                                border: scheduledTimeSlot === slot.key ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                                                                backgroundColor: scheduledTimeSlot === slot.key ? '#FFFFFF' : '#F8FAFC',
                                                                boxShadow: scheduledTimeSlot === slot.key ? 'var(--shadow-sm)' : 'none',
                                                                cursor: 'pointer'
                                                            }}
                                                        >
                                                            <div style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--primary)', marginBottom: '2px' }}>{slot.badge}</div>
                                                            <strong style={{ fontSize: '14px', color: 'var(--dark)' }}>{slot.title}</strong>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* SECTION 3: PAYMENT METHOD */}
                            <div style={{
                                background: '#FFFFFF',
                                borderRadius: 'var(--radius-xl)',
                                padding: '28px 24px',
                                border: '1px solid var(--border-light)',
                                boxShadow: 'var(--shadow-sm)'
                            }}>
                                <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--dark)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <i className="fa-solid fa-credit-card text-green"></i>
                                    {isEn ? '3. Payment Method' : '3. Metode Pembayaran'}
                                </h3>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <div
                                        onClick={() => setPaymentMethod('WHATSAPP_DIRECT')}
                                        style={{
                                            padding: '16px 20px',
                                            borderRadius: 'var(--radius-lg)',
                                            border: paymentMethod === 'WHATSAPP_DIRECT' ? '2px solid #25D366' : '1px solid var(--border-color)',
                                            backgroundColor: paymentMethod === 'WHATSAPP_DIRECT' ? '#F0FDF4' : '#FFFFFF',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between'
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <i className="fa-brands fa-whatsapp" style={{ color: '#25D366', fontSize: '24px' }}></i>
                                            <div>
                                                <strong style={{ fontSize: '14.5px', color: 'var(--dark)', display: 'block' }}>
                                                    {isEn ? 'WhatsApp Direct Admin COD / Nota' : 'WhatsApp Direct COD / Nota Admin Kebun'}
                                                </strong>
                                                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                                                    {isEn ? 'Automatic order receipt sent to Admin WhatsApp' : 'Konfirmasi nota langsung dikirim otomatis ke WA Admin'}
                                                </span>
                                            </div>
                                        </div>
                                        <span style={{ fontSize: '12px', fontWeight: 700, backgroundColor: '#25D366', color: '#FFFFFF', padding: '4px 10px', borderRadius: 'var(--radius-full)' }}>FAVORIT</span>
                                    </div>

                                    <div
                                        onClick={() => setPaymentMethod('QRIS_BANK')}
                                        style={{
                                            padding: '16px 20px',
                                            borderRadius: 'var(--radius-lg)',
                                            border: paymentMethod === 'QRIS_BANK' ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                                            backgroundColor: paymentMethod === 'QRIS_BANK' ? '#F0FDF4' : '#FFFFFF',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between'
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <i className="fa-solid fa-qrcode" style={{ color: 'var(--primary)', fontSize: '22px' }}></i>
                                            <div>
                                                <strong style={{ fontSize: '14.5px', color: 'var(--dark)', display: 'block' }}>
                                                    {isEn ? 'QRIS & Transfer Bank Instant' : 'QRIS Instant & Transfer Bank'}
                                                </strong>
                                                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                                                    BCA, Mandiri, BRI, GoPay, OVO, ShopeePay
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: ORDER INVOICE SUMMARY CARD */}
                        <div style={{ position: 'sticky', top: '100px' }}>
                            <div style={{
                                background: '#FFFFFF',
                                borderRadius: 'var(--radius-xl)',
                                padding: '28px 24px',
                                border: '1px solid var(--border-light)',
                                boxShadow: 'var(--shadow-md)'
                            }}>
                                <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--dark)', marginBottom: '16px', borderBottom: '1px solid var(--border-light)', paddingBottom: '14px' }}>
                                    {isEn ? 'Order Items' : 'Rincian Sayuran'} ({cart.length})
                                </h3>

                                {/* ITEMS SCROLLABLE LIST */}
                                <div style={{ maxHeight: '240px', overflowY: 'auto', marginBottom: '20px', paddingRight: '4px' }}>
                                    {cart.map(i => {
                                        const p = i.product;
                                        const title = isEn && p.titleEn ? p.titleEn : p.title;
                                        return (
                                            <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '13.5px' }}>
                                                <div>
                                                    <strong style={{ color: 'var(--dark)' }}>{title}</strong>
                                                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '12px' }}>{i.qty}x @ {formatPrice(p.price)}</span>
                                                </div>
                                                <strong style={{ color: 'var(--primary)' }}>{formatPrice(p.price * i.qty)}</strong>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* TOTAL BREAKDOWN */}
                                <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px', marginBottom: '20px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                                        <span>Subtotal</span>
                                        <span>{formatPrice(cartSubtotalIDR)}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                                        <span>{isEn ? 'Shipping Fee' : 'Biaya Pengiriman'}</span>
                                        {!hasAddress ? (
                                            <span style={{ color: '#64748B', fontWeight: 600, fontSize: '13px' }}>
                                                {isEn ? 'Enter Address First' : 'Ketik Alamat Pertama'}
                                            </span>
                                        ) : !zone.isAllowed ? (
                                            <span style={{ color: '#DC2626', fontWeight: 700, fontSize: '13px' }}>
                                                {isEn ? 'Delivery Unavailable' : 'Tidak Tersedia'}
                                            </span>
                                        ) : (
                                            <span style={{ color: isFreeShipping ? '#166534' : 'var(--dark)', fontWeight: 700 }}>
                                                {isFreeShipping ? (isEn ? 'FREE' : 'GRATIS') : formatPrice(shippingCostIDR)}
                                            </span>
                                        )}
                                    </div>
                                    <div style={{ borderTop: '1px dashed var(--border-color)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--dark)' }}>Total Pembayaran</span>
                                        <div style={{ textAlign: 'right' }}>
                                            <span style={{ fontSize: '22px', fontWeight: 800, color: zone.isAllowed ? 'var(--primary)' : '#DC2626', display: 'block' }}>
                                                {formatPrice(finalTotalIDR)}
                                            </span>
                                            {!hasAddress && (
                                                <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 500 }}>
                                                    {isEn ? '(Excl. Shipping Fee)' : '(Belum Termasuk Ongkir)'}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* CONFIRM CHECKOUT BUTTON */}
                                <button
                                    type="submit"
                                    disabled={isLoading || (hasAddress && !zone.isAllowed)}
                                    className="btn btn-primary btn-block"
                                    style={{
                                        padding: '16px',
                                        fontSize: '15px',
                                        fontWeight: 700,
                                        borderRadius: 'var(--radius-md)',
                                        justifyContent: 'center',
                                        backgroundColor: !zone.isAllowed && hasAddress 
                                            ? '#94A3B8' 
                                            : (paymentMethod === 'WHATSAPP_DIRECT' ? '#25D366' : 'var(--primary)'),
                                        cursor: !zone.isAllowed && hasAddress ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    {isLoading ? (
                                        <span>{isEn ? 'Processing Order...' : 'Membuat Pesanan...'}</span>
                                    ) : !zone.isAllowed && hasAddress ? (
                                        <>
                                            <i className="fa-solid fa-ban"></i>
                                            <span>{isEn ? 'Outside Delivery Area' : 'Alamat Di Luar Batas Pengiriman'}</span>
                                        </>
                                    ) : (
                                        <>
                                            <i className="fa-solid fa-shield-check"></i>
                                            <span>{isEn ? 'Confirm & Create Order' : 'Konfirmasi & Buat Pesanan'}</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                )}
            </div>

            {/* MODAL PETA INTERAKTIF */}
            {isMapModalOpen && (
                <AddressMapPicker
                    onSelectLocation={(selectedAddress) => setCustomerAddress(selectedAddress)}
                    onClose={() => setIsMapModalOpen(false)}
                    isEn={isEn}
                />
            )}
        </main>
    );
}
