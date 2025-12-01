import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "آخر أخبار الذكاء الاصطناعي والتكنولوجيا | Dahdouh AI",
  description:
    "تابع آخر أخبار التكنولوجيا، الذكاء الاصطناعي، التطبيقات، والابتكار عبر منصة Dahdouh AI.",
  alternates: {
    canonical: "https://dahdouhai.live/news",
  },
};

export default function NewsIndexPage() {
  const news = [
    {
      title: "أفضل أدوات الذكاء الاصطناعي لعام 2025",
      slug: "best-ai-tools",
      description:
        "تعرف على أقوى أدوات الذكاء الاصطناعي التي تُستخدم هذا العام في إنشاء المحتوى والتصميم والإنتاجية.",
      image: "https://dahdouhai.live/images/ai-tools-cover.jpg",
      date: "2025-01-15",
    },
    {
      title: "تطورات الذكاء الاصطناعي في الشرق الأوسط",
      slug: "ai-middle-east",
      description:
        "تحليل شامل لأبرز التطورات والابتكارات التقنية في الدول العربية خلال عام 2025.",
      image: "https://dahdouhai.live/images/ai-middle-east.jpg",
      date: "2025-01-10",
    },
    {
      title: "أفضل تطبيقات الذكاء الاصطناعي للطلاب",
      slug: "best-ai-apps-students",
      description:
        "قائمة بالتطبيقات الذكية التي تساعد الطلاب في الدراسة وتنظيم الوقت وحل الواجبات باستخدام AI.",
      image: "https://dahdouhai.live/images/ai-students.jpg",
      date: "2025-01-05",
    },

    // ✅ NEW ARTICLES ADDED BELOW

    {
      title: "مستقبل الذكاء الاصطناعي في التعليم",
      slug: "ai-education-future",
      description:
        "كيف يساهم الذكاء الاصطناعي في تطوير التعليم وتخصيص المناهج للطلاب؟",
      image: "https://dahdouhai.live/images/ai-education.jpg",
      date: "2025-02-01",
    },
    {
      title: "ثورة الذكاء الاصطناعي في القطاع الطبي",
      slug: "ai-healthcare-2025",
      description:
        "كيف يستخدم الذكاء الاصطناعي في التشخيص، العمليات الجراحية، وإدارة المستشفيات؟",
      image: "https://dahdouhai.live/images/ai-health.jpg",
      date: "2025-02-02",
    },
    {
      title: "أثر الذكاء الاصطناعي على الوظائف",
      slug: "ai-jobs-impact",
      description:
        "هل سيأخذ الروبوت مكان الإنسان؟ وما هي الوظائف التي ستختفي وتظهر؟",
      image: "https://dahdouhai.live/images/ai-jobs.jpg",
      date: "2025-02-03",
    },
    {
      title: "الذكاء الاصطناعي والاقتصاد العالمي",
      slug: "ai-global-economy",
      description:
        "كيف يغيّر الذكاء الاصطناعي شكل الأسواق والصناعات حول العالم؟",
      image: "https://dahdouhai.live/images/ai-economy.jpg",
      date: "2025-02-04",
    },
    {
      title: "الذكاء الاصطناعي والأمن السيبراني",
      slug: "ai-cybersecurity-2025",
      description:
        "بين الحماية والتهديد… كيف يؤثر الذكاء الاصطناعي على الأمن الرقمي؟",
      image: "https://dahdouhai.live/images/ai-cyber.jpg",
      date: "2025-02-05",
    },
  ];

  return (
    <main className="max-w-5xl mx-auto px-4 py-10" dir="rtl">
      <h1 className="text-3xl font-bold text-blue-700 mb-8">آخر الأخبار</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {news.map((item) => (
          <Link
            key={item.slug}
            href={`/news/${item.slug}`}
            className="block bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
          >
            <div className="relative w-full h-56">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover"
              />
            </div>

            <div className="p-5">
              <h2 className="text-xl font-semibold text-blue-700 mb-2">
                {item.title}
              </h2>

              <p className="text-gray-600 text-sm mb-3">
                {item.description}
              </p>

              <p className="text-gray-400 text-xs">{item.date}</p>
            </div>
          </Link>
        ))}
      </div>

      <p className="mt-12 text-center text-gray-500">
        © {new Date().getFullYear()} جميع الحقوق محفوظة – Dahdouh AI
      </p>
    </main>
  );
}