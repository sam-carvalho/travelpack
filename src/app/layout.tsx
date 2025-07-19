import type { Metadata } from "next";
import "./globals.css";
import Navigation from "./components/navigation";
import { Toaster } from "react-hot-toast";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: "TravelPack",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="mx-8 mt-8 min-h-screen overflow-visible bg-blue-100 text-gray-900 lg:mx-70">
        <Navigation />
        <Toaster position="top-right" />
        <main id="main">{children}</main>
        <SpeedInsights />
      </body>
    </html>
  );
}
