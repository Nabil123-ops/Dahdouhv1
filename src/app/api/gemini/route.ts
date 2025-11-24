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
       MODEL MAP (Groq Compatible Models)
    ============================================================ */
    const MODEL_MAP: Record<string, string> = {
      "dahdouh-ai": "llama-3.3-70b-versatile",
      "dahdouh-math": "deepseek-math-7b-instruct",
      "dahdouh-agent": "llama-3.3-70b-versatile",
      "dahdouh-search": "llama-3.1-8b-instant",
      "dahdouh-vision": "llama-3.2-11b-vision-preview",
    };

    const selectedModel = MODEL_MAP[model] || MODEL_MAP["dahdouh-ai"];

    /* ============================================================
       1) SEARCH MODEL — Google CSE
    ============================================================ */
    if (model === "dahdouh-search") {
      const results = await runGoogleSearch(prompt);

      return NextResponse.json({
        reply: results
          .map(
            (r: any, i: number) =>
              `${i + 1}. **${r.title}**\n${r.snippet}\n${r.link}\n`
          )
          .join("\n"),
        results,
      });
    }

    /* ============================================================
       2) AGENT (Perplexity Style)
    ============================================================ */
    if (model === "dahdouh-agent") {
      const searchResults = await runGoogleSearch(prompt);

      const agentPrompt = `
You are Dahdouh Agent. Answer clearly.
Sources:
${searchResults
  .slice(0, 5)
  .map((s: any, i: number) => `(${i + 1}) ${s.title} — ${s.link}`)
  .join("\n")}
      
User question: ${prompt}
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
            model: MODEL_MAP["dahdouh-agent"],
            messages: [{ role: "user", content: agentPrompt }],
            temperature: 0.3,
          }),
        }
      );

      const data = await res.json();

      return NextResponse.json({
        reply: data?.choices?.[0]?.message?.content || "No response.",
        sources: searchResults,
      });
    }

    /* ============================================================
       3) MATH MODEL
    ============================================================ */
    let finalPrompt = prompt;
    if (model === "dahdouh-math") {
      finalPrompt = `
Solve this math problem.
Explain step-by-step.
Use LaTeX formatting.

Problem:
${prompt}
`;
    }

    /* ============================================================
       4) VISION MODEL (correct Groq format)
    ============================================================ */
    if (model === "dahdouh-vision") {
      const messages: any[] = [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: prompt || "Describe the image.",
            },
          ],
        },
      ];

      if (imgBase64) {
        messages[0].content.push({
          type: "input_image",
          image_url: imgBase64,
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
            model: MODEL_MAP["dahdouh-vision"],
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
       5) DEFAULT NORMAL CHAT
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
      reply:
        data?.choices?.[0]?.message?.content ||
        "No response.",
    });
  } catch (err: any) {
    console.error("API ERROR:", err);
    return NextResponse.json(
      { error: "AI Request Failed", detail: err.message },
      { status: 500 }
    );
  }
}