import Image from "next/image";

export const metadata = {
  title: "ثورة الذكاء الاصطناعي في القطاع الطبي — كيف سيغيّر علاج المرضى؟",
  description:
    "تقرير شامل حول أهم ابتكارات الذكاء الاصطناعي في الطب، التشخيص، الروبوتات الجراحية، وتحليل البيانات الصحية.",
};

export default function AIHealthcare2025() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-10 leading-relaxed" dir="rtl">
      <h1 className="text-3xl font-bold text-blue-700 mb-4">
        ثورة الذكاء الاصطناعي في القطاع الطبي: مستقبل العلاج والتشخيص
      </h1>

      <p className="text-gray-500 mb-6">تاريخ النشر: 2025-02-02</p>

      <Image
        src="/images/ai-health.jpg"
        width={1200}
        height={700}
        alt="الذكاء الاصطناعي والطب"
        className="rounded-xl shadow-lg mb-8"
      />

      <p className="mb-6">
        يتطور الطب بوتيرة سريعة بفضل الذكاء الاصطناعي، الذي أصبح قادرًا 
        على تحليل الصور الطبية بدقة أكبر من الأطباء في بعض الحالات، 
        بالإضافة إلى تسريع التشخيص وتقليل الأخطاء الطبية.
      </p>

      <h2 className="text-2xl font-semibold text-blue-700 mb-3">تشخيص أسرع وأكثر دقة</h2>
      <p className="mb-4">
        تعتمد المستشفيات الحديثة على أنظمة تحليل تعتمد على الشبكات العصبية 
        لتحديد الأمراض في وقت مبكر، خاصة السرطان وأمراض القلب.
      </p>

      <h2 className="text-2xl font-semibold text-blue-700 mb-3">روبوتات جراحية</h2>
      <p className="mb-4">
        الروبوتات الجراحية أصبحت تساعد الأطباء في العمليات الدقيقة، 
        مما يقلل من الأخطاء ويُحسّن نسب النجاح.
      </p>

      <p className="mt-10 text-gray-600">
        © {new Date().getFullYear()} جميع الحقوق محفوظة – Dahdouh AI
      </p>
    </main>
  );
}