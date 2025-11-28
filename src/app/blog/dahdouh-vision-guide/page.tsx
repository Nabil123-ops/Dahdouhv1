export const metadata = {
  title: "Dahdouh Vision: AI Image Understanding for Everyone",
  description:
    "Dahdouh Vision can analyze images, objects, text, and scenes with powerful AI capabilities.",
};

export default function Page() {
  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-green-500 to-blue-600 text-transparent bg-clip-text mb-6">
        Dahdouh Vision: AI Image Understanding for Everyone
      </h1>

      <p className="leading-relaxed text-lg">
        Dahdouh Vision lets users upload photos and instantly receive detailed
        AI explanations. From identifying objects to analyzing text, the
        possibilities are endless.
      </p>

      <h2 className="text-2xl mt-8 mb-3 font-semibold">What Dahdouh Vision Can Do</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>Detect objects in photos</li>
        <li>Explain scenes</li>
        <li>Read text inside images</li>
        <li>Analyze logos and designs</li>
        <li>Help with homework requiring images</li>
      </ul>

      <p className="mt-8">
        Dahdouh Vision makes AI image analysis accessible to everyone.
      </p>
    </main>
  );
}