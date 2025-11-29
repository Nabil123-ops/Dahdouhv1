export const metadata = {
  title: "Dahdouh AI Blog",
  description:
    "All Dahdouh AI articles, guides, tutorials, news, and AI tools in one place.",
};

export default function BlogIndex() {
  const blogs = [
    // --- From first screenshot ---
    "dahdouh-ai-vs-chatgpt",
    "dahdouh-math-guide",
    "dahdouh-search-engine",
    "dahdouh-vision-guide",
    "fastest-ai-tool-dahdouh",
    "free-ai-tools-2025",
    "future-of-ai-2035-dahdouh",
    "future-of-dahdouh-ai",
    "how-dahdouh-search-works",
    "learn-skills-with-dahdouh",
    "story-of-dahdouh-ai",
    "top-things-with-dahdouh",
    "what-is-dahdouh-ai",

    // --- From second screenshot ---
    "dahdouh-ai-daily-use",
    "dahdouh-ai-for-beginners",
    "dahdouh-ai-for-business",
    "dahdouh-ai-for-school",
    "dahdouh-ai-for-students",
    "dahdouh-ai-guide",
    "dahdouh-ai-mobile",
    "dahdouh-ai-search-future",
    "dahdouh-ai-small-business-growth",
    "dahdouh-ai-smart-study",
    "dahdouh-ai-startup-guide",
    "dahdouh-ai-study-tips",
    "dahdouh-ai-vs-all",

    // --- From third screenshot ---
    "affordable-ai-tool-dahdouh",
    "ai-for-beginners-dahdouh",
    "ai-trends-2025-dahdouh",
    "ai-vs-human-dahdouh-case",
    "best-ai-assistants-dahdouh",
    "best-ai-for-homework",
    "best-ai-for-students-dahdouh",
    "best-ai-tools-2025-dahdouh",
    "build-ai-website-nextjs",
    "create-viral-content-with-dahdouh",
    "dahdouh-ai-affordable",
    "dahdouh-ai-all-features",
    "dahdouh-ai-content-creators",
  ];

  return (
    <main className="max-w-3xl mx-auto py-12 px-6">
      <h1 className="text-4xl font-bold mb-6">Dahdouh AI Blog</h1>

      <p className="text-gray-500 mb-8">
        Explore {blogs.length}+ powerful articles about Dahdouh AI, search
        technology, productivity, and the future of intelligence.
      </p>

      <ul className="space-y-4">
        {blogs.map((slug) => (
          <li key={slug}>
            <a
              className="text-blue-500 underline text-lg hover:text-blue-700 transition"
              href={`/blog/${slug}`}
            >
              {slug.replace(/-/g, " ").toUpperCase()}
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}