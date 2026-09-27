import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { BookingProvider } from '@/context/BookingContext';
import { AuthProvider } from '@/context/AuthContext';
import ThemeRegistry from '@/theme/ThemeRegistry';

export const metadata: Metadata = {
  title: 'Thuê Camera — Cho thuê máy ảnh, lens & phụ kiện chuyên nghiệp',
  description:
    'Dịch vụ cho thuê máy ảnh Sony, Canon, Fujifilm, Nikon, lens và phụ kiện chuyên nghiệp tại TP.HCM. Thiết bị chính hãng, giá tốt, giao nhận tận nơi.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" data-scroll-behavior="smooth" suppressHydrationWarning className="h-full antialiased">
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-white text-[#111111]">
        <ThemeRegistry>
          <AuthProvider>
            <BookingProvider>
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </BookingProvider>
          </AuthProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
