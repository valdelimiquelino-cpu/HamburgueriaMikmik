import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'Catálogo da Hamburgueria',
  description: 'Cardápio artesanal com 4 hambúrgueres especiais, 4 refrigerantes, 4 sobremesas e checkout integrado.',
  openGraph: {
    title: 'Catálogo da Hamburgueria',
    description: 'Cardápio artesanal com 4 hambúrgueres especiais, 4 refrigerantes, 4 sobremesas e checkout integrado.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Catálogo da Hamburgueria',
    description: 'Cardápio artesanal com 4 hambúrgueres especiais, 4 refrigerantes, 4 sobremesas e checkout integrado.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
