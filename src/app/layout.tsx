import type { Metadata } from "next";
import "./globals.css";
import Navigation from "./components/navigation";
import { Toaster } from "react-hot-toast";

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
      <body className="mx-8 mt-8 min-h-screen bg-blue-100 text-gray-900 lg:mx-40">
        <Navigation />
        <Toaster position="top-right" />
        <main id="main">{children}</main>
      </body>
    </html>
  );
}
