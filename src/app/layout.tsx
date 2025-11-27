import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProviders } from "@/utils/theme-providers";
import ThemeCycle from "./theme-cycle"; 
// ⭐ NEW IMPORT: Import the client wrapper component
import SessionWrapper from "./components/SessionWrapper"; 

const OutfitFont = Outfit({
// ... (rest of your font configuration)
  subsets: ["latin"],
  weight: [
    "100",
    "200",
    "300",
    "400",
    "500",
    "600",
    "700",
    "800",
    "900",
  ],
});

export const metadata: Metadata = {
// ... (rest of your metadata)
  metadataBase: new URL("https://dahdouhai.com"),
  title: "Dahdouh AI",
  description:
    "Dahdouh AI — Your smart assistant for chatting, generating images, analyzing data, and more.",
  // ...
};

export const viewport: Viewport = {
// ... (rest of your viewport)
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* ⭐ KaTeX for math rendering */}
        <link  
          rel="stylesheet"  
          href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css"  
          integrity="sha384-vZTG03mQm1g8rj2jQ35ap5qOQHcB+BeIV/pY5Pja/qvp5AYA9Yg3gFyv1IyrL1wc"  
          crossOrigin="anonymous"  
        />
      </head>

      <body  
        className={`${OutfitFont.className}   
          h-screen w-full   
          overflow-hidden   
          bg-white dark:bg-[#0d0d12]   
          text-black dark:text-white   
          antialiased  
          scroll-smooth`}  
      >  
        {/* ⭐ VisionOS dynamic animated background */}  
        <ThemeCycle />  

        {/* 🔑 FIX: Wrap your entire application content with the SessionWrapper */}
        <SessionWrapper>
            {/* ⭐ All providers + children */}  
            <ThemeProviders>{children}</ThemeProviders>
        </SessionWrapper>
      </body>  
    </html>
  );
}
