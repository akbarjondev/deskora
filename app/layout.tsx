import './globals.css';

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
      <body className="flex min-h-screen w-full flex-col">{children}</body>
    </html>
  );
}
