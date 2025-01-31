import type { Metadata } from "next";
import "./globals.css";
import { inter } from "@/app/ui/fonts";

export const metadata: Metadata = {
  title: "Sozan Study Support",
  description: "create by 岡山県立岡山操山中学校"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
