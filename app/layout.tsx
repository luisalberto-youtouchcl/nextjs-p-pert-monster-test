import type { Metadata } from "next";
import "@/styles/globals.css";
import { teko, geistMono, geistSans } from "@/styles/fonts";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Monster Energy - Raspa y gana con Monster",
  description: "Monster Energy - Raspa y gana con Monster",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://challenges.cloudflare.com" />

        <script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js"
          async
          defer
        ></script>
      </head>
      <body
        className={`${teko.variable} ${geistMono.variable} ${geistSans.variable} antialiased`}
      >
        <Toaster position="top-center" duration={3000} richColors />
        {children}
      </body>
    </html>
  );
}
