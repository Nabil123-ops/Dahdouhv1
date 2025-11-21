import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProviders } from "@/utils/theme-providers";

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
  title: "Dahdouh AI",
  description:
    "Dahdouh AI — Your smart assistant for chatting, generating images, analyzing data, and more. Fast, powerful, and built with Next.js.",
  keywords: [
    "Dahdouh AI",
    "AI assistant",
    "Chatbot",
    "image generator",
    "Next.js AI",
    "AI tools",
  ],
  authors: [{ name: "Dahdouh AI" }],
  creator: "Dahdouh AI",
  publisher: "Dahdouh AI",

  openGraph: {
    title: "Dahdouh AI",
    description:
      "Experience the power of Dahdouh AI — an intelligent assistant for chat, images, analysis, study help, and more.",
    url: "https://dahdouhai.com",
    siteName: "Dahdouh AI",
    images: [
      {
        url: "/assets/dahdouh-banner.png", // <— Update to your real banner
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
    description:
      "Your intelligent AI companion for creativity, productivity, and learning.",
    creator: "@dahdouhai", // change or remove if needed
    images: ["/assets/dahdouh-banner.png"],
  },

  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${OutfitFont.className} dark:bg-[#131314] h-dvh w-full overflow-hidden bg-white text-black dark:text-white`}
      >
        <ThemeProviders>{children}</ThemeProviders>
      </body>
    </html>
  );
}