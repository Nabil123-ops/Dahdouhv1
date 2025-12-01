import Image from "next/image";

export const metadata = {
  title: "تطورات الذكاء الاصطناعي في الشرق الأوسط | Dahdouh AI",
  description:
    "تحليل شامل لأبرز التطورات والابتكارات التقنية في الشرق الأوسط خلال عام 2025.",
};

export default function AIMiddleEastPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-10 leading-relaxed" dir="rtl">
      <h1 className="text-3xl font-bold text-blue-700 mb-4">
        تطورات الذكاء الاصطناعي في الشرق الأوسط
      </h1>

      <p className="text-gray-500 mb-6">تاريخ النشر: 2025-01-10</p>

      <Image
        src="https://dahdouhai.live/images/ai-middle-east.jpeg"
        width={1200}
        height={700}
        alt="الذكاء الاصطناعي في الشرق الأوسط"
        className="rounded-xl shadow-lg mb-8"
      />

      <p className="mb-4">
        يشهد الشرق الأوسط نموًا غير مسبوق في تبنّي تقنيات الذكاء الاصطناعي،
        حيث تعمل عدة دول على تطوير استراتيجيات وطنية لتعزيز الابتكار والتحول
        الرقمي.
      </p>

      <h2 className="text-2xl font-semibold text-blue-700 mt-6 mb-3">
        السعودية في الصدارة
      </h2>
      <p className="mb-4">
        تقود المملكة العربية السعودية المنطقة باستثمارات ضخمة في مجال الذكاء
        الاصطناعي، خصوصًا ضمن مشاريع رؤية 2030.
      </p>

      <h2 className="text-2xl font-semibold text-blue-700 mt-6 mb-3">
        الإمارات مركز عالمي للابتكار
      </h2>
      <p className="mb-4">
        أصبحت الإمارات مركزًا عالميًا لاختبار تقنيات الذكاء الاصطناعي بفضل
        مبادرات حكومية قوية ووجود شركات عالمية كبرى.
      </p>

      <p className="mt-10 text-gray-600">
        © {new Date().getFullYear()} جميع الحقوق محفوظة – Dahdouh AI
      </p>
    </main>
  );
}