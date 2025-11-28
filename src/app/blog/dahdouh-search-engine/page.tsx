export const metadata = {
  title: "Dahdouh Search: The AI Search Engine for Fast Answers",
  description:
    "Discover how Dahdouh Search gives instant answers, real-time data, and accurate results using AI.",
};

export default function Page() {
  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-blue-600 text-transparent bg-clip-text mb-6">
        Dahdouh Search: The AI Search Engine for Fast Answers
      </h1>

      <p className="text-lg leading-relaxed">
        Dahdouh Search is one of the most advanced features inside Dahdouh AI.
        Unlike traditional search engines, it gives you AI-processed answers,
        fast summaries, and real-time information with zero noise.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">Why Dahdouh Search Is Different</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>Instant summarization</li>
        <li>No ads or distractions</li>
        <li>AI-powered ranking</li>
        <li>Perfect for research & school projects</li>
        <li>Fast and clean results</li>
      </ul>

      <p className="mt-8 leading-relaxed">
        Dahdouh Search replaces hours of browsing with instant AI knowledge.
      </p>
    </main>
  );
}