import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "@/components/layout/ClientLayout";

export const metadata: Metadata = {
  title: "Utilitop - Developer Tools in Your Browser",
  description:
    "A collection of developer tools that run entirely in your browser. No data is sent to any server.",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (theme === 'dark' || (!theme && prefersDark)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch(e) {}
              })();
              document.addEventListener('keydown', function(e) {
                if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                  e.preventDefault();
                  window.dispatchEvent(new CustomEvent('open-search'));
                }
              });
            `,
          }}
        />
      </head>
      <body className="antialiased">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
