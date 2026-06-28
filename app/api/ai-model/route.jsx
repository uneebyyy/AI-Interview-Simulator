import { QUESTIONS_PROMPT } from "@/services/Constants";
import OpenAI from "openai";

export async function POST(req) {
  try {
    // 👇 Added questionCount here
    const { jobPosition, jobDescription, duration, type, questionCount } = await req.json();

    const FINAL_PROMPT = QUESTIONS_PROMPT
      .replace("{{jobTitle}}", jobPosition)
      .replace("{{jobDescription}}", jobDescription)
      .replace("{{duration}}", duration)
      .replace("{{type}}", type)
      .replace("{{questionCount}}", questionCount); // 👈 added this

    console.log("API HIT");

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

    return Response.json(parsed);

  } catch (error) {
    console.error("API ERROR:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}