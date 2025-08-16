import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '🎮 Desafío Matemáticos Studio21',
  description: 'Juego educativo de matemáticas con misiles. Mejora tus habilidades matemáticas mientras te diviertes.',
  keywords: ['matemáticas', 'juego educativo', 'misiles', 'Studio21', 'aprendizaje'],
  authors: [{ name: 'Studio21' }],
  openGraph: {
    title: '🎮 Desafío Matemáticos Studio21',
    description: 'Juego educativo de matemáticas con misiles',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: [
    { rel: 'icon', url: '/images/favicon.png' },
    { rel: 'apple-touch-icon', url: '/images/favicon.png' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/images/favicon.png" />
      </head>
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}




