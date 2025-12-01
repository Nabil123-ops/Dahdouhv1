import Image from "next/image";

export const metadata = {
  title: "أثر الذكاء الاصطناعي على الوظائف — هل سيأخذ الروبوت مكان الإنسان؟",
  description:
    "دراسة واسعة حول مستقبل الوظائف وتأثير الذكاء الاصطناعي على سوق العمل العالمي.",
};

export default function AIJobsImpactPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-10 leading-relaxed" dir="rtl">
      <h1 className="text-3xl font-bold text-blue-700 mb-4">
        أثر الذكاء الاصطناعي على الوظائف: هل سيأخذ الروبوت مكان الإنسان؟
      </h1>

      <p className="text-gray-500 mb-6">تاريخ النشر: 2025-02-03</p>

      <Image
        src="/images/ai-jobs.jpg"
        width={1200}
        height={700}
        alt="الروبوتات والوظائف"
        className="rounded-xl shadow-lg mb-8"
      />

      <p className="mb-6">
        يثير الذكاء الاصطناعي جدلًا واسعًا حول مستقبل الوظائف، 
        حيث تشير التقارير إلى احتمال اختفاء ملايين الوظائف الروتينية 
        في مقابل ظهور وظائف جديدة تتطلب مهارات تقنية.
      </p>

      <h2 className="text-2xl font-semibold text-blue-700 mb-3">
        وظائف ستختفي في المستقبل
      </h2>
      <p className="mb-4">
        تشمل الوظائف الإدارية الروتينية، مراكز الاتصالات، 
        وبعض الأعمال الكتابية التي يمكن أتمتتها بالكامل.
      </p>

      <h2 className="text-2xl font-semibold text-blue-700 mb-3">
        وظائف جديدة ستظهر
      </h2>
      <p className="mb-4">
        مثل مهندسي الذكاء الاصطناعي، مطوري الروبوتات، 
        و محللي البيانات الضخمة.
      </p>

      <p className="mt-10 text-gray-600">
        © {new Date().getFullYear()} جميع الحقوق محفوظة – Dahdouh AI
      </p>
    </main>
  );
}