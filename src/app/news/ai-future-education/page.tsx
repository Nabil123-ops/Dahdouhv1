import Image from "next/image";

export const metadata = {
  title: "مستقبل الذكاء الاصطناعي في التعليم — كيف سيتغير التعلم في السنوات القادمة؟",
  description:
    "تحليل عميق حول تأثير الذكاء الاصطناعي على التعليم، المناهج، الأساتذة، والطلاب خلال السنوات القادمة.",
};

export default function AIEducationFuturePage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-10 leading-relaxed" dir="rtl">
      <h1 className="text-3xl font-bold text-blue-700 mb-4">
        مستقبل الذكاء الاصطناعي في التعليم: كيف سيغيّر التعلّم خلال السنوات القادمة؟
      </h1>

      <p className="text-gray-500 mb-6">تاريخ النشر: 2025-02-01</p>

      <Image
        src="/images/ai-education.jpg"
        width={1200}
        height={700}
        alt="الذكاء الاصطناعي والتعليم"
        className="rounded-xl shadow-lg mb-8"
      />

      <p className="mb-6">
        يشهد قطاع التعليم تحوّلًا جذريًا بفضل التطور السريع في تقنيات الذكاء الاصطناعي، 
        حيث بدأت المدارس والجامعات حول العالم باعتماد أدوات ذكية تهدف إلى تحسين جودة التعلّم 
        وتوفير تجارب تعليمية تفاعلية.
      </p>

      <h2 className="text-2xl font-semibold text-blue-700 mb-3">تعليم شخصي لكل طالب</h2>
      <p className="mb-4">
        من أبرز فوائد الذكاء الاصطناعي في التعليم هي القدرة على تقديم تجربة تعليمية مصممة 
        وفق احتياجات الطالب، حيث يستطيع النظام تحليل مستوى الطالب وتقديم محتوى مناسب له.
      </p>

      <h2 className="text-2xl font-semibold text-blue-700 mb-3">مدرّسون افتراضيون</h2>
      <p className="mb-4">
        من المتوقع أن يصبح للطلاب إمكانية استخدام روبوتات تعليمية مدعومة بالذكاء الاصطناعي 
        تعمل كمدرّس مساعد قادرة على شرح الدروس على مدار الساعة.
      </p>

      <p className="mt-10 text-gray-600">
        © {new Date().getFullYear()} جميع الحقوق محفوظة – Dahdouh AI
      </p>
    </main>
  );
}