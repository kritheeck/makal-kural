import type { Metadata } from 'next';
import { Inter, Noto_Sans_Tamil } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/components/providers/language-provider';
import { AuthProvider } from '@/components/providers/auth-provider';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const notoSansTamil = Noto_Sans_Tamil({
  subsets: ['tamil'],
  variable: '--font-noto-tamil',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Makkal Kural (மக்கள் குரல்) — Verified Civic Complaint Portal',
  description: 'Your complaint. The right representative. A clear voice. Politically neutral civic grievance routing platform for Tamil Nadu citizens.',
  keywords: ['Makkal Kural', 'Tamil Nadu', 'Grievance Redressal', 'Civic Complaints', 'MLA', 'Corporation', 'TANGEDCO', 'Roads', 'Water'],
  authors: [{ name: 'Makkal Kural Civic Tech' }],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${notoSansTamil.variable}`}>
      <body className="min-h-screen flex flex-col font-sans">
        <AuthProvider>
          <ThemeProvider>
            <LanguageProvider>
              <Navbar />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </LanguageProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
