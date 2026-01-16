import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY
    ? new Resend(process.env.RESEND_API_KEY)
    : null;

interface SendRSVPNotificationProps {
    to: string;
    customerName: string;
    guestName: string;
    attendance: string;
    message?: string;
    invitationSlug: string;
}

export async function sendRSVPNotification({
    to,
    customerName,
    guestName,
    attendance,
    message,
    invitationSlug
}: SendRSVPNotificationProps) {
    if (!resend) {
        console.log("📧 [MOCK EMAIL] RSVP Notification:");
        console.log(`To: ${to}`);
        console.log(`Subject: Cie! Ada RSVP baru dari ${guestName}`);
        console.log(`Body: Halo ${customerName}, ${guestName} baru saja mengisi konfirmasi kehadiran (${attendance}) untuk undangan ${invitationSlug}.`);
        return { success: true, mocked: true };
    }

    try {
        const { data, error } = await resend.emails.send({
            from: 'Nikahin <notifications@nikahin.com>',
            to: [to],
            subject: `💍 RSVP Baru: ${guestName} mengkonfirmasi kehadiran!`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 12px; padding: 24px;">
                    <h2 style="color: #D4AF37; font-family: serif;">Cie! Ada Kabar Baru dari Tamu Undanganmu</h2>
                    <p>Halo <strong>${customerName}</strong>,</p>
                    <p>Selamat! Seseorang baru saja memberikan konfirmasi kehadiran untuk undangan pernikahanmu.</p>
                    
                    <div style="background: #f9fafb; padding: 16px; border-radius: 8px; margin: 20px 0;">
                        <p style="margin: 0; font-size: 14px; color: #666;">Nama Tamu:</p>
                        <p style="margin: 4px 0 12px 0; font-weight: bold; font-size: 18px;">${guestName}</p>
                        
                        <p style="margin: 0; font-size: 14px; color: #666;">Status Kehadiran:</p>
                        <p style="margin: 4px 0 12px 0; font-weight: bold; color: ${attendance === 'hadir' ? '#059669' : '#e11d48'};">
                            ${attendance.toUpperCase()}
                        </p>
                        
                        ${message ? `
                        <p style="margin: 0; font-size: 14px; color: #666;">Pesan:</p>
                        <p style="margin: 4px 0 0 0; font-style: italic;">"${message}"</p>
                        ` : ''}
                    </div>
                    
                    <p>Jangan lupa untuk membalas ucapan mereka di dashboard Nikahin ya!</p>
                    
                    <a href="https://nikahin.com/dashboard/rsvp" style="display: inline-block; background: #D4AF37; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 10px;">
                        Lihat Daftar Tamu & Balas Ucapan
                    </a>
                    
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 24px 0;" />
                    <p style="font-size: 12px; color: #999; text-align: center;">
                        Dikirim secara otomatis oleh Nikahin - Digital Wedding Invitation.
                    </p>
                </div>
            `,
        });

        if (error) {
            console.error("❌ Resend Error:", error);
            return { success: false, error };
        }

        return { success: true, data };
    } catch (err) {
        console.error("❌ Email Sending failed:", err);
        return { success: false, error: err };
    }
}
