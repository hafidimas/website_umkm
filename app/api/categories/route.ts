import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

// GET /api/categories - Mengambil seluruh kategori aktif
export async function GET() {
    try {
        const categories = await prisma.category.findMany({
            where: { isActive: true },
            orderBy: { displayOrder: 'asc' },
            include: {
                _count: {
                    select: { products: true }
                }
            }
        });

        return NextResponse.json({
            success: true,
            data: categories
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: 'Gagal mengambil data kategori',
            error: error?.message
        }, { status: 500 });
    }
}

// POST /api/categories - Membuat Kategori Baru (Fleksibel Admin)
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { slug, nameId, nameEn, descriptionId, descriptionEn, iconName, imageUrl, displayOrder } = body;

        if (!slug || !nameId || !nameEn) {
            return NextResponse.json({
                success: false,
                message: 'Field slug, nameId, dan nameEn wajib diisi'
            }, { status: 400 });
        }

        const newCategory = await prisma.category.create({
            data: {
                slug,
                nameId,
                nameEn,
                descriptionId,
                descriptionEn,
                iconName: iconName || 'fa-leaf',
                imageUrl,
                displayOrder: displayOrder || 0,
            }
        });

        return NextResponse.json({
            success: true,
            message: 'Kategori baru berhasil ditambahkan oleh Admin!',
            data: newCategory
        }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: 'Gagal menambah kategori baru',
            error: error?.message
        }, { status: 500 });
    }
}
