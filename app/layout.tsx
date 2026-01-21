// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

import { Geist, Geist_Mono } from "next/font/google";
import { Francois_One, Inter, Poppins } from "next/font/google";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const francois = Francois_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-francois",
});
const inter = Inter({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-inter",
});
const poppins = Poppins({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Telangana Dental Council",
  description: "Official website of the Telangana Dental Council",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${francois.variable} ${inter.variable} ${poppins.variable}`}
    >
      <body className="font-poppins antialiased text-gray-900 min-h-screen">
        {children}
      </body>
    </html>
  );
}
