import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Prepped Agent",
  description: "The autonomous clinical AI Agent that interviews patients, structures history, and prepares briefing documents.",
  openGraph: {
    title: "Prepped Agent",
    description: "The autonomous clinical AI Agent that interviews patients, structures history, and prepares briefing documents.",
    images: [
      {
        url: "https://prepped-agentic.vercel.app/cover.png",
        width: 1200,
        height: 630,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Prepped Agent",
    description: "The autonomous clinical AI Agent that interviews patients, structures history, and prepares briefing documents.",
    images: ["https://prepped-agentic.vercel.app/cover.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
