import Script from 'next/script';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        
        {/* Optimized Next.js Integration */}
        <Script
          src="https://cdn.scout.io/widget.iife.js"
          strategy="afterInteractive"
          data-client-id={process.env.NEXT_PUBLIC_SCOUT_CLIENT_ID}
          data-base-url={process.env.NEXT_PUBLIC_SCOUT_API_URL}
        />
      </body>
    </html>
  );
}
