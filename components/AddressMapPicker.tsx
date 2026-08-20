'use client';

import React, { useState, useEffect, useRef } from 'react';

declare global {
    interface Window {
        L: any;
    }
}

interface AddressMapPickerProps {
    onSelectLocation: (addressText: string, coords: { lat: number; lng: number }) => void;
    onClose: () => void;
    isEn?: boolean;
}

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

export const AddressMapPicker: React.FC<AddressMapPickerProps> = ({ onSelectLocation, onClose, isEn = false }) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const [leafletLoaded, setLeafletLoaded] = useState(false);
    const [coords, setCoords] = useState<{ lat: number; lng: number }>({
        lat: CIPOCOK_LAT,
        lng: CIPOCOK_LNG
    });
    const [addressText, setAddressText] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [isGeocoding, setIsGeocoding] = useState<boolean>(false);
    const [isGpsLoading, setIsGpsLoading] = useState<boolean>(false);
    const [distanceKm, setDistanceKm] = useState<number>(0);
    const [isOutsideCircle, setIsOutsideCircle] = useState<boolean>(false);

    const mapInstanceRef = useRef<any>(null);
    const markerInstanceRef = useRef<any>(null);

    // DYNAMICALLY LOAD LEAFLET CSS & JS FROM CDN
    useEffect(() => {
        if (typeof window === 'undefined') return;

        // Load Leaflet CSS
        if (!document.getElementById('leaflet-css')) {
            const link = document.createElement('link');
            link.id = 'leaflet-css';
            link.rel = 'stylesheet';
            link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
            document.head.appendChild(link);
        }

        // Load Leaflet JS
        if (window.L) {
            setLeafletLoaded(true);
        } else {
            const script = document.createElement('script');
            script.id = 'leaflet-js';
            script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
            script.onload = () => setLeafletLoaded(true);
            document.body.appendChild(script);
        }
    }, []);

    // INITIALIZE MAP, MARKER & LINGKARAN PEMBATAS
    useEffect(() => {
        if (!leafletLoaded || !mapRef.current || mapInstanceRef.current) return;

        const L = window.L;

        // Initialize Map centered around Cipocok Jaya, Serang
        const map = L.map(mapRef.current).setView([CIPOCOK_LAT, CIPOCOK_LNG], 13);
        mapInstanceRef.current = map;

        // Tile Layer (OpenStreetMap)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        // LINGKARAN PEMBATAS DENGAN CIPOCOK DI TENGAH
        L.circle([CIPOCOK_LAT, CIPOCOK_LNG], {
            color: '#166534',
            fillColor: '#22C55E',
            fillOpacity: 0.12,
            radius: MAX_RADIUS_KM * 1000,
            weight: 2.5,
            dashArray: '6, 6'
        }).addTo(map);

        // MARKER PUSAT KEBUN CIPOCOK JAYA
        const farmIcon = L.divIcon({
            className: 'farm-center-pin',
            html: `<div style="background-color:#166534; color:#FFFFFF; padding:4px 10px; borderRadius:16px; font-size:11px; font-weight:800; white-space:nowrap; box-shadow:0 3px 8px rgba(0,0,0,0.4); border:2px solid #FFFFFF; display:flex; align-items:center; gap:5px;"><i class="fa-solid fa-seedling" style="color:#4ADE80;"></i> Pusat Kebun Cipocok</div>`,
            iconSize: [140, 26],
            iconAnchor: [70, 13]
        });
        L.marker([CIPOCOK_LAT, CIPOCOK_LNG], { icon: farmIcon, interactive: false }).addTo(map);

        // Custom Marker Icon Pengguna
        const customIcon = L.divIcon({
            className: 'custom-map-pin',
            html: `<div style="background-color:#2D5A27; color:#FFFFFF; width:38px; height:38px; borderRadius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 14px rgba(0,0,0,0.4); border:2.5px solid #FFFFFF;"><i class="fa-solid fa-location-dot" style="font-size:20px;"></i></div>`,
            iconSize: [38, 38],
            iconAnchor: [19, 38]
        });

        // Add Marker Pengguna
        const marker = L.marker([coords.lat, coords.lng], { draggable: true, icon: customIcon }).addTo(map);
        markerInstanceRef.current = marker;

        // Initial Geocode & Distance Check
        reverseGeocode(coords.lat, coords.lng);

        // Event: Marker Drag End
        marker.on('dragend', () => {
            const position = marker.getLatLng();
            setCoords({ lat: position.lat, lng: position.lng });
            reverseGeocode(position.lat, position.lng);
        });

        // Event: Click on Map
        map.on('click', (e: any) => {
            const { lat, lng } = e.latlng;
            marker.setLatLng([lat, lng]);
            setCoords({ lat, lng });
            reverseGeocode(lat, lng);
        });

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [leafletLoaded]);

    // REVERSE GEOCODING & HITUNG JARAK PRESISI DARI KEBUN CIPOCOK
    const reverseGeocode = async (lat: number, lng: number) => {
        setIsGeocoding(true);
        
        // Hitung Jarak dalam KM dari pusat kebun Cipocok Jaya (-6.1362, 106.1685)
        const dist = calculateDistanceKm(CIPOCOK_LAT, CIPOCOK_LNG, lat, lng);
        setDistanceKm(dist);

        const outside = dist > MAX_RADIUS_KM;
        setIsOutsideCircle(outside);

        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
            const data = await res.json();

            if (data && data.display_name) {
                const parts = data.address || {};
                const road = parts.road || parts.pedestrian || parts.suburb || '';
                const village = parts.village || parts.suburb || parts.neighbourhood || '';
                const city = parts.city || parts.town || parts.county || parts.regency || 'Serang';
                const state = parts.state || 'Banten';
                const postcode = parts.postcode ? `, ${parts.postcode}` : '';

                const formatted = [road, village, city, state].filter(Boolean).join(', ') + postcode;
                const fullTextWithCoords = `${formatted} (GPS: ${lat.toFixed(5)}, ${lng.toFixed(5)})`;
                setAddressText(fullTextWithCoords);
            } else {
                setAddressText(`Koordinat GPS: ${lat.toFixed(5)}, ${lng.toFixed(5)}`);
            }
        } catch (err) {
            setAddressText(`Koordinat GPS: ${lat.toFixed(5)}, ${lng.toFixed(5)}`);
        } finally {
            setIsGeocoding(false);
        }
    };

    // SEARCH ADDRESS SEARCHBAR
    const handleSearchLocation = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setIsGeocoding(true);
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery + ', Banten, Indonesia')}`);
            const results = await res.json();

            if (results && results.length > 0) {
                const topResult = results[0];
                const newLat = parseFloat(topResult.lat);
                const newLng = parseFloat(topResult.lon);

                setCoords({ lat: newLat, lng: newLng });

                if (mapInstanceRef.current) {
                    mapInstanceRef.current.setView([newLat, newLng], 15);
                }
                if (markerInstanceRef.current) {
                    markerInstanceRef.current.setLatLng([newLat, newLng]);
                }

                reverseGeocode(newLat, newLng);
            } else {
                alert(isEn ? 'Location not found. Try entering street/subdistrict name.' : 'Lokasi tidak ditemukan. Coba ketik nama jalan / kelurahan / kecamatan.');
            }
        } catch (err) {
            alert('Gagal mencari lokasi di peta');
        } finally {
            setIsGeocoding(false);
        }
    };

    // CURRENT GPS LOCATION
    const handleUseCurrentGps = () => {
        if (!navigator.geolocation) {
            alert(isEn ? 'GPS Geolocation is not supported by your browser' : 'Browser Anda tidak mendukung GPS Geolocation');
            return;
        }

        setIsGpsLoading(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const userLat = pos.coords.latitude;
                const userLng = pos.coords.longitude;

                setCoords({ lat: userLat, lng: userLng });

                if (mapInstanceRef.current) {
                    mapInstanceRef.current.setView([userLat, userLng], 16);
                }
                if (markerInstanceRef.current) {
                    markerInstanceRef.current.setLatLng([userLat, userLng]);
                }

                reverseGeocode(userLat, userLng);
                setIsGpsLoading(false);
            },
            () => {
                alert(isEn ? 'Failed to get GPS location. Please allow location access.' : 'Gagal mengambil lokasi GPS. Pastikan izin lokasi diaktifkan.');
                setIsGpsLoading(false);
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    const handleConfirmSelection = () => {
        if (!addressText) {
            alert(isEn ? 'Please pick a point on the map first' : 'Mohon tentukan titik lokasi pada peta terlebih dahulu');
            return;
        }
        onSelectLocation(addressText, coords);
        onClose();
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
        }}>
            <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-xl)',
                width: '100%',
                maxWidth: '780px',
                maxHeight: '90vh',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-xl)'
            }}>
                {/* HEADER */}
                <div style={{
                    padding: '18px 24px',
                    borderBottom: '1px solid var(--border-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: '#FFFFFF'
                }}>
                    <div>
                        <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--dark)', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
                            <i className="fa-solid fa-map-location-dot" style={{ color: 'var(--primary)', fontSize: '20px' }}></i>
                            {isEn ? 'Pinpoint Delivery Address Location' : 'Pilih Titik Lokasi Alamat Pengiriman'}
                        </h3>
                        <span style={{ fontSize: '12px', color: '#166534', fontWeight: 700, marginTop: '2px', display: 'block' }}>
                            🟢 Kebun Devsecora Cipocok Jaya, Serang
                        </span>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        style={{ border: 'none', background: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--text-muted)' }}
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>

                {/* SEARCH & GPS CONTROLS */}
                <div style={{ padding: '14px 20px', backgroundColor: '#F8FAFC', borderBottom: '1px solid var(--border-light)', display: 'flex', gap: '10px' }}>
                    <form onSubmit={handleSearchLocation} style={{ flex: 1, display: 'flex', gap: '8px' }}>
                        <input
                            type="text"
                            placeholder={isEn ? 'Search street, subdistrict, city name...' : 'Cari nama jalan, komplek, kelurahan, kecamatan...'}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                flex: 1,
                                padding: '10px 14px',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--border-color)',
                                fontSize: '13.5px'
                            }}
                        />
                        <button
                            type="submit"
                            className="btn btn-outline"
                            style={{ padding: '10px 16px', fontSize: '13.5px', fontWeight: 700 }}
                        >
                            <i className="fa-solid fa-magnifying-glass"></i>
                            <span>{isEn ? 'Search' : 'Cari'}</span>
                        </button>
                    </form>

                    <button
                        type="button"
                        onClick={handleUseCurrentGps}
                        disabled={isGpsLoading}
                        className="btn"
                        style={{
                            backgroundColor: '#F0FDF4',
                            color: 'var(--primary)',
                            border: '1px solid #BBF7D0',
                            fontSize: '13px',
                            fontWeight: 700,
                            padding: '10px 16px',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        <i className="fa-solid fa-crosshairs"></i>
                        <span>{isGpsLoading ? (isEn ? 'Locating...' : 'Mencari GPS...') : (isEn ? 'Use My GPS' : 'GPS Saya')}</span>
                    </button>
                </div>

                {/* INTERACTIVE MAP CONTAINER */}
                <div style={{ position: 'relative', height: '400px', width: '100%', backgroundColor: '#E2E8F0' }}>
                    <div ref={mapRef} style={{ width: '100%', height: '100%' }}></div>
                    {!leafletLoaded && (
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F1F5F9', color: 'var(--dark)', fontWeight: 700 }}>
                            <i className="fa-solid fa-spinner fa-spin" style={{ marginRight: '8px' }}></i>
                            {isEn ? 'Loading Interactive Map...' : 'Memuat Peta Pilihan Lokasi...'}
                        </div>
                    )}
                </div>

                {/* FOOTER & CONFIRM BUTTON */}
                <div style={{ padding: '18px 24px', backgroundColor: '#FFFFFF', borderTop: '1px solid var(--border-light)' }}>
                    <div style={{ marginBottom: '14px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 700 }}>
                                {isEn ? 'Detected Pinpoint Address:' : 'Alamat Titik Terdeteksi:'}
                            </span>
                            <span style={{
                                fontSize: '11.5px',
                                fontWeight: 800,
                                color: isOutsideCircle ? '#DC2626' : '#166534',
                                backgroundColor: isOutsideCircle ? '#FEE2E2' : '#DCFCE7',
                                padding: '2px 8px',
                                borderRadius: 'var(--radius-full)'
                            }}>
                                📍 {distanceKm.toFixed(1)} km dari Kebun Cipocok {isOutsideCircle ? '(Di Luar Jangkauan)' : '(Dalam Jangkauan)'}
                            </span>
                        </div>
                        <div style={{
                            fontSize: '13.5px',
                            color: isOutsideCircle ? '#B91C1C' : 'var(--dark)',
                            fontWeight: 600,
                            backgroundColor: isOutsideCircle ? '#FEF2F2' : '#F8FAFC',
                            padding: '10px 12px',
                            borderRadius: 'var(--radius-md)',
                            border: isOutsideCircle ? '1.5px solid #FCA5A5' : '1px solid var(--border-color)'
                        }}>
                            {isGeocoding ? (
                                <span style={{ color: 'var(--primary)' }}>
                                    <i className="fa-solid fa-spinner fa-spin" style={{ marginRight: '6px' }}></i>
                                    {isEn ? 'Reading address details from pinpoint...' : 'Mengambil rincian alamat dari titik peta...'}
                                </span>
                            ) : isOutsideCircle ? (
                                <span style={{ color: '#DC2626', fontWeight: 700 }}>
                                    <i className="fa-solid fa-triangle-exclamation" style={{ marginRight: '6px' }}></i>
                                    Mohon maaf, anda berada diluar batas pengiriman kami
                                </span>
                            ) : (
                                addressText || (isEn ? 'Click anywhere on the map to pin your location' : 'Klik lokasi mana saja di peta untuk menaruh titik alamat')
                            )}
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn btn-outline"
                            style={{ padding: '12px 20px', fontSize: '14px', fontWeight: 700 }}
                        >
                            {isEn ? 'Cancel' : 'Batal'}
                        </button>

                        <button
                            type="button"
                            onClick={handleConfirmSelection}
                            className="btn btn-primary"
                            style={{ padding: '12px 24px', fontSize: '14px', fontWeight: 700 }}
                        >
                            <i className="fa-solid fa-check"></i>
                            <span>{isEn ? 'Use This Map Location' : 'Gunakan Titik Lokasi Ini'}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
