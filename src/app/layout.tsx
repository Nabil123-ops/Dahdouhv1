import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProviders } from "@/utils/theme-providers";
import ThemeCycle from "./theme-cycle"; // ⭐ NEW - Auto background animation
// 🔑 Import the SessionWrapper component
import SessionWrapper from "@/components/SessionWrapper";

const OutfitFont = Outfit({
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
metadataBase: new URL("https://dahdouhai.com"),
title: "Dahdouh AI",
description:
"Dahdouh AI — Your smart assistant for chatting, generating images, analyzing data, and more.",
keywords: [
"Dahdouh AI",
"AI assistant",
"Chatbot",
"Image generator",
"Next.js AI",
"AI tools",
],
authors: [{ name: "Dahdouh AI" }],
creator: "Dahdouh AI",
publisher: "Dahdouh AI",

openGraph: {
title: "Dahdouh AI",
description:
"Experience the power of Dahdouh AI — intelligent assistant for chat, images, study, and more.",
url: "https://dahdouhai.com",
siteName: "Dahdouh AI",
images: [
{
url: "/assets/dahdouh-banner.png",
width: 1200,
height: 630,
},
],
locale: "en_US",
type: "website",
},

twitter: {
card: "summary_large_image",
title: "Dahdouh AI",
description: "Your AI companion for creativity and productivity.",
images: ["/assets/dahdouh-banner.png"],
},
};

export const viewport: Viewport = {
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

    {/* 🔑 SessionWrapper wraps everything that needs session data */}
    <SessionWrapper>
        {/* ⭐ All providers + children */}  
        <ThemeProviders>{children}</ThemeProviders>  
    </SessionWrapper>
  </body>  
</html>

);
}
