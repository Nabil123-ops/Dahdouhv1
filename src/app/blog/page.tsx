import Link from "next/link";

export const metadata = {
  title: "Dahdouh AI Blog – Tips, Guides, AI News",
  description: "Read the latest AI guides, tutorials, and technology articles from Dahdouh AI.",
};

const blogs = [
  {
    title: "What Is Dahdouh AI? Full Guide (2025)",
    slug: "dahdouh-ai-guide",
    description: "Learn everything about Dahdouh AI, features, models, pricing, and more.",
  },
  {
    title: "Dahdouh AI vs ChatGPT: Which Is Better?",
    slug: "dahdouh-ai-vs-chatgpt",
    description: "A full comparison between Dahdouh AI and ChatGPT in 2025.",
  },
  {
    title: "Best Free AI Tools in 2025",
    slug: "free-ai-tools-2025",
    description: "A complete list of the best free AI tools you can use today.",
  },
  {
    title: "How Students Can Use Dahdouh AI for Homework",
    slug: "dahdouh-ai-for-students",
    description: "Guide for students to use Dahdouh AI for studying, math, essays, and more.",
  },
  {
    title: "How To Build an AI Website Using Next.js",
    slug: "build-ai-website-nextjs",
    description: "Learn how to create a full AI website using Next.js from zero.",
  },
];

export default function Page() {
  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6">📘 Dahdouh AI Blog</h1>

      <div className="space-y-6">
        {blogs.map((b) => (
          <Link
            key={b.slug}
            href={`/blog/${b.slug}`}
            className="block p-4 border rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <h2 className="text-2xl font-semibold">{b.title}</h2>
            <p className="text-gray-500 mt-2">{b.description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}