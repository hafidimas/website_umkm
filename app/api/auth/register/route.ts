import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

// POST /api/auth/register - Pendaftaran Pengguna via WhatsApp / Email
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, phoneWa, email, password, registrationMethod } = body;

        if (!name) {
            return NextResponse.json({
                success: false,
                message: 'Nama lengkap wajib diisi'
            }, { status: 400 });
        }

        let existingUser = null;

        // Metodologi 1: Register via WhatsApp
        if (registrationMethod === 'whatsapp') {
            if (!phoneWa) {
                return NextResponse.json({
                    success: false,
                    message: 'Nomor WhatsApp wajib diisi'
                }, { status: 400 });
            }

            // Normalisasi nomor HP ke format standar (misal: 0812... atau 62812...)
            const cleanPhone = phoneWa.replace(/[^0-9]/g, '');

            existingUser = await prisma.user.findFirst({
                where: { phoneWa: cleanPhone }
            });

            if (existingUser) {
                return NextResponse.json({
                    success: true,
                    message: 'Nomor WhatsApp sudah terdaftar! Mengalihkan ke akun Anda...',
                    data: existingUser,
                    isExisting: true
                });
            }

            const newUser = await prisma.user.create({
                data: {
                    name,
                    phoneWa: cleanPhone,
                    isWaVerified: true,
                    role: 'CUSTOMER'
                }
            });

            return NextResponse.json({
                success: true,
                message: 'Registrasi via WhatsApp berhasil!',
                data: newUser,
                redirectWaUrl: `https://wa.me/6281298765432?text=Halo%20Admin%20Devsecora%20Hydroponics,%20saya%20telah%20mendaftar%20akun%20baru:%0ANama:%20${encodeURIComponent(name)}%0ANo.WA:%20${encodeURIComponent(cleanPhone)}%0AMohon%20bantu%20konfirmasi%20pendaftaran%20akun%20saya.`
            }, { status: 201 });
        }

        // Metodologi 2: Register via Email
        if (!email || !password) {
            return NextResponse.json({
                success: false,
                message: 'Email dan password wajib diisi untuk pendaftaran email'
            }, { status: 400 });
        }

        existingUser = await prisma.user.findFirst({
            where: { email }
        });

        if (existingUser) {
            return NextResponse.json({
                success: false,
                message: 'Email sudah terdaftar. Silakan gunakan email lain atau login.'
            }, { status: 400 });
        }

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                passwordHash: password, // Di versi produksi menggunakan bcrypt/argon2
                role: 'CUSTOMER'
            }
        });

        return NextResponse.json({
            success: true,
            message: 'Registrasi Akun Email berhasil!',
            data: newUser
        }, { status: 201 });

    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: 'Gagal memproses pendaftaran akun',
            error: error?.message
        }, { status: 500 });
    }
}
