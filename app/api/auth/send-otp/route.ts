import { NextRequest, NextResponse } from 'next/server';

// In-Memory OTP Store untuk simulasi cepat & handal (Nomor WA -> { otp, expiresAt })
const otpStore = new Map<string, { otp: string; expiresAt: number }>();

// GET helper untuk mengakses store secara aman di endpoint verifikasi
export function getOtpFromStore(phone: string) {
    return otpStore.get(phone);
}

export function removeOtpFromStore(phone: string) {
    otpStore.delete(phone);
}

// POST /api/auth/send-otp - Mengirimkan Kode OTP 6-Digit via WhatsApp
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { phoneWa } = body;

        if (!phoneWa) {
            return NextResponse.json({
                success: false,
                message: 'Nomor WhatsApp wajib diisi'
            }, { status: 400 });
        }

        const cleanPhone = phoneWa.replace(/[^0-9]/g, '');
        if (cleanPhone.length < 9) {
            return NextResponse.json({
                success: false,
                message: 'Nomor WhatsApp tidak valid'
            }, { status: 400 });
        }

        // Generate 6 Digit Kode OTP acak (Contoh: 849201)
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = Date.now() + 5 * 60 * 1000; // Kadaluarsa dalam 5 menit

        // Simpan di store
        otpStore.set(cleanPhone, { otp: otpCode, expiresAt });

        // Teks Pesan WhatsApp Otomatis
        const waMessage = `Kode%20verifikasi%20OTP%20Kebun%20Devsecora%20Anda%20adalah:%20*${otpCode}*.%20Jangan%20berikan%20kode%20ini%20kepada%20siapapun.%20Berlaku%205%20menit.`;
        const waDemoLink = `https://wa.me/62${cleanPhone.replace(/^0/, '')}?text=${waMessage}`;

        return NextResponse.json({
            success: true,
            message: `Kode OTP 6-Digit (${otpCode}) berhasil dikirim ke WhatsApp ${cleanPhone}!`,
            otpCode, // Dikirim untuk kemudahan testing / simulasi demo
            phoneWa: cleanPhone,
            expiresInSeconds: 300,
            waDemoLink
        });

    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: 'Gagal mengirimkan kode OTP',
            error: error?.message
        }, { status: 500 });
    }
}
