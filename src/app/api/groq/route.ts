// app/api/groq/route.ts
import { NextResponse } from "next/server";

/* ---------------- Google Search ---------------- */
async function runGoogleSearch(query: string) {
  const apiKey = process.env.GOOGLE_API_KEY;
  const cx = process.env.GOOGLE_CX;

  if (!apiKey || !cx) return [];

  try {
    const res = await fetch(
      `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(
        query
      )}&key=${apiKey}&cx=${cx}`
    );

    const json = await res.json();
    if (!json.items) return [];
    return json.items.map((item: any) => ({
      title: item.title,
      snippet: item.snippet,
      link: item.link,
    }));
  } catch (err) {
    return [];
  }
}

/* ---------------- API Handler ---------------- */
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
        { error: "GROQ_API_KEY missing!" },
        { status: 500 }
      );
    }

    /* ---------- Correct Groq Models ---------- */
    const MODEL_MAP = {
      "dahdouh-ai": "llama-3.1-70b-versatile",
      "dahdouh-math": "groq/compound-mini",
      "dahdouh-search": "openai/gpt-oss-20b",
      "dahdouh-agent": "llama-3.1-70b-versatile",
      "dahdouh-vision": "meta-llama/llama-4-scout-17b-16e-instruct",
    };

    const selectedModel = MODEL_MAP[model] || MODEL_MAP["dahdouh-ai"];

    /* ---------- Search Model ---------- */
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

    /* ---------- Math ---------- */
    let finalPrompt = prompt;
    if (model === "dahdouh-math") {
      finalPrompt = `
Explain step-by-step and show all equations in LaTeX.

Problem:
${prompt}
`;
    }

    /* ---------- Vision Model ---------- */
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
        reply: data?.choices?.[0]?.message?.content || "No vision response.",
      });
    }

    /* ---------- Default Normal Chat ---------- */
    const response = await fetch(
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

    const data = await response.json();

    return NextResponse.json({
      reply:
        data?.choices?.[0]?.message?.content ||
        "No response.",
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "AI Request Failed", detail: err.message },
      { status: 500 }
    );
  }
           }
