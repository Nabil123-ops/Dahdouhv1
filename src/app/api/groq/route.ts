import { NextResponse } from "next/server";

// Define search result type
interface SearchResult {
  title: string;
  snippet: string;
  link: string;
}

/* ============================================================
   GOOGLE SEARCH (CSE)
============================================================ */
async function runGoogleSearch(query: string): Promise<SearchResult[]> {
  const apiKey = process.env.GOOGLE_API_KEY;
  const cx = process.env.GOOGLE_CX;

  if (!apiKey || !cx) return [];

  const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(
    query
  )}&key=${apiKey}&cx=${cx}`;

  try {
    const res = await fetch(url);
    const json = await res.json();

    if (json.error) {
      console.error("Google CSE Error:", json.error);
      return [];
    }

    if (!json.items) return [];

    return json.items.map((item: any) => ({
      title: item.title,
      snippet: item.snippet,
      link: item.link,
    }));
  } catch (err) {
    console.error("Google Search Error:", err);
    return [];
  }
}

/* ============================================================
   MAIN API HANDLER
============================================================ */
export async function POST(req: Request) {
  try {
    const { prompt, model, imgBase64 } = await req.json();
    const GROQ_KEY = process.env.GROQ_API_KEY;

    if (!prompt && !imgBase64) {
      return NextResponse.json(
        { error: "Missing prompt or image" },
        { status: 400 }
      );
    }

    if (!GROQ_KEY) {
      return NextResponse.json(
        { error: "GROQ_API_KEY missing on server" },
        { status: 500 }
      );
    }

    /* ============================================================
       MODEL MAP
    ============================================================= */
    const MODEL_MAP = {
      "dahdouh-ai": "llama-3.1-70b-versatile",
      "dahdouh-math": "groq/compound-mini",
      "dahdouh-search": "openai/gpt-oss-20b",
      "dahdouh-agent": "llama-3.1-70b-versatile",
      "dahdouh-vision": "meta-llama/llama-4-scout-17b-16e-instruct",
    };

    type ModelKey = keyof typeof MODEL_MAP;
    const selectedModel =
      MODEL_MAP[model as ModelKey] || MODEL_MAP["dahdouh-ai"];

    /* ============================================================
       SYSTEM PROMPT — IMPROVE AI QUALITY
    ============================================================ */
    const systemPrompt = `
You are **Dahdouh AI**, an advanced assistant.
- Give very clear, helpful answers.
- If asked for math → show steps and use LaTeX.
- If asked normal questions → be smart, friendly and accurate.
- Never respond with weak or short answers.
- Always respond at high quality.
`;

    /* ============================================================
       SEARCH MODEL
    ============================================================ */
    if (model === "dahdouh-search") {
      const results = await runGoogleSearch(prompt);

      if (results.length === 0) {
        return NextResponse.json({ reply: "No search results found." });
      }

      return NextResponse.json({
        reply: results
          .map(
            (r, i) =>
              `${i + 1}. **${r.title}**\n${r.snippet}\n${r.link}\n`
          )
          .join("\n"),
        results,
      });
    }

    /* ============================================================
       AGENT MODEL (Perplexity Style)
    ============================================================ */
    if (model === "dahdouh-agent") {
      const searchResults = await runGoogleSearch(prompt);

      const sourcesText =
        searchResults.length > 0
          ? searchResults
              .slice(0, 5)
              .map((s: SearchResult, i: number) => `(${i + 1}) ${s.title} — ${s.link}`)
              .join("\n")
          : "No sources.";

      const agentPrompt = `
You are **Dahdouh Agent**, similar to Perplexity AI.
Give a short, smart final answer, then list sources.

Sources:
${sourcesText}

User question:
${prompt}
`;

      const res = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${GROQ_KEY}`,
          },
          body: JSON.stringify({
            model: selectedModel,
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: agentPrompt },
            ],
          }),
        }
      );

      const data = await res.json();

      return NextResponse.json({
        reply: data?.choices?.[0]?.message?.content || "No agent response.",
        sources: searchResults,
      });
    }

    /* ============================================================
       MATH MODEL
    ============================================================ */
    let finalPrompt = prompt;

    if (model === "dahdouh-math") {
      finalPrompt = `
Solve the following math problem **step-by-step**.
Use LaTeX formatting.

${prompt}
`;
    }

    /* ============================================================
       VISION MODEL
    ============================================================ */
    if (model === "dahdouh-vision") {
      const messages: any[] = [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: [
            { type: "text", text: prompt || "Describe the image." },
          ],
        },
      ];

      if (imgBase64) {
        messages[1].content.push({
          type: "image_url",
          image_url: { url: imgBase64 },
        });
      }

      const res = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${GROQ_KEY}`,
          },
          body: JSON.stringify({
            model: selectedModel,
            messages,
          }),
        }
      );

      const data = await res.json();

      return NextResponse.json({
        reply: data?.choices?.[0]?.message?.content || "No vision response.",
      });
    }

    /* ============================================================
       DEFAULT CHAT (Dahdouh AI)
    ============================================================ */
    const res = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GROQ_KEY}`,
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: finalPrompt },
          ],
          temperature: 0.4,
        }),
      }
    );

    const data = await res.json();

    return NextResponse.json({
      reply: data?.choices?.[0]?.message?.content || "No response.",
    });
  } catch (err: any) {
    console.error("API ERROR:", err);
    return NextResponse.json(
      { error: "AI Request Failed", detail: err.message },
      { status: 500 }
    );
  }
}