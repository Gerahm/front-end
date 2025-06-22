import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { League_Spartan } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import {
  Sidebar,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import AppSidebar from '@/components/layout/AppSideBar';
import QueryProvider from '@/providers/query-provider';
import { Toaster } from '@/components/ui/toast';
import { ThemeProvider } from 'next-themes';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const leagueSpartan = League_Spartan({
  variable: '--font-league-spartan',
  subsets: ['latin'],
  weight: ['400', '700'],
});

export const metadata: Metadata = {
  title: 'Pet Lab Co.',
  description:
    'Pet Lab Co. is a pet care company that provides a variety of pet services.',
  icons: {
    icon: [
      {
        url: '/favicon.ico',
        sizes: 'any',
      },
      {
        url: '/favicon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${leagueSpartan.variable} antialiased overflow-hidden`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <Header />
            <SidebarProvider>
              <AppSidebar />
              <main className=" flex-1 gap-2">
                <SidebarTrigger className="md:hidden" />
                <div className="p-4 flex-1">{children}</div>
              </main>
            </SidebarProvider>
            <Toaster />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
