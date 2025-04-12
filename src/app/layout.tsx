import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Providers from './components/Providers'; // ✅ 클라이언트 컴포넌트
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'HC',
  description: 'HC 서비스',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
