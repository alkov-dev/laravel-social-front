import type { Metadata } from 'next';
import { ProviderWrapper } from './providers/providers';
import { ColorSchemeScript } from '@mantine/core';

export const metadata: Metadata = {
  title: 'Social Network',
  description: 'Социальная сеть с постами',
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <ColorSchemeScript defaultColorScheme='light' />
      </head>
      <body>
        <ProviderWrapper>{children}</ProviderWrapper>
      </body>
    </html>
  );
}