import type { Metadata } from 'next';
import '@styles/global.css';
import Header from '@components/layout/Header';
import Footer from '@components/layout/Footer';
import FloatingButtons from '@components/common/FloatingButtons';
import CartDrawer from '@components/common/CartDrawer';
import { CartProvider } from '@components/common/CartContext';
import { buildMetadata } from '@lib/seo';

export const metadata: Metadata = buildMetadata('/');

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" prefix="og: https://ogp.me/ns#">
      <head>
        <link rel="icon" type="image/png" href="/images/logo.png" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/images/logo.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Alex+Brush&family=Cinzel:wght@400;600;700&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=Great+Vibes&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="relative overflow-x-clip">
        <CartProvider>
          <Header />
          <main className="w-full overflow-x-clip">{children}</main>
          <Footer />
          <FloatingButtons />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
