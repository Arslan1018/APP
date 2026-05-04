import type { Metadata } from 'next';
import { Providers } from '@/components/Providers';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'AR Menu — See Your Food in AR Before You Order',
  description: 'Scan QR codes to preview dishes in augmented reality. The future of restaurant menus.',
  openGraph: {
    title: 'AR Menu',
    description: 'Augmented Reality Restaurant Menus',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* model-viewer for AR on mobile */}
        <script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js" async />
      </head>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
