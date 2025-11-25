import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Receiptr - Digital Receipt Generator',
  
  verification: {
    google: "FhB1pmAlgd8FdgXXc3EGMiEZtyhnxq31zzqHfDir1G8"
  },
  description: 'Create and share professional digital receipts instantly',
   
   keywords: "digital receipt generator, online receipt maker, small business receipts, professional receipts, e-receipt, freelancer receipt tool, instant receipt share",
    authors: [{ name: "Marvellous Ogunleke" }],
  openGraph: {
    title: "Receiptr - Digital Receipt Generator",
    description: "Create and share professional digital receipts instantly",
    type: "website",
    images: [
      {
        url: 'https://receiptr-plum.vercel.app/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Receiptr Digital Receipt Generator Logo',
      },
    ],
  
   url: "https://receiptr-plum.vercel.app", 
  },
  alternates: {
    canonical: "https://receiptr-plum.vercel.app", 
  },

};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
