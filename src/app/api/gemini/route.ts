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

    // Check for API-level errors from Google
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

    /* IMPORTANT: The GROQ_API_KEY must be set in your .env file
    and must NOT be prefixed with NEXT_PUBLIC_ 
    */
    const GROQ_KEY = process.env.GROQ_API_KEY;
    if (!GROQ_KEY) {
      return NextResponse.json(
        { error: "GROQ_API_KEY is not configured on the server." },
        { status: 500 }
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
      // Corrected Vision model name for Groq Llama 3.2
      "dahdouh-vision": "llama-3.2-11b-vision-preview", 
    };

    const selectedModel = MODEL_MAP[model] || MODEL_MAP["dahdouh-ai"];

    /* ============================================================
       1) SEARCH MODEL — Google CSE
    ============================================================ */
    if (model === "dahdouh-search") {
      const results = await runGoogleSearch(prompt);

      if (results.length === 0) {
        return NextResponse.json({
          reply: "Could not find any search results for your query.",
        });
      }

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
      
      let sourcesString = "No sources available.";
      if (searchResults.length > 0) {
          sourcesString = searchResults
            .slice(0, 5)
            .map((s: any, i: number) => `(${i + 1}) ${s.title} — ${s.link}`)
            .join("\n");
      }
      
      const agentPrompt = `
You are Dahdouh Agent. Answer the user question clearly and cite the sources by number (e.g., [1], [2]) at the end of relevant sentences.
Sources:
${sourcesString}
      
User question: ${prompt}
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
        reply: data?.choices?.[0]?.message?.content || "No agent response from AI.",
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
Use LaTeX formatting for equations and variables (e.g., $E=mc^2$ or $\\int x^2 dx$).

Problem:
${prompt}
`;
    }

    /* ============================================================
       4) VISION MODEL (Correct Groq/OpenAI multi-modal format)
    ============================================================ */
    if (model === "dahdouh-vision") {
      const messages: any[] = [
        {
          role: "user",
          content: [
            // 1. Text part
            {
              type: "text", // Correct type for text input
              text: prompt || "Describe the image.",
            },
          ],
        },
      ];

      // 2. Image part (if provided)
      if (imgBase64) {
        messages[0].content.push({
          type: "image_url", // Correct type for image URL
          image_url: {
            url: imgBase64, // Base64 string is passed as the URL value
          },
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
            model: selectedModel, // Using selectedModel which is llama-3.2-11b-vision-preview
            messages,
          }),
        }
      );

      const data = await res.json();

      if (data.error) {
        console.error("Groq Vision API Error:", data.error);
        return NextResponse.json({
          reply: `❌ AI Request Failed: Groq Error - ${data.error.message || "Unknown error."}`,
        });
      }

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

    if (data.error) {
      console.error("Groq API Error:", data.error);
      return NextResponse.json({
        reply: `❌ AI Request Failed: Groq Error - ${data.error.message || "Unknown error."}`,
      });
    }

    return NextResponse.json({
      reply:
        data?.choices?.[0]?.message?.content ||
        "No response.",
    });
  } catch (err: any) {
    console.error("API CATCH ERROR:", err);
    return NextResponse.json(
      { error: "AI Request Failed", detail: err.message },
      { status: 500 }
    );
  }
}
