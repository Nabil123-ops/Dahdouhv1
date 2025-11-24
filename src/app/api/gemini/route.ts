import { NextResponse } from "next/server";

/* ============================================================
   GOOGLE SEARCH FUNCTION
============================================================ */
async function runGoogleSearch(query: string) {
  const apiKey = process.env.GOOGLE_API_KEY;
  const cx = process.env.GOOGLE_CX;

  if (!apiKey || !cx) return [];

  const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(
    query
  )}&key=${apiKey}&cx=${cx}`;

  const res = await fetch(url);
  const json = await res.json();

  if (!json.items) return [];

  return json.items.map((item: any) => ({
    title: item.title,
    snippet: item.snippet,
    link: item.link,
  }));
}

/* ============================================================
   MAIN API HANDLER
============================================================ */
export async function POST(req: Request) {
  try {
    const { prompt, model, imgBase64 } = await req.json();

    if (!prompt && !imgBase64) {
      return NextResponse.json(
        { error: "Missing prompt or image" },
        { status: 400 }
      );
    }

    /* ============================================================
       MODEL MAP (GROQ MODELS)
    ============================================================ */
    const MODEL_MAP: Record<string, string> = {
      "dahdouh-ai": "meta-llama/llama-3.3-70b-instruct",
      "dahdouh-math": "deepseek-math-7b-instruct",
      "dahdouh-agent": "meta-llama/llama-4-scout-17b-16e-instruct",
      "dahdouh-search": "meta-llama/llama-3.1-8b-instruct",
      "dahdouh-vision": "llama-3.2-11b-vision-instruct",
    };

    const selectedModel =
      MODEL_MAP[model] || MODEL_MAP["dahdouh-ai"];

    /* ============================================================
       1) SEARCH MODEL — Google CSE
    ============================================================ */
    if (model === "dahdouh-search") {
      const results = await runGoogleSearch(prompt);

      return NextResponse.json({
        type: "search",
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
       2) AGENT MODEL — Perplexity Style
    ============================================================ */
    if (model === "dahdouh-agent") {
      const searchResults = await runGoogleSearch(prompt);

      const sourcesBlock = searchResults
        .slice(0, 5)
        .map((s, i) => `(${i + 1}) ${s.title} — ${s.link}`)
        .join("\n");

      const agentPrompt = `
You are **Dahdouh Agent**, a Perplexity-style AI.

RESPOND WITH THIS STRUCTURE:
1. Final Answer (short, clear)
2. Bullet points if needed
3. "Sources:" followed by links

⚠️ Do NOT reveal chain-of-thought.
⚠️ Do NOT say you searched the web.

User question:
${prompt}

Web results:
${sourcesBlock}
`;

      const res = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          },
          body: JSON.stringify({
            model: "meta-llama/llama-4-scout-17b-16e-instruct",
            messages: [{ role: "user", content: agentPrompt }],
            temperature: 0.3,
          }),
        }
      );

      const data = await res.json();

      return NextResponse.json({
        type: "agent",
        reply: data?.choices?.[0]?.message?.content || "No response.",
        sources: searchResults.slice(0, 5),
      });
    }

    /* ============================================================
       3) MATH MODEL
    ============================================================ */
    let finalPrompt = prompt;

    if (model === "dahdouh-math") {
      finalPrompt = `
You are **Dahdouh Math**, an advanced math solver.

Return:
- Step-by-step solution
- LaTeX formatting
- Final answer clearly highlighted

User Problem:
${prompt}
`;
    }

    /* ============================================================
       4) VISION MODEL — Image + Text
    ============================================================ */
    if (model === "dahdouh-vision") {
      const messages = [];

      if (prompt) {
        messages.push({ role: "user", content: prompt });
      }

      if (imgBase64) {
        messages.push({
          role: "user",
          content: [
            {
              type: "input_image",
              image: imgBase64,
            },
            {
              type: "text",
              text: prompt || "Describe this image.",
            },
          ],
        });
      }

      const res = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          },
          body: JSON.stringify({
            model: "llama-3.2-11b-vision-instruct",
            messages,
            temperature: 0.4,
          }),
        }
      );

      const data = await res.json();

      return NextResponse.json({
        type: "vision",
        reply:
          data?.choices?.[0]?.message?.content ||
          "No vision response.",
      });
    }

    /* ============================================================
       5) NORMAL AI / DEFAULT MODE (Dahdouh AI)
    ============================================================ */
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: [{ role: "user", content: finalPrompt }],
          temperature: 0.4,
        }),
      }
    );

    const data = await response.json();

    return NextResponse.json({
      type: "ai",
      reply:
        data?.choices?.[0]?.message?.content ||
        "No response.",
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Server Error", detail: err.message },
      { status: 500 }
    );
  }
}