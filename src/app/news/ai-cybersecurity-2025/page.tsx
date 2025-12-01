import Image from "next/image";

export const metadata = {
  title: "الذكاء الاصطناعي والأمن السيبراني — بين الحماية والتهديد",
  description:
    "مقال كبير يشرح كيف يستخدم الذكاء الاصطناعي في الأمن السيبراني، وكيف يمكن أن يشكل تهديدًا في نفس الوقت.",
};

export default function AICybersecurity2025Page() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-10 leading-relaxed" dir="rtl">
      <h1 className="text-3xl font-bold text-blue-700 mb-4">
        الذكاء الاصطناعي والأمن السيبراني: بين الحماية والتهديد
      </h1>

      <p className="text-gray-500 mb-6">تاريخ النشر: 2025-02-05</p>

      <Image
        src="/images/ai-cyber.jpg"
        width={1200}
        height={700}
        alt="الأمن السيبراني والذكاء الاصطناعي"
        className="rounded-xl shadow-lg mb-8"
      />

      <p className="mb-6">
        يلعب الذكاء الاصطناعي دورًا رئيسيًا في حماية الأنظمة الرقمية، 
        لكنه في الوقت نفسه أصبح أداة خطيرة بيد القراصنة القادرين 
        على تطوير هجمات أكثر تعقيدًا.
      </p>

      <h2 className="text-2xl font-semibold text-blue-700 mb-3">
        تعزيز أنظمة الدفاع
      </h2>
      <p className="mb-4">
        تعتمد الشركات العالمية على خوارزميات الذكاء الاصطناعي لمراقبة 
        الشبكات، اكتشاف الهجمات، ومنع الاختراقات قبل حدوثها.
      </p>

      <h2 className="text-2xl font-semibold text-blue-700 mb-3">
        تهديدات جديدة
      </h2>
      <p className="mb-4">
        مع تطور الذكاء الاصطناعي، يستطيع المخترقون إنشاء برمجيات 
        خبيثة تتعلم وتهاجم بشكل ذاتي دون تدخل بشري.
      </p>

      <p className="mt-10 text-gray-600">
        © {new Date().getFullYear()} جميع الحقوق محفوظة – Dahdouh AI
      </p>
    </main>
  );
}