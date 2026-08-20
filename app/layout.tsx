import './globals.css';
import { Metadata } from 'next';
import { ShopProvider } from '../context/ShopContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { CartDrawer } from '../components/CartDrawer';
import { ProductModal } from '../components/ProductModal';
import { AuthModal } from '../components/AuthModal';
import { ToastContainer } from '../components/ToastContainer';

export const metadata: Metadata = {
    metadataBase: new URL('https://devsecora-hydroponics.vercel.app'),
    title: {
        default: 'Devsecora Hydroponics - Sayuran & Buah Segar Bebas Pestisida Serang',
        template: '%s | Devsecora Hydroponics'
    },
    description: 'Toko online resmi sayuran hidroponik & buah segar panen jam 5 pagi di Serang, Banten. 100% bebas pestisida, dikirim express 15-30 menit ke Cipocok Jaya & sekitarnya.',
    keywords: [
        'sayur hidroponik serang',
        'sayuran bebas pestisida',
        'kebun cipocok jaya',
        'sayur organik banten',
        'jual pakcoy serang',
        'selada hidroponik',
        'devsecora farm',
        'buah segar serang'
    ],
    authors: [{ name: 'Devsecora Hydro Farm Team' }],
    openGraph: {
        title: 'Devsecora Hydroponics - Sayuran & Buah Segar Bebas Pestisida',
        description: 'Toko online resmi sayuran hidroponik & buah segar panen jam 5 pagi di Serang, Banten. 100% bebas pestisida, dikirim 15-30 menit.',
        url: 'https://devsecora-hydroponics.vercel.app',
        siteName: 'Devsecora Hydroponics',
        locale: 'id_ID',
        type: 'website',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const jsonLdData = {
        "@context": "https://schema.org",
        "@type": "GroceryStore",
        "name": "Devsecora Hydroponics",
        "image": "https://images.unsplash.com/photo-1540420773420-3366772f4999",
        "description": "Toko online sayuran hidroponik & buah organik segar panen jam 5 pagi di Kota Serang. 100% bebas pestisida.",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "Jl. Raya Cipocok Jaya No. 45",
            "addressLocality": "Serang",
            "addressRegion": "Banten",
            "postalCode": "42121",
            "addressCountry": "ID"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": -6.1362,
            "longitude": 106.1685
        },
        "url": "https://devsecora-hydroponics.vercel.app",
        "telephone": "+6281234567890",
        "priceRange": "Rp 5.000 - Rp 150.000",
        "openingHoursSpecification": [
            {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                "opens": "05:00",
                "closes": "20:00"
            }
        ]
    };

    return (
        <html lang="id">
            <head>
                {/* Google Fonts */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@1,600;1,700&display=swap" rel="stylesheet" />
                {/* Font Awesome Icons */}
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

                {/* Structured Data JSON-LD for Google Rich Results */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
                />
            </head>
            <body>
                <ShopProvider>
                    <Navbar />
                    {children}
                    <Footer />
                    <CartDrawer />
                    <ProductModal />
                    <AuthModal />
                    <ToastContainer />
                </ShopProvider>
            </body>
        </html>
    );
}
