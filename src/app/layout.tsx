import type { Metadata } from "next";
import "./globals.css";
import Navigation from "./components/navigation";

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
      <body className="min-h-screen bg-blue-50 text-gray-900 mt-8 mx-8 xl:mx-50">
        <Navigation />
        <main>{children}</main>
      </body>
    </html>
  );
}
