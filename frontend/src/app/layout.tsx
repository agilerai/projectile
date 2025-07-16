import type { Metadata } from "next";
import "./globals.css";
import { inter } from "@/lib/fonts";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Projectile"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link rel="icon" href="/logo.svg" />
        </head>
        <body className={`${inter.className} antialiased`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
