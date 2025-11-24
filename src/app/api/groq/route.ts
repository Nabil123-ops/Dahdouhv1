import { NextResponse } from "next/server";

/* ============================================================
   GOOGLE SEARCH (Custom Search Engine)
============================================================ */
async function runGoogleSearch(query: string) {
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
    console.error("Google Search Fetch Error:", err);
    return [];
  }
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

    const GROQ_KEY = process.env.GROQ_API_KEY;
    if (!GROQ_KEY) {
      return NextResponse.json(
        { error: "GROQ_API_KEY is not configured." },
        { status: 500 }
      );
    }

    /* ============================================================
       MODEL MAP (Groq Compatible)
    ============================================================ */
    const MODEL_MAP = {
      "dahdouh-ai": "llama-3.1-70b-versatile",
      "dahdouh-math": "groq/compound-mini",
      "dahdouh-search": "openai/gpt-oss-20b",
      "dahdouh-agent": "llama-3.1-70b-versatile",
      "dahdouh-vision": "meta-llama/llama-4-scout-17b-16e-instruct",
    };

    /** FIX: Tell TypeScript that model is a MODEL_MAP key */
    type ModelKey = keyof typeof MODEL_MAP;

    const selectedModel =
      MODEL_MAP[model as ModelKey] || MODEL_MAP["dahdouh-ai"];

    /* ============================================================
       SEARCH MODEL
    ============================================================ */
    if (model === "dahdouh-search") {
      const results = await runGoogleSearch(prompt);

      if (results.length === 0) {
        return NextResponse.json({
          reply: "No search results found.",
        });
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
       AGENT MODEL
    ============================================================ */
    if (model === "dahdouh-agent") {
      const searchResults = await runGoogleSearch(prompt);

      const sourcesText =
        searchResults.length > 0
          ? searchResults
              .slice(0, 5)
              .map((s: any, i: number) => `(${i + 1}) ${s.title} — ${s.link}`)
              .join("\n")
          : "No sources.";

      const agentPrompt = `
You are Dahdouh Agent.
Respond clearly, and cite sources as [1], [2].

Sources:
${sourcesText}

User: ${prompt}
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
            model: MODEL_MAP["dahdouh-agent"],
            messages: [{ role: "user", content: agentPrompt }],
            temperature: 0.3,
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
Solve this math problem step-by-step using LaTeX:

${prompt}
`;
    }

    /* ============================================================
       VISION MODEL
    ============================================================ */
    if (model === "dahdouh-vision") {
      const messages: any[] = [
        {
          role: "user",
          content: [
            { type: "text", text: prompt || "Describe the image." },
          ],
        },
      ];

      if (imgBase64) {
        messages[0].content.push({
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
        reply:
          data?.choices?.[0]?.message?.content ||
          "No vision response.",
      });
    }

    /* ============================================================
       DEFAULT NORMAL CHAT
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
          messages: [{ role: "user", content: finalPrompt }],
          temperature: 0.4,
        }),
      }
    );

    const data = await res.json();

    return NextResponse.json({
      reply:
        data?.choices?.[0]?.message?.content ||
        "No response.",
    });
  } catch (err: any) {
    console.error("API ERROR:", err);

    return NextResponse.json(
      {
        error: "AI Request Failed",
        detail: err.message,
      },
      { status: 500 }
    );
  }
}