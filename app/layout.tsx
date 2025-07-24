import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
// ...existing code...

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Postbit - HTTP API Testing Tool',
  description: 'A powerful REST client for testing APIs and web services, built with Next.js and PostgreSQL',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}