import { NextResponse } from "next/server";

// Example articles (replace with DB or real posts)
const posts = [
  {
    title: "AI News Today – Dahdouh AI",
    link: "https://dahdouhai.live/news/ai-news-today",
    description: "Latest updates in AI and technology from Dahdouh AI.",
    pubDate: new Date().toUTCString(),
    guid: "ai-news-today",
  },
];

function generateRSS(posts: any[]) {
  const items = posts
    .map(
      (post) => `
      <item>
        <title><![CDATA[${post.title}]]></title>
        <link>${post.link}</link>
        <description><![CDATA[${post.description}]]></description>
        <pubDate>${post.pubDate}</pubDate>
        <guid>${post.guid}</guid>
      </item>
    `
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0">
    <channel>
      <title>Dahdouh AI News</title>
      <link>https://dahdouhai.live</link>
      <description>Latest technology & AI news from Dahdouh AI</description>
      ${items}
    </channel>
  </rss>`;
}

export async function GET() {
  const xml = generateRSS(posts);
  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}