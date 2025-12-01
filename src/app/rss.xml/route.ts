import { NextResponse } from "next/server";

// Example posts (replace with your real news later)
const posts = [
  {
    title: "Welcome to Dahdouh AI News",
    link: "https://dahdouhai.live",
    description: "Latest technology and AI updates from Dahdouh AI.",
    pubDate: new Date().toUTCString(),
    guid: "dahdouhai-news-1",
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

  return `<?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0">
    <channel>
      <title><![CDATA[Dahdouh AI News]]></title>
      <link>https://dahdouhai.live</link>
      <description><![CDATA[Latest technology & AI news from Dahdouh AI]]></description>
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