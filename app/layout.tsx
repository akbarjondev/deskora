import '@/assets/globals.css';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/charts/styles.css';

import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import { Providers } from '@/components/providers/Providers';
import { Notifications } from '@mantine/notifications';

export const metadata = {
  title: 'Deskora'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uz">
      <head>
        {/* Only enable React scanner in Development mode */}
        {process.env.NODE_ENV === 'development' && (
          <script
            src="https://unpkg.com/react-scan/dist/auto.global.js"
            async
          />
        )}
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
