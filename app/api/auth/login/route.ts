import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

// POST /api/auth/login - Login dengan Email + Password
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, password } = body;

        // Validasi input
        if (!email || !password) {
            return NextResponse.json({
                success: false,
                message: 'Email dan password wajib diisi'
            }, { status: 400 });
        }

        // Cari user berdasarkan email
        const user = await prisma.user.findFirst({
            where: { email: email.toLowerCase().trim() }
        });

        // Jika email tidak ditemukan di database
        if (!user) {
            return NextResponse.json({
                success: false,
                message: 'Email tidak terdaftar. Silakan daftar akun baru terlebih dahulu.'
            }, { status: 401 });
        }

        // Jika user daftar via WhatsApp dan tidak punya password
        if (!user.passwordHash) {
            return NextResponse.json({
                success: false,
                message: 'Akun ini terdaftar tanpa password. Silakan hubungi admin.'
            }, { status: 401 });
        }

        // Cek password (plain text comparison — ganti bcrypt di produksi)
        if (user.passwordHash !== password) {
            return NextResponse.json({
                success: false,
                message: 'Password salah. Periksa kembali password Anda.'
            }, { status: 401 });
        }

        // Login berhasil — kembalikan data user (tanpa password)
        return NextResponse.json({
            success: true,
            message: `Selamat datang kembali, ${user.name}!`,
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: 'Terjadi kesalahan server',
            error: error?.message
        }, { status: 500 });
    }
}
