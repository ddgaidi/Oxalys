import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/lib/context/ThemeContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Oxalys – La plateforme des makers français",
  description:
    "Oxalys connecte les makers, étudiants et professionnels aux meilleurs espaces de fabrication numérique en France.",
  keywords: ["FabLab", "maker", "fabrication numérique", "impression 3D", "découpe laser"],
  openGraph: {
    title: "Oxalys",
    description: "Trouve ton FabLab idéal. Créez ensemble.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <Navbar />
          <main className="min-h-screen pt-16">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
