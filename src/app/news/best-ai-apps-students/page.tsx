import Image from "next/image";

export const metadata = {
  title: "أفضل تطبيقات الذكاء الاصطناعي للطلاب | Dahdouh AI",
  description:
    "قائمة بأفضل تطبيقات الذكاء الاصطناعي التي تساعد الطلاب في الدراسة، تنظيم المهام، وإنجاز الواجبات.",
};

export default function BestAIAppsStudentsPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-10 leading-relaxed" dir="rtl">
      <h1 className="text-3xl font-bold text-blue-700 mb-4">
        أفضل تطبيقات الذكاء الاصطناعي للطلاب
      </h1>

      <p className="text-gray-500 mb-6">تاريخ النشر: 2025-01-05</p>

      <Image
        src="https://dahdouhai.live/images/ai-students.jpg"
        width={1200}
        height={700}
        alt="تطبيقات الذكاء الاصطناعي للطلاب"
        className="rounded-xl shadow-lg mb-8"
      />

      <p className="mb-4">
        أصبح الذكاء الاصطناعي جزءًا لا يتجزأ من الدراسة الحديثة، حيث يساعد الطلاب
        في إنجاز الواجبات، البحث العلمي، وتطوير المهارات.
      </p>

      <h2 className="text-2xl font-semibold text-blue-700 mt-6 mb-3">
        1. Notion AI – الأفضل لتنظيم الدراسة
      </h2>
      <p className="mb-4">
        يقدم Notion AI أدوات ذكية تساعد في كتابة الملخصات، تنظيم الوقت، وتصميم
        خطط دراسية فعّالة.
      </p>

      <h2 className="text-2xl font-semibold text-blue-700 mt-6 mb-3">
        2. Quizlet AI – للمذاكرة الذكية
      </h2>
      <p className="mb-4">
        يساعد Quizlet الطلاب على إنشاء بطاقات تعليمية تفاعلية باستخدام الذكاء
        الاصطناعي.
      </p>

      <p className="mt-10 text-gray-600">
        © {new Date().getFullYear()} جميع الحقوق محفوظة – Dahdouh AI
      </p>
    </main>
  );
}