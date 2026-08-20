import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

// GET /api/products - Mengambil data katalog produk dengan filter & sorting
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const categorySlug = searchParams.get('cat');
        const query = searchParams.get('q');
        const sortBy = searchParams.get('sortBy') || 'popular';

        let whereClause: any = {};

        if (categorySlug && categorySlug !== 'all') {
            whereClause.category = {
                slug: categorySlug
            };
        }

        if (query) {
            whereClause.OR = [
                { titleId: { contains: query } },
                { titleEn: { contains: query } },
                { descriptionId: { contains: query } }
            ];
        }

        let orderByClause: any = { rating: 'desc' };
        if (sortBy === 'price-low') orderByClause = { price: 'asc' };
        else if (sortBy === 'price-high') orderByClause = { price: 'desc' };
        else if (sortBy === 'name') orderByClause = { titleId: 'asc' };

        const products = await prisma.product.findMany({
            where: whereClause,
            orderBy: orderByClause,
            include: {
                category: true
            }
        });

        return NextResponse.json({
            success: true,
            total: products.length,
            data: products
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: 'Gagal mengambil data produk',
            error: error?.message
        }, { status: 500 });
    }
}

// POST /api/products - Menambah Produk Baru (Admin)
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const {
            categoryId,
            slug,
            titleId,
            titleEn,
            price,
            originalPrice,
            stock,
            weight,
            weightEn,
            harvestTime,
            nutritionId,
            nutritionEn,
            descriptionId,
            descriptionEn,
            image
        } = body;

        if (!categoryId || !slug || !titleId || !price) {
            return NextResponse.json({
                success: false,
                message: 'Field categoryId, slug, titleId, dan price wajib diisi'
            }, { status: 400 });
        }

        const newProduct = await prisma.product.create({
            data: {
                categoryId,
                slug,
                titleId,
                titleEn,
                price: parseFloat(price),
                originalPrice: parseFloat(originalPrice || price),
                stock: parseInt(stock || 50),
                weight,
                weightEn,
                harvestTime: harvestTime || 'Panen Pagi 05:00 WIB',
                nutritionId,
                nutritionEn,
                descriptionId,
                descriptionEn,
                image: image || 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80'
            }
        });

        return NextResponse.json({
            success: true,
            message: 'Produk sayur baru berhasil ditambahkan!',
            data: newProduct
        }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: 'Gagal membuat produk baru',
            error: error?.message
        }, { status: 500 });
    }
}
