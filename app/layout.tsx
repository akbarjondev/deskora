import './globals.css';
import '@mantine/core/styles.css';

import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import { Providers } from 'app/(components)/Providers';

export const metadata = {
  title: 'Ish stoli | Mebel'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uz">
      <head>
        <ColorSchemeScript />
      </head>
      <body className="flex min-h-screen w-full flex-col">
        <Providers>
          <MantineProvider>{children}</MantineProvider>
        </Providers>
      </body>
    </html>
  );
}
