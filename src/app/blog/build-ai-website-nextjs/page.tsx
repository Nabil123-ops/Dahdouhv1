export const metadata = {
  title: "How To Build an AI Website Using Next.js",
  description: "Learn step-by-step how to create a full AI website using Next.js, Tailwind CSS, API routes, and AI models.",
};

export default function Page() {
  return (
    <main className="max-w-4xl mx-auto p-6 prose prose-lg dark:prose-invert">
      <h1>How To Build an AI Website Using Next.js</h1>

      <p>This guide explains how to build an AI-powered website similar to Dahdouh AI using Next.js.</p>

      <h2>1. Install Next.js</h2>
      <pre><code>npx create-next-app my-ai-app</code></pre>

      <h2>2. Install Tailwind</h2>
      <pre><code>npm install -D tailwindcss postcss autoprefixer</code></pre>

      <h2>3. Create AI API Route</h2>
      <pre><code>{`export async function POST(req) {
  const { prompt } = await req.json();
  return Response.json({ reply: "AI Response" });
}`}</code></pre>

      <h2>4. Build UI</h2>
      <p>Use Zustand, Tailwind, and Next.js routing.</p>

      <h2>5. Deploy to Vercel</h2>
      <p>Connect GitHub → Deploy.</p>
    </main>
  );
}