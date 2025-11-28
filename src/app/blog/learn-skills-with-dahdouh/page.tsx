export const metadata = {
  title: "How Dahdouh AI Helps You Learn Any Skill Faster",
  description:
    "Dahdouh AI can teach you languages, coding, design, business, and more with customized learning paths.",
};

export default function Page() {
  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-green-500 text-transparent bg-clip-text mb-6">
        How Dahdouh AI Helps You Learn Any Skill Faster
      </h1>

      <p className="text-lg">
        One of the most powerful uses of Dahdouh AI is skill development.
        Whether you want to learn coding, design, English, or marketing—the AI
        creates a personalized learning roadmap.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">Popular Skills You Can Learn</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>Programming (HTML, JS, Python)</li>
        <li>Graphic design</li>
        <li>Video editing</li>
        <li>Marketing & branding</li>
        <li>English language improvement</li>
      </ul>

      <p className="mt-8">
        With Dahdouh AI, learning becomes simple and efficient for everyone.
      </p>
    </main>
  );
}