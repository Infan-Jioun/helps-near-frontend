import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Helps Near — Emergency Help Platform",
  description: "Connect with verified volunteers in your area during emergencies. Fast, reliable, and community-driven emergency response system.",
  keywords: ["emergency", "help", "volunteer", "Bangladesh", "crisis"],
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-gray-900">
        <Toaster />
        {children}
      </body>
    </html>
  );
}