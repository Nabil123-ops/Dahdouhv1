import Image from "next/image";

export const metadata = {
  title: "مستقبل الذكاء الاصطناعي في التعليم | Dahdouh AI",
  description:
    "تحليل شامل لتأثير الذكاء الاصطناعي على مستقبل التعليم، طرق التدريس، وتجربة الطلاب.",
};

export default function AIFutureEducation() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-10 leading-relaxed" dir="rtl">

      <h1 className="text-3xl font-bold text-blue-700 mb-4">
        مستقبل الذكاء الاصطناعي في التعليم
      </h1>

      <p className="text-gray-500 mb-6">تاريخ النشر: 2025-01-20</p>

      <Image
        src="/images/ai-education.jpg"
        width={1200}
        height={700}
        alt="الذكاء الاصطناعي في التعليم"
        className="rounded-xl shadow-lg mb-8"
      />

      <p className="mb-4">
        يشهد قطاع التعليم تحولًا رقميًا هائلًا بفضل الذكاء الاصطناعي، حيث بدأت
        المدارس والجامعات تعتمد تقنيات تعليمية ذكية تساعد الطلاب على التعلّم بشكل
        أسرع وأكثر فعالية.
      </p>

      <p className="mb-4">
        من أبرز التقنيات التي بدأت تنتشر: أنظمة التعلّم التكيفي، المساعدات
        الذكية، منصات التحليل الأكاديمي، وتطبيقات الترجمة الفورية.
      </p>

      <p className="mt-10 text-gray-600">
        © {new Date().getFullYear()} جميع الحقوق محفوظة – Dahdouh AI
      </p>

    </main>
  );
}