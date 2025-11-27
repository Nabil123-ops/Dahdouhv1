import { NextResponse } from "next/server";

interface SearchResult {
  title: string;
  snippet: string;
  link: string;
}

/* ============================================================
   FREE LIMIT: 1 FREE MESSAGE PER USER (COOKIE BASED)
============================================================ */
function checkFreeLimit(req: Request) {
  const cookieHeader = req.headers.get("cookie") || "";
  const alreadyUsed = cookieHeader.includes("free_used=true");

  if (alreadyUsed) {
    return NextResponse.json(
      {
        error: "limit_reached",
        message: "You already used your free message. Please sign in to continue.",
      },
      { status: 403 }
    );
  }

  // First-time user: allow request and set cookie
  const res = NextResponse.next();
  res.headers.append("Set-Cookie", "free_used=true; Path=/; Max-Age=2592000"); // 30 days
  return res;
}

/* ============================================================
   GOOGLE SEARCH FUNCTION
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

    if (json.error || !json.items) return [];

    return json.items.map((item: any) => ({
      title: item.title,
      snippet: item.snippet,
      link: item.link,
    }));
  } catch {
    return [];
  }
}

/* ============================================================
   MAIN POST HANDLER
============================================================ */
export async function POST(req: Request) {
  try {
    /* ============================================================
       FREE LIMIT CHECK
    ============================================================ */
    const freeCheck = checkFreeLimit(req);
    // If limit reached → return error
    if (freeCheck instanceof NextResponse && freeCheck.status === 403) {
      return freeCheck;
    }

    /* ============================================================
       READ USER INPUT
    ============================================================ */
    const { prompt, model, imgBase64 } = await req.json();

    if (!prompt && !imgBase64)
      return NextResponse.json({ error: "Missing prompt" }, { status: 400 });

    const GROQ_KEY = process.env.GROQ_API_KEY;
    if (!GROQ_KEY)
      return NextResponse.json(
        { error: "Missing GROQ_API_KEY ENV" },
        { status: 500 }
      );

    /* ============================================================
       MODEL MAP
    ============================================================ */
    const MODEL_MAP = {
      "dahdouh-ai": "llama-3.3-70b-versatile",
      "dahdouh-math": "groq/compound-mini",
      "dahdouh-search": "openai/gpt-oss-20b",
      "dahdouh-agent": "meta-llama/llama-4-scout-17b-16e-instruct",
      "dahdouh-vision": "meta-llama/llama-4-scout-17b-16e-instruct",
      "dahdouh-image": "luma/llama-3.2-vision-image-1b",
    };

    type ModelKey = keyof typeof MODEL_MAP;
    const selectedModel = MODEL_MAP[(model as ModelKey) || "dahdouh-ai"];

    /* ============================================================
       SEARCH MODEL
    ============================================================ */
    if (model === "dahdouh-search") {
      const results = await runGoogleSearch(prompt);

      if (results.length === 0)
        return NextResponse.json({
          reply: "No results found.",
        });

      return NextResponse.json({
        reply: results
          .map(
            (r, i) =>
              `${i + 1}. **${r.title}**\n${r.snippet}\n${r.link}`
          )
          .join("\n\n"),
      });
    }

    /* ============================================================
       AGENT MODEL
    ============================================================ */
    if (model === "dahdouh-agent") {
      const googleResults = await runGoogleSearch(prompt);

      const sources =
        googleResults.length === 0
          ? "No sources."
          : googleResults
              .slice(0, 5)
              .map((s, i) => `(${i + 1}) ${s.title} — ${s.link}`)
              .join("\n");

      const agentPrompt = `
You are Dahdouh Agent.
Answer clearly and cite sources like [1], [2].

Sources:
${sources}

User question:
${prompt}
`;

      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GROQ_KEY}`,
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: [{ role: "user", content: agentPrompt }],
          temperature: 0.4,
        }),
      });

      const data = await res.json();

      return NextResponse.json({
        reply: data?.choices?.[0]?.message?.content || "No response.",
        sources: googleResults,
      });
    }

    /* ============================================================
       VISION MODEL
    ============================================================ */
    if (model === "dahdouh-vision") {
      const messages: any[] = [
        {
          role: "user",
          content: [{ type: "text", text: prompt || "Describe this image." }],
        },
      ];

      if (imgBase64) {
        messages[0].content.push({
          type: "image_url",
          image_url: { url: imgBase64 },
        });
      }

      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GROQ_KEY}`,
        },
        body: JSON.stringify({
          model: selectedModel,
          messages,
        }),
      });

      const data = await res.json();

      return NextResponse.json({
        reply: data?.choices?.[0]?.message?.content || "No response.",
      });
    }

    /* ============================================================
       IMAGE GENERATION MODEL
    ============================================================ */
    if (model === "dahdouh-image") {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GROQ_KEY}`,
        },
        body: JSON.stringify({
          model: selectedModel,
          response_format: { type: "json_object" },
          messages: [
            {
              role: "user",
              content: `Generate an image using this prompt: "${prompt}". Return ONLY Base64.`,
            },
          ],
        }),
      });

      const data = await res.json();

      let base64 = null;
      try {
        const parsed = JSON.parse(data?.choices?.[0]?.message?.content);
        base64 = parsed?.image_base64 || null;
      } catch {
        base64 = null;
      }

      return NextResponse.json({
        image: base64,
        reply: base64 ? "Image generated." : "Failed to generate image.",
      });
    }

    /* ============================================================
       MATH MODEL (NO LATEX)
    ============================================================ */
    let finalPrompt = prompt;

    if (model === "dahdouh-math") {
      finalPrompt = `
Explain this math problem step-by-step in simple English.
Do NOT use LaTeX.

${prompt}
`;
    }

    /* ============================================================
       DEFAULT NORMAL CHAT MODEL
    ============================================================ */
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_KEY}`,
      },
      body: JSON.stringify({
        model: selectedModel,
        messages: [{ role: "user", content: finalPrompt }],
        temperature: 0.5,
      }),
    });

    const data = await res.json();

    return NextResponse.json({
      reply: data?.choices?.[0]?.message?.content || "No response.",
    });
  } catch (err) {
    console.error("API ERROR:", err);
    return NextResponse.json(
      { error: "Server error", detail: String(err) },
      { status: 500 }
    );
  }
}