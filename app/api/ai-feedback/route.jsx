import { FEEDBACK_PROMPT } from "@/services/Constants"
import OpenAI from "openai"; // ✅ FIXED wrong import

export async function POST(req) {
  try {
    const { conversation } = await req.json();

    if (!conversation) {
      return Response.json(
        { success: false, error: "No conversation provided" },
        { status: 400 }
      );
    }

    const FINAL_PROMPT = FEEDBACK_PROMPT.replace(
      '{{conversation}}',
      JSON.stringify(conversation) // ✅ FIXED typo stringfy → stringify
    );

    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: FINAL_PROMPT }],
    });

    const raw = completion.choices[0].message.content;

    const cleaned = raw
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch (err) {
      console.error("JSON PARSE ERROR:", cleaned);
      return Response.json(
        { success: false, error: "AI returned invalid JSON format" },
        { status: 500 }
      );
    }

    return Response.json({ content: JSON.stringify(parsed) }); // ✅ FIXED — wrapped in content key

  } catch (error) {
    console.error("FEEDBACK API ERROR:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}