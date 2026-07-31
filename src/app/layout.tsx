import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

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
      <body>
        <Navbar user={user} />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
