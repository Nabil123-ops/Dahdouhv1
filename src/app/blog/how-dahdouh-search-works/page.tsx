export const metadata = {
  title: "How Dahdouh Search Works — Better Than Google for AI Answers",
  description:
    "Learn how Dahdouh Search gives direct, AI-optimized answers without scanning hundreds of websites.",
};

export default function Page() {
  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 text-transparent bg-clip-text mb-6">
        How Dahdouh Search Works
      </h1>

      <p className="text-lg leading-relaxed">
        Dahdouh Search combines AI reasoning with real-time online results. This
        makes it faster and smarter than traditional search engines when you need
        accurate answers instantly.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">Why It’s Different</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>No ads or distracting websites</li>
        <li>Summaries instead of long pages</li>
        <li>Fact-checked answers</li>
        <li>AI reasoning added to every search</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-3">Perfect For</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>Students</li>
        <li>Developers</li>
        <li>Researchers</li>
        <li>People who want instant summaries</li>
      </ul>

      <p className="leading-relaxed mt-8">
        Dahdouh Search is quickly becoming one of the most advanced AI-powered
        search engines in Lebanon and the Middle East.
      </p>
    </main>
  );
}