import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AR Sports Studio Pro',
  description: 'Professional Cricket Broadcast Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Oswald:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[var(--color-background)] text-[var(--color-text)] font-sans antialiased overflow-hidden h-screen">
        {children}
      </body>
    </html>
  );
}
