import { generateScript } from "@/configs/AiModel";
import { NextResponse } from "next/server";

const SCRIPT_PROMPT = `
Write two different scripts for a 30 seconds video on topic: {topic}

STRICT RULES:
- Return ONLY valid JSON
- No line breaks inside content strings
- No double quotes inside content (use single quotes if needed)
- Single paragraph per script
- Each script should be engaging and suitable for a 30-second video
- Make scripts different from each other in tone or approach

JSON SCHEMA:
{
  "scripts": [
    { "content": "First script content here as a single paragraph" },
    { "content": "Second script content here as a single paragraph" }
  ]
}

IMPORTANT: Return ONLY the JSON object, nothing else. No markdown, no explanations.
`;

export async function POST(req) {
  try {
    // Parse request body
    const { topic } = await req.json();

    // Validate topic exists and is not empty
    if (!topic || typeof topic !== 'string' || topic.trim() === '') {
      return NextResponse.json(
        { error: "Valid topic is required" },
        { status: 400 }
      );
    }

    // Clean and sanitize the topic
    const cleanTopic = topic.trim();
    
    // Optional: Limit topic length to prevent abuse
    if (cleanTopic.length > 200) {
      return NextResponse.json(
        { error: "Topic is too long. Please limit to 200 characters." },
        { status: 400 }
      );
    }

    console.log('Generating script for topic:', cleanTopic);

    // Replace topic in prompt
    const prompt = SCRIPT_PROMPT.replace("{topic}", cleanTopic);

    // Generate script using AI
    const data = await generateScript(prompt);

    // Validate the response structure
    if (!data || !data.scripts || !Array.isArray(data.scripts)) {
      console.error('Invalid AI response structure:', data);
      return NextResponse.json(
        { error: "Failed to generate valid scripts. Please try again." },
        { status: 500 }
      );
    }

    
    if (data.scripts.length !== 2) {
      console.warn('Expected 2 scripts but got:', data.scripts.length);
    }

    // Validate each script has content
    const validScripts = data.scripts.filter(script => 
      script && script.content && script.content.trim() !== ''
    );

    if (validScripts.length === 0) {
      console.error('No valid scripts in response');
      return NextResponse.json(
        { error: "Failed to generate scripts. Please try again." },
        { status: 500 }
      );
    }

    console.log('Successfully generated', validScripts.length, 'scripts');

  
    return NextResponse.json({ scripts: validScripts });
    
  } catch (err) {
    console.error("API Error:", err);

    // Handle specific error types
    if (err.name === 'SyntaxError') {
      return NextResponse.json(
        { error: "Invalid request format" },
        { status: 400 }
      );
    }

    
    return NextResponse.json(
      { 
        error: err.message || "Failed to generate scripts. Please try again.",
        // Only include stack trace in development
        ...(process.env.NODE_ENV === 'development' && { details: err.stack })
      },
      { status: 500 }
    );
  }
}
