import Image from "next/image";

export const metadata = {
  title: "كيف يغيّر الذكاء الاصطناعي الاقتصاد العالمي؟",
  description:
    "تحليل شامل حول تأثير الذكاء الاصطناعي في الأسواق العالمية، الإنتاج، التجارة، والوظائف.",
};

export default function AIGlobalEconomyPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py=10 leading-relaxed" dir="rtl">
      <h1 className="text-3xl font-bold text-blue-700 mb-4">
        كيف يغيّر الذكاء الاصطناعي الاقتصاد العالمي؟
      </h1>

      <p className="text-gray-500 mb-6">تاريخ النشر: 2025-02-04</p>

      <Image
        src="/images/ai-economy.jpg"
        width={1200}
        height={700}
        alt="الاقتصاد والذكاء الاصطناعي"
        className="rounded-xl shadow-lg mb-8"
      />

      <p className="mb-6">
        تشير الدراسات الاقتصادية إلى أن الذكاء الاصطناعي سيضيف أكثر من 15 تريليون دولار 
        إلى الاقتصاد العالمي بحلول عام 2030، نتيجة تحسين الإنتاجية وتقليل التكلفة.
      </p>

      <h2 className="text-2xl font-semibold text-blue-700 mb-3">
        صناعة جديدة بالكامل
      </h2>
      <p className="mb-4">
        بدأت الشركات تبني مصانع تعتمد بالكامل على الروبوتات والأنظمة الذكية، 
        مما يرفع جودة الإنتاج ويقلل الأخطاء البشرية.
      </p>

      <h2 className="text-2xl font-semibold text-blue-700 mb-3">
        أسواق ستتأثر
      </h2>
      <p className="mb-4">
        تشمل النقل، التصنيع، التمويل، وحتى الإعلام الرقمي.
      </p>

      <p className="mt-10 text-gray-600">
        © {new Date().getFullYear()} جميع الحقوق محفوظة – Dahdouh AI
      </p>
    </main>
  );
}