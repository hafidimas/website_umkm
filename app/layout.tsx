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
    title: 'Devsecora Hydroponics - Sayuran & Buah Segar Bebas Pestisida',
    description: 'Toko online sayuran hidroponik & buah organik segar panen jam 5 pagi. 100% bebas pestisida, dikirim 15-30 menit.',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="id">
            <head>
                {/* Google Fonts */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@1,600;1,700&display=swap" rel="stylesheet" />
                {/* Font Awesome Icons */}
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
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
