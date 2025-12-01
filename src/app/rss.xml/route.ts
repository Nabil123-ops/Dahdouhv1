import { NextResponse } from "next/server";

const posts = [
  {
    title: "أفضل أدوات الذكاء الاصطناعي لعام 2025",
    link: "https://dahdouhai.live/news/best-ai-tools",
    description:
      "تعرف على أقوى أدوات الذكاء الاصطناعي التي تُستخدم هذا العام في إنشاء المحتوى والتصميم والإنتاجية.",
    pubDate: "2025-01-15",
    guid: "best-ai-tools",
  },
  {
    title: "تطورات الذكاء الاصطناعي في الشرق الأوسط",
    link: "https://dahdouhai.live/news/ai-middle-east",
    description:
      "تحليل شامل لأبرز التطورات والابتكارات التقنية في الدول العربية خلال عام 2025.",
    pubDate: "2025-01-10",
    guid: "ai-middle-east",
  },
  {
    title: "أفضل تطبيقات الذكاء الاصطناعي للطلاب",
    link: "https://dahdouhai.live/news/best-ai-apps-students",
    description:
      "قائمة بالتطبيقات الذكية التي تساعد الطلاب في الدراسة وتنظيم الوقت وحل الواجبات باستخدام AI.",
    pubDate: "2025-01-05",
    guid: "best-ai-apps-students",
  },
  {
    title: "مستقبل الذكاء الاصطناعي في التعليم",
    link: "https://dahdouhai.live/news/ai-education-future",
    description:
      "كيف يساهم الذكاء الاصطناعي في تطوير التعليم وتخصيص المناهج للطلاب؟",
    pubDate: "2025-02-01",
    guid: "ai-education-future",
  },
  {
    title: "ثورة الذكاء الاصطناعي في القطاع الطبي",
    link: "https://dahdouhai.live/news/ai-healthcare-2025",
    description:
      "كيف يستخدم الذكاء الاصطناعي في التشخيص، العمليات الجراحية، وإدارة المستشفيات؟",
    pubDate: "2025-02-02",
    guid: "ai-healthcare-2025",
  },
  {
    title: "أثر الذكاء الاصطناعي على الوظائف",
    link: "https://dahdouhai.live/news/ai-jobs-impact",
    description:
      "هل سيأخذ الروبوت مكان الإنسان؟ وما هي الوظائف التي ستختفي وتظهر؟",
    pubDate: "2025-02-03",
    guid: "ai-jobs-impact",
  },
  {
    title: "الذكاء الاصطناعي والاقتصاد العالمي",
    link: "https://dahdouhai.live/news/ai-global-economy",
    description:
      "كيف يغيّر الذكاء الاصطناعي شكل الأسواق والصناعات حول العالم؟",
    pubDate: "2025-02-04",
    guid: "ai-global-economy",
  },
  {
    title: "الذكاء الاصطناعي والأمن السيبراني",
    link: "https://dahdouhai.live/news/ai-cybersecurity-2025",
    description:
      "بين الحماية والتهديد… كيف يؤثر الذكاء الاصطناعي على الأمن الرقمي؟",
    pubDate: "2025-02-05",
    guid: "ai-cybersecurity-2025",
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
          <pubDate>${new Date(post.pubDate).toUTCString()}</pubDate>
          <guid>${post.guid}</guid>
        </item>
      `
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0">
    <channel>
      <title><![CDATA[أخبار Dahdouh AI]]></title>
      <link>https://dahdouhai.live</link>
      <description><![CDATA[آخر أخبار التكنولوجيا والذكاء الاصطناعي من Dahdouh AI]]></description>
      ${items}
    </channel>
  </rss>`;
}

export async function GET() {
  const xml = generateRSS(posts);
  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "s-maxage=600",
    },
  });
}