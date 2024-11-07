import '@/assets/globals.css';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import { Providers } from '@/components/providers/Providers';
import { Notifications } from '@mantine/notifications';

export const metadata = {
  title: 'Yordamchi | Mebel'
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
          <MantineProvider>
            <Notifications position="top-right" limit={3} />
            {children}
          </MantineProvider>
        </Providers>
      </body>
    </html>
  );
}
