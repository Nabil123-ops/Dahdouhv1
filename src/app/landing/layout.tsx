import "./landing.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dahdouh AI — Smart AI Assistant for Arabic & English",
  description:
    "Chat, generate images, solve math, and explore AI tools in Arabic and English. Built by a 15-year-old Lebanese developer.",
  keywords: [
    "Dahdouh AI",
    "AI Arabic",
    "Arabic chatbot",
    "AI image generator",
    "Lebanon AI",
    "Nabil Dahdouh",
    "Math solver AI",
  ],
  openGraph: {
    title: "Dahdouh AI",
    description:
      "AI assistant for chatting, creating images, solving math, and more — built by a young Lebanese developer.",
    url: "https://dahdouhai.live/landing",
    siteName: "Dahdouh AI",
    images: [
      {
        url: "/landing/preview.png",
        width: 1200,
        height: 630,
        alt: "Dahdouh AI Landing Page",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Arabic & English fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700&family=Inter:wght@300;400;600;700&display=swap"
          rel="stylesheet"
        />

        {/* Smooth scroll */}
        <style>{`
          html {
            scroll-behavior: smooth;
          }
        `}</style>

        {/* Google Schema JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "Dahdouh AI",
              applicationCategory: "Artificial Intelligence",
              operatingSystem: "Web",
              url: "https://dahdouhai.live",
              description:
                "AI chatbot and creative suite built by a 15-year-old Lebanese developer.",
              author: {
                "@type": "Person",
                name: "Nabil Dahdouh",
              },
              offers: {
                "@type": "Offer",
                price: "3.75",
                priceCurrency: "USD",
              },
            }),
          }}
        />
      </head>
      <body className="font-inter">
        {children}
      </body>
    </html>
  );
}