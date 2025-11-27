import { NextResponse } from "next/server";
import User from "@/models/user-model";   // ✅ Make sure this path matches
import dbConnect from "@/utils/db"; // ✅ your DB connector

interface SearchResult {
  title: string;
  snippet: string;
  link: string;
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
    if (!res.ok) return [];

    const json = await res.json();
    if (!json.items) return [];

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
   MAIN POST HANDLER — WITH SUBSCRIPTION CHECKS
============================================================ */
export async function POST(req: Request) {
  try {
    await dbConnect();

    const body = await req.json();
    const { prompt, model, imgBase64, email } = body;

    if (!prompt && !imgBase64) {
      return NextResponse.json(
        { error: "Missing prompt" },
        { status: 400 }
      );
    }

    /* ============================================================
       FETCH USER + CHECK EXPIRATION
    ============================================================ */
    let user = null;

    if (email) {
      user = await User.findOne({ email });

      // Auto-downgrade expired subscriptions
      if (user?.expires && new Date(user.expires) < new Date()) {
        user.plan = "free";
        await user.save();
      }
    }

    const plan = user?.plan || "free";

    /* ============================================================
       SUBSCRIPTION RESTRICTION RULES
    ============================================================ */

    // ❌ Block Dahdouh Agent for free users
    if (model === "dahdouh-agent" && plan === "free") {
      return NextResponse.json(
        { error: "Upgrade required to use Dahdouh Agent." },
        { status: 403 }
      );
    }

    // ❌ Block Vision Model for free
    if (model === "dahdouh-vision" && plan === "free") {
      return NextResponse.json(
        { error: "Upgrade required to use Vision (image upload)." },
        { status: 403 }
      );
    }

    // ❌ Block HD Image Generator for free + advanced
    if (model === "dahdouh-image" && plan !== "creator") {
      return NextResponse.json(
        { error: "Creator Plan required for HD image generation." },
        { status: 403 }
      );
    }

    // ❌ Block Video AI for free + advanced (when you add it later)
    if (model === "dahdouh-video" && plan !== "creator") {
      return NextResponse.json(
        { error: "Creator Plan required for AI video generation." },
        { status: 403 }
      );
    }

    // ❌ Block search for free users (optional)
    if (model === "dahdouh-search" && plan === "free") {
      return NextResponse.json(
        { error: "Upgrade required to use AI Search mode." },
        { status: 403 }
      );
    }

    const GROQ_KEY = process.env.GROQ_API_KEY;
    if (!GROQ_KEY) {
      return NextResponse.json(
        { error: "Missing GROQ_API_KEY" },
        { status: 500 }
      );
    }

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

    const selectedModel =
      MODEL_MAP[(model as keyof typeof MODEL_MAP) || "dahdouh-ai"];

    /* ============================================================
       SEARCH MODEL
    ============================================================ */
    if (model === "dahdouh-search") {
      const results = await runGoogleSearch(prompt);

      if (!results.length) {
        return NextResponse.json({ reply: "No results found." });
      }

      const formatted = results
        .map(
          (r, i) =>
            `${i + 1}. **${r.title}**\n${r.snippet}\n${r.link}`
        )
        .join("\n\n");

      return NextResponse.json({ reply: formatted });
    }

    /* ============================================================
       AGENT MODEL
    ============================================================ */
    if (model === "dahdouh-agent") {
      const searchResults = await runGoogleSearch(prompt);

      const sources = searchResults.length
        ? searchResults
            .slice(0, 5)
            .map((s, i) => `(${i + 1}) ${s.title} — ${s.link}`)
            .join("\n")
        : "No sources.";

      const agentPrompt = `
You are Dahdouh Agent.
Answer clearly and cite sources like [1], [2].

Sources:
${sources}

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
            messages: [{ role: "user", content: agentPrompt }],
            temperature: 0.4,
          }),
        }
      );

      const data = await res.json().catch(() => null);

      return NextResponse.json({
        reply:
          data?.choices?.[0]?.message?.content ||
          "No response.",
        sources: searchResults,
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

      const data = await res.json().catch(() => null);

      return NextResponse.json({
        reply:
          data?.choices?.[0]?.message?.content ||
          "No response.",
      });
    }

    /* ============================================================
       IMAGE GENERATION MODEL
    ============================================================ */
    if (model === "dahdouh-image") {
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
            response_format: { type: "json_object" },
            messages: [
              {
                role: "user",
                content: `Generate an image using this prompt: "${prompt}". Return ONLY Base64.`,
              },
            ],
          }),
        }
      );

      const data = await res.json().catch(() => null);

      let base64 = null;
      try {
        const parsed = JSON.parse(
          data?.choices?.[0]?.message?.content || "{}"
        );
        base64 = parsed.image_base64 || null;
      } catch {
        base64 = null;
      }

      return NextResponse.json({
        image: base64,
        reply: base64 ? "Image generated." : "Failed to generate image.",
      });
    }

    /* ============================================================
       MATH MODEL
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
          temperature: 0.5,
        }),
      }
    );

    const data = await res.json().catch(() => null);

    return NextResponse.json({
      reply:
        data?.choices?.[0]?.message?.content ||
        "No response.",
    });
  } catch (e: any) {
    console.error("API ERROR:", e);

    return NextResponse.json(
      {
        error: "Server error",
        detail: String(e),
      },
      { status: 500 }
    );
  }
}