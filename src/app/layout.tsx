import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { branding } from '@/config/branding';
import './globals.css';

export const metadata: Metadata = {
  title: `${branding.chatbotName} | ${branding.companyName}`,
  description: branding.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className={`${GeistSans.className} antialiased tracking-tighter`}>
        <div className="noise-overlay" />
        {children}
      </body>
    </html>
  );
}
