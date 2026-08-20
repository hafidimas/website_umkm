import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

// POST /api/orders - Pembuatan Transaksi Pesanan Baru
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { customerName, customerPhone, customerAddress, items, shippingNotes, paymentMethod } = body;

        if (!customerName || !customerPhone || !items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json({
                success: false,
                message: 'Informasi pelanggan dan daftar belanja wajib diisi'
            }, { status: 400 });
        }

        const orderNumber = `DEV-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

        let totalAmount = 0;
        const orderItemsData = items.map((item: any) => {
            const itemTotal = item.price * item.qty;
            totalAmount += itemTotal;
            return {
                productId: item.productId,
                qty: item.qty,
                price: item.price
            };
        });

        const newOrder = await prisma.order.create({
            data: {
                orderNumber,
                customerName,
                customerPhone,
                customerAddress: customerAddress || 'Ambil di Kebun Devsecora',
                totalAmount,
                paymentMethod: paymentMethod || 'WHATSAPP_DIRECT',
                shippingNotes,
                items: {
                    create: orderItemsData
                }
            },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        });

        // Format pesan konfirmasi WhatsApp otomatis
        const waItemsSummary = newOrder.items
            .map((i: any) => `• ${i.product.titleId} (${i.qty}x) = Rp ${(i.price * i.qty).toLocaleString('id-ID')}`)
            .join('%0A');

        const waText = `Halo%20Admin%20Devsecora%20Hydroponics!%0A%0ASaya%20ingin%20mengonfirmasi%20pesanan%20baru:%0A*No.%20Nota:*%20${orderNumber}%0A*Nama:*%20${encodeURIComponent(customerName)}%0A*No.%20WA:*%20${encodeURIComponent(customerPhone)}%0A%0A*Rincian%20Pesanan:*%0A${waItemsSummary}%0A%0A*Total:*%20Rp%20${totalAmount.toLocaleString('id-ID')}%0A*Catatan:*%20${encodeURIComponent(shippingNotes || '-')}%0A%0AMohon%20bantu%20proses%20pengiriman%20segar%20pagi%20ini.%20Terima%20kasih!`;

        return NextResponse.json({
            success: true,
            message: 'Pesanan berhasil dibuat!',
            orderNumber,
            data: newOrder,
            waRedirectUrl: `https://wa.me/6281298765432?text=${waText}`
        }, { status: 201 });

    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: 'Gagal membuat pesanan baru',
            error: error?.message
        }, { status: 500 });
    }
}
