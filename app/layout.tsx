import type { Metadata } from 'next';
import { ProviderWrapper } from './providers/providers';

export const metadata: Metadata = {
  title: 'My App - FSD',
  description: 'Next.js + Mantine UI + Zustand + FSD',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>
        <ProviderWrapper>{children}</ProviderWrapper>
      </body>
    </html>
  );
}