"use client";

import { useEffect, useState } from "react";

export default function LandingPage() {
  const [lang, setLang] = useState<"en" | "ar">("en");
  const [navOpen, setNavOpen] = useState(false);

  // Scroll reveal
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.2 }
    );

    document.querySelectorAll(".reveal").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const t = (en: string, ar: string) => (lang === "en" ? en : ar);

  return (
    <div className={`${lang === "ar" ? "rtl font-[Cairo]" : "font-inter"} bg-black text-white min-h-screen`}>
      
      {/* ---------------- NAVBAR ---------------- */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-black/50 backdrop-blur-xl border-b border-white/10">
        <div className={`max-w-7xl mx-auto flex items-center justify-between px-6 py-4 ${
          lang === "ar" ? "flex-row-reverse" : ""
        }`}>
          
          {/* Logo */}
          <a href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Dahdouh AI
          </a>

          {/* Desktop Links */}
          <div className={`hidden md:flex gap-8 text-gray-300 ${lang === "ar" ? "flex-row-reverse" : ""}`}>
            <a href="#features" className="hover:text-white">{t("Features", "الميزات")}</a>
            <a href="#pricing" className="hover:text-white">{t("Pricing", "الأسعار")}</a>
            <a href="#about" className="hover:text-white">{t("About", "عن المشروع")}</a>
          </div>

          {/* Language Switch */}
          <button
            onClick={() => setLang(lang === "en" ? "ar" : "en")}
            className="hidden md:flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full"
          >
            🌐 {lang === "en" ? "عربي" : "EN"}
          </button>

          {/* Mobile Menu */}
          <button className="md:hidden text-white text-2xl" onClick={() => setNavOpen(!navOpen)}>
            {navOpen ? "✖" : "☰"}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {navOpen && (
          <div className={`md:hidden flex flex-col bg-black/80 px-6 py-4 border-t border-white/10 ${
            lang === "ar" ? "text-right" : ""
          }`}>
            <a href="#features" className="py-2">{t("Features", "الميزات")}</a>
            <a href="#pricing" className="py-2">{t("Pricing", "الأسعار")}</a>
            <a href="#about" className="py-2">{t("About", "عن المشروع")}</a>

            <button
              onClick={() => setLang(lang === "en" ? "ar" : "en")}
              className="mt-3 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg"
            >
              🌐 {lang === "en" ? "عربي" : "EN"}
            </button>
          </div>
        )}
      </nav>

      {/* ---------------- HERO ---------------- */}
      <section className="relative h-[90vh] w-full flex items-center justify-center px-6 pt-20 text-center">

        {/* Video BG */}
        <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover opacity-40">
          <source src="/landing/bg.mp4" type="video/mp4" />
        </video>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60"></div>

        {/* Content */}
        <div className="relative z-10 max-w-3xl reveal">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            {t("Your AI Assistant for Everything", "مساعدك الذكي لكل شيء")}
          </h1>

          <p className="text-gray-300 text-lg md:text-xl mb-10">
            {t("Chat, create images, solve math — in English & Arabic", "تحدث، أنشئ الصور، حلّ المسائل — بالعربية والإنجليزية")}
          </p>

          <a href="/app" className="px-8 py-4 text-lg font-semibold bg-blue-600 hover:bg-blue-700 rounded-full">
            {t("Start Chatting", "ابدأ الآن")}
          </a>
        </div>

        <img
          src="/landing/mockup.png"
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[420px] md:w-[600px] drop-shadow-[0_0_35px_rgba(80,80,255,0.5)] animate-float"
        />
      </section>

      {/* ---------------- FEATURES ---------------- */}
      <section id="features" className="py-28 px-6 max-w-6xl mx-auto">
        <h2 className="text-center text-4xl font-bold mb-20 reveal">{t("Why Choose Dahdouh AI?", "لماذا تختار دهضوح AI؟")}</h2>

        <div className="grid md:grid-cols-3 gap-10">
          <Feature title={t("Smart AI Chat", "محادثة ذكية")} desc={t("Ask anything in English or Arabic.", "اسأل أي شيء بالعربية أو الإنجليزية.")} delay={0} />
          <Feature title={t("Image Generator", "مولد الصور")} desc={t("Create HD images instantly.", "أنشئ صورًا بدقة عالية فوراً.")} delay={0.2} />
          <Feature title={t("Math Solver", "حلّ المسائل")} desc={t("Steps, equations, graphs — instantly.", "خطوات، معادلات، رسومات — فوراً.")} delay={0.4} />
        </div>
      </section>

      {/* ---------------- ABOUT ---------------- */}
      <section id="about" className="py-28 px-6 bg-white/5 backdrop-blur-xl border-y border-white/10 reveal">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">{t("Built by a 15-Year-Old Developer", "تم تطويره بواسطة طالب عمره 15 عامًا")}</h2>
          <p className="text-gray-300 text-lg leading-relaxed">
            {t(
              "Dahdouh AI was created by Nabil Dahdouh, a Lebanese student passionate about AI.",
              "تم إنشاء Dahdouh AI بواسطة نبيل دهضوح، طالب لبناني شغوف بالذكاء الاصطناعي."
            )}
          </p>
        </div>
      </section>

      {/* ---------------- PRICING ---------------- */}
      <section id="pricing" className="py-28 px-6 max-w-6xl mx-auto reveal">
        <h2 className="text-center text-4xl font-bold mb-20">{t("Simple Pricing", "أسعار بسيطة")}</h2>

        <div className="grid md:grid-cols-3 gap-10">
          <Price title={t("Free", "مجاني")} price="$0" features={[t("Basic chat", "محادثة بسيطة"), t("Limited images", "صور محدودة")]} />
          <Price title={t("Pro Creator", "منشئ محترف")} price="$3.75" highlight features={[t("Unlimited chat", "دردشة غير محدودة"), t("HD images", "صور عالية الجودة")]} />
          <Price title={t("Premium", "بريميوم")} price="$9.99" features={[t("Everything unlimited", "كل شيء غير محدود"), t("Fast responses", "استجابات سريعة")]} />
        </div>
      </section>

      {/* ---------------- FOOTER ---------------- */}
      <footer className="py-10 text-center text-gray-400 border-t border-white/10">
        © 2025 Dahdouh AI — {t("All rights reserved", "جميع الحقوق محفوظة")}
      </footer>
    </div>
  );
}

/* -------- COMPONENTS -------- */

function Feature({ title, desc, delay }: any) {
  return (
    <div
      className="reveal opacity-0 translate-y-10 transition-all duration-700"
      style={{ transitionDelay: `${delay}s` }}
    >
      <div className="p-8 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition">
        <h3 className="text-2xl font-semibold mb-3">{title}</h3>
        <p className="text-gray-300">{desc}</p>
      </div>
    </div>
  );
}

function Price({ title, price, features, highlight = false }: any) {
  return (
    <div
      className={`p-8 rounded-xl border transition ${
        highlight
          ? "bg-gradient-to-br from-blue-600 to-purple-600 text-white border-transparent scale-105"
          : "bg-white/5 border-white/10 text-gray-200"
      }`}
    >
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className="text-4xl font-extrabold mb-6">{price}</p>

      <ul className="space-y-2 mb-6">
        {features.map((f: string) => (
          <li key={f} className="flex items-center gap-2">• {f}</li>
        ))}
      </ul>

      <a
        href="/app"
        className={`block text-center py-3 rounded-lg font-semibold ${
          highlight ? "bg-white text-black" : "bg-white/10 hover:bg-white/20"
        }`}
      >
        Start
      </a>
    </div>
  );
}