import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://chuoconnectkenya.vercel.app'),
  title: {
    default: 'Chuo Connect Kenya · University Intelligence Platform',
    template: '%s | Chuo Connect Kenya',
  },
  description:
    'Kenya\'s most comprehensive platform for discovering, comparing, and applying to universities. Find the right university, calculate your KUCCPS score, and explore over 100+ degree programmes.',
  keywords: ['Kenya universities', 'KUCCPS', 'university admissions Kenya', 'degree programmes Kenya'],
};

import { createClient } from '@/lib/supabase/server';

import { ThemeProvider } from '@/components/ThemeProvider';
import { NavigationProgress } from '@/components/ui/navigation-progress';
import { ScrollRevealObserver } from '@/components/ui/scroll-reveal-observer';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <NavigationProgress />
          <ScrollRevealObserver />
          <Navbar user={user} />
          <main>{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
