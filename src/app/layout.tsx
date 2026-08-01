import type { Metadata } from 'next';
import { Inter, Playfair_Display, Instrument_Serif, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', display: 'swap' });
const instrument = Instrument_Serif({ weight: "400", style: ["normal", "italic"], subsets: ['latin'], variable: '--font-instrument', display: 'swap' });
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains', display: 'swap' });

export const metadata: Metadata = {
  title: {
    default: 'Chuo Connect Kenya — University Intelligence Platform',
    template: '%s | Chuo Connect Kenya',
  },
  description:
    'Kenya\'s most comprehensive platform for discovering, comparing, and applying to universities. Find the right university, calculate your KUCCPS score, and explore over 100+ degree programmes.',
  keywords: ['Kenya universities', 'KUCCPS', 'university admissions Kenya', 'degree programmes Kenya'],
};

import { createClient } from '@/lib/supabase/server';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} ${instrument.variable} ${jetbrains.variable}`}>
        <Navbar user={user} />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
