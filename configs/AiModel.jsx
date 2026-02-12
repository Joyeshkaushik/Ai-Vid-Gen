import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function generateScript(prompt) {
  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  });

  let text = completion.choices[0]?.message?.content;

  text = text
    .replace(/(\r\n|\n|\r)/gm, " ")
    .replace(/\s+/g, " ")
    .trim();

  try {
    return JSON.parse(text);
  } catch (err) {
    console.error("Invalid JSON from Groq:", text);
    throw new Error("AI did not return valid JSON");
  }
}

// ✅ CHANGED: Added retry with fallback
export async function GenerateImageScript(prompt, retries = 2) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`🔄 Attempt ${attempt}/${retries} to generate image prompts`);
      
      const completion = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [
          { 
            role: "system", 
            content: "You are a JSON generator. Return ONLY a valid JSON array. Example: [{\"imagePrompt\":\"a beautiful sunset\",\"sceneContent\":\"opening scene\"}]. No markdown, no code blocks." 
          },
          { 
            role: "user", 
            content: prompt 
          }
        ],
        temperature: 0.3,
        max_tokens: 2000,
      });

      let text = completion.choices[0]?.message?.content || "";

      console.log(`========== RAW RESPONSE (Attempt ${attempt}) ==========`);
      console.log(text);
      console.log("=====================================================");

      // Clean up
      text = text
        .replace(/```json\s*/gi, "")
        .replace(/```\s*/g, "")
        .trim();

      // Extract array
      const arrayStart = text.indexOf('[');
      const arrayEnd = text.lastIndexOf(']');
      
      if (arrayStart !== -1 && arrayEnd !== -1) {
        text = text.substring(arrayStart, arrayEnd + 1);
      }

      // Parse
      const parsed = JSON.parse(text);
      
      if (!Array.isArray(parsed) || parsed.length === 0) {
        throw new Error("Invalid or empty array");
      }

      console.log(`✅ Success on attempt ${attempt}: ${parsed.length} prompts`);
      return parsed;
      
    } catch (err) {
      console.error(`❌ Attempt ${attempt} failed:`, err.message);
      
      // ✅ CHANGED: Return fallback instead of throwing error
      if (attempt === retries) {
        console.log("⚠️ All attempts failed. Returning fallback image prompts");
        return [
          {
            imagePrompt: "a cinematic scene",
            sceneContent: "Scene 1"
          },
          {
            imagePrompt: "a dramatic moment",
            sceneContent: "Scene 2"
          },
          {
            imagePrompt: "an epic conclusion",
            sceneContent: "Scene 3"
          },
          {
            imagePrompt: "a beautiful landscape",
            sceneContent: "Scene 4"
          }
        ];
      }
      
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
}