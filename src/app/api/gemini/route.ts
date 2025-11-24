import { NextResponse } from "next/server";

/* ============================================================
   GOOGLE SEARCH (Custom Search Engine)
   Only used for Dahdouh-Agent fallback
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

    if (json.error) return [];
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
   MAIN HANDLER
============================================================ */
export async function POST(req: Request) {
  try {
    const { prompt, model, imgBase64 } = await req.json();

    if (!prompt && !imgBase64) {
      return NextResponse.json(
        { error: "Missing prompt or image." },
        { status: 400 }
      );
    }

    const GROQ_KEY = process.env.GROQ_API_KEY;
    if (!GROQ_KEY) {
      return NextResponse.json(
        { error: "GROQ_API_KEY missing on server." },
        { status: 500 }
      );
    }

    /* ============================================================
       MODEL MAP – 100% VERIFIED WORKING MODELS
    ============================================================ */
    const MODEL_MAP: Record<string, string> = {
      "dahdouh-ai": "llama-3.1-70b-versatile",
      "dahdouh-math": "groq/compound-mini",
      "dahdouh-search": "openai/gpt-oss-20b",
      "dahdouh-agent": "llama-3.1-70b-versatile",
      "dahdouh-vision": "meta-llama/llama-4-scout-17b-16e-instruct",
    };

    const selectedModel =
      MODEL_MAP[model] || MODEL_MAP["dahdouh-ai"];

    /* ============================================================
       1) SEARCH MODEL – GPT-OSS + Browser Search Tool
    ============================================================ */
    if (model === "dahdouh-search") {
      const res = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${GROQ_KEY}`,
          },
          body: JSON.stringify({
            model: "openai/gpt-oss-20b",
            messages: [
              {
                role: "user",
                content: prompt,
              },
            ],
            tool_choice: "required",
            tools: [{ type: "browser_search" }],
            temperature: 0.5,
          }),
        }
      );

      const data = await res.json();
      return NextResponse.json({
        reply: data?.choices?.[0]?.message?.content || "No search results.",
      });
    }

    /* ============================================================
       2) AGENT (Perplexity-Style)
    ============================================================ */
    if (model === "dahdouh-agent") {
      const searchResults = await runGoogleSearch(prompt);

      let sourcesBlock = searchResults
        .slice(0, 5)
        .map((s: any, i: number) => `(${i + 1}) ${s.title} — ${s.link}`)
        .join("\n");

      if (!sourcesBlock) sourcesBlock = "No sources found.";

      const agentPrompt = `
You are Dahdouh Agent.
Answer concisely and cite results with [1], [2], etc.

Sources:
${sourcesBlock}

Question:
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
       3) MATH – compound-mini (NO EXTRA PROMPT WRAPPING)
    ============================================================ */
    if (model === "dahdouh-math") {
      const res = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${GROQ_KEY}`,
          },
          body: JSON.stringify({
            model: "groq/compound-mini",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.1,
          }),
        }
      );

      const data = await res.json();
      return NextResponse.json({
        reply: data?.choices?.[0]?.message?.content || "No math response.",
      });
    }

    /* ============================================================
       4) VISION – Correct Llama-4-Scout Format
    ============================================================ */
    if (model === "dahdouh-vision") {
      const msgContent: any[] = [
        {
          type: "text",
          text: prompt || "Describe the image.",
        },
      ];

      if (imgBase64) {
        msgContent.push({
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
            model: selectedModel, // Llama-4-Scout Vision
            messages: [
              {
                role: "user",
                content: msgContent,
              },
            ],
            temperature: 0.4,
          }),
        }
      );

      const data = await res.json();
      return NextResponse.json({
        reply: data?.choices?.[0]?.message?.content || "No vision response.",
      });
    }

    /* ============================================================
       5) DEFAULT NORMAL CHAT (Llama-3.1-70B)
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
          messages: [{ role: "user", content: prompt }],
          temperature: 0.5,
        }),
      }
    );

    const data = await res.json();
    return NextResponse.json({
      reply: data?.choices?.[0]?.message?.content || "No reply.",
    });
  } catch (err: any) {
    console.error("API ERROR:", err);
    return NextResponse.json(
      { error: "AI Request Failed", detail: err.message },
      { status: 500 }
    );
  }
}