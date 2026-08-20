// Shared In-Memory OTP Store untuk verifikasi cepat WhatsApp
const otpStore = new Map<string, { otp: string; expiresAt: number }>();

export function setOtpToStore(phone: string, otp: string, expiresAt: number) {
    otpStore.set(phone, { otp, expiresAt });
}

export function getOtpFromStore(phone: string) {
    return otpStore.get(phone);
}

export function removeOtpFromStore(phone: string) {
    otpStore.delete(phone);
}
