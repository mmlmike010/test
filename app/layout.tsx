import type { Metadata } from "next";
import { Great_Vibes } from "next/font/google";
import "./globals.css";

const kirkland = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-kirkland",
});

export const metadata: Metadata = {
  title: "Costco Same-Day | Ask Kirk",
  description:
    "Costco Same-Day delivery powered by Instacart with Ask Kirk shopping assistant",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${kirkland.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
