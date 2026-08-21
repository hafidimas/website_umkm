import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

// POST /api/auth/register - Pendaftaran via Email + Password
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, email, password, confirmPassword } = body;

        // Validasi: semua field wajib ada
        if (!name || !email || !password) {
            return NextResponse.json({
                success: false,
                message: 'Nama, email, dan password wajib diisi'
            }, { status: 400 });
        }

        // Validasi: nama minimal 2 karakter
        if (name.trim().length < 2) {
            return NextResponse.json({
                success: false,
                message: 'Nama lengkap minimal 2 karakter'
            }, { status: 400 });
        }

        // Validasi: format email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({
                success: false,
                message: 'Format email tidak valid'
            }, { status: 400 });
        }

        // Validasi: password minimal 6 karakter
        if (password.length < 6) {
            return NextResponse.json({
                success: false,
                message: 'Password minimal 6 karakter'
            }, { status: 400 });
        }

        // Validasi: konfirmasi password harus cocok (jika dikirim dari frontend)
        if (confirmPassword !== undefined && password !== confirmPassword) {
            return NextResponse.json({
                success: false,
                message: 'Password dan konfirmasi password tidak cocok'
            }, { status: 400 });
        }

        // Cek apakah email sudah terdaftar
        const existingUser = await prisma.user.findFirst({
            where: { email: email.toLowerCase().trim() }
        });

        if (existingUser) {
            return NextResponse.json({
                success: false,
                message: 'Email sudah terdaftar. Silakan login atau gunakan email lain.'
            }, { status: 400 });
        }

        // Simpan user baru ke database
        const newUser = await prisma.user.create({
            data: {
                name: name.trim(),
                email: email.toLowerCase().trim(),
                passwordHash: password, // Gunakan bcrypt di produksi
                role: 'CUSTOMER'
            }
        });

        return NextResponse.json({
            success: true,
            message: `Akun berhasil dibuat! Selamat datang, ${newUser.name}.`,
            data: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email
            }
        }, { status: 201 });

    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: 'Gagal memproses pendaftaran',
            error: error?.message
        }, { status: 500 });
    }
}
