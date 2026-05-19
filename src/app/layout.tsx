import type { Metadata } from "next";
import { Bebas_Neue, Space_Grotesk } from "next/font/google";
import { AuthSessionProvider } from "@/components/providers/auth-session-provider";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const titleFont = Bebas_Neue({
  variable: "--font-title",
  weight: "400",
  subsets: ["latin"],
});

const bodyFont = Space_Grotesk({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Champions Hub",
  description: "Informacion, equipos, partidos y clasificacion de Champions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${titleFont.variable} ${bodyFont.variable} h-full`}>
      <body className="min-h-full bg-brand-bg text-brand-text">
        <AuthSessionProvider>
          <div className="page-background" />
          <div className="relative flex min-h-full flex-col">
            <SiteHeader />
            <div className="flex flex-1 flex-col">{children}</div>
          </div>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
