import { Provider } from "@/components/ui/provider";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LeftSidebar from "@/components/ui/LeftSidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "謎解きアシストツール",
  description: "謎解きアシストツール",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const colorMode = useColorMode();
  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        {/* <link rel="icon" href="/favicon.ico" type="image/x-icon"></link> */}
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <Provider>
          <header />

          <div style={{ display: "flex" }}>
            <LeftSidebar />
            <main style={{ flex: 1 }}>{children}</main>
          </div>
        </Provider>
      </body>
    </html>
  );
}
