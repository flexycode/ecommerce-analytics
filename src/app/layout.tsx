import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "E-commerce Analytics Dashboard",
  description: "Real-time analytics platform with AI-powered sales predictions and inventory management",
  keywords: ["analytics", "e-commerce", "dashboard", "AI predictions", "inventory"],
  authors: [{ name: "E-commerce Analytics Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.variable} antialiased`}>
        <div className="min-h-screen bg-[hsl(var(--background))]">
          {children}
        </div>
      </body>
    </html>
  );
}
