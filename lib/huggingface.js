// lib/huggingface.js
import { v2 as cloudinary } from "cloudinary";
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME?.trim(),
  api_key: process.env.CLOUDINARY_API_KEY?.trim(),
  api_secret: process.env.CLOUDINARY_API_SECRET?.trim(),
});

// ✅ ADDED: Placeholder image constant
const PLACEHOLDER_IMAGE = "https://placehold.co/1024x1024/1a1a1a/ffffff?text=Image+Not+Available";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function generateImage(prompt, index = 0) {
  try {
    console.log(`\n🎨 [${index + 1}] Starting generation`);
    console.log(`📝 Prompt: "${prompt.substring(0, 80)}..."`);
    console.log("🤖 Generating with Stability AI...");

    const response = await fetch(
      "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.STABILITY_API_KEY?.trim()}`,
        },
        body: JSON.stringify({
          text_prompts: [
            {
              text: prompt,
              weight: 1
            },
            {
              text: "ugly, blurry, low quality",
              weight: -1
            }
          ],
          cfg_scale: 7,
          height: 1024,
          width: 1024,
          steps: 30,
          samples: 1,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Stability API error (${response.status}): ${errorText}`);
    }

    const result = await response.json();
    const base64Image = result.artifacts[0].base64;
    const dataUri = `data:image/png;base64,${base64Image}`;

    console.log(`✓ Image generated`);

    // Upload to Cloudinary
    console.log(`☁️ Uploading to Cloudinary...`);
    const upload = await cloudinary.uploader.upload(dataUri, {
      folder: "ai-videos",
      public_id: `video_${Date.now()}_${index}`,
      overwrite: true,
      resource_type: "image",
    });

    console.log(`✅ [${index + 1}] SUCCESS!`);
    console.log(`🔗 URL: ${upload.secure_url}`);
    
    return upload.secure_url;

  } catch (err) {
    console.error(`❌ [${index + 1}] FAILED: ${err.message}`);
    // ✅ CHANGED: Return placeholder instead of null
    console.log(`⚠️ Using placeholder for image ${index + 1}`);
    return PLACEHOLDER_IMAGE;
  }
}

export async function generateMultipleImages(prompts) {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`🚀 Starting batch generation of ${prompts.length} images`);
  console.log(`${"=".repeat(60)}\n`);

  const results = [];

  for (let i = 0; i < prompts.length; i++) {
    const url = await generateImage(prompts[i], i);
    results.push(url);
    
    // ✅ CHANGED: Always shows as complete (even if placeholder)
    console.log(`✓ Image ${i + 1}/${prompts.length} complete`);
    
    if (i < prompts.length - 1) {
      console.log(`\n⏸️ Waiting 3s...\n`);
      await sleep(3000);
    }
  }

  // ✅ CHANGED: Count actual images vs placeholders
  const successCount = results.filter(r => r !== PLACEHOLDER_IMAGE).length;
  const placeholderCount = results.filter(r => r === PLACEHOLDER_IMAGE).length;
  console.log(`\n COMPLETE: ${successCount}/${prompts.length} generated successfully`);
  if (placeholderCount > 0) {
    console.log(` ${placeholderCount} placeholder(s) used`);
  }

  return results;
}

export async function testReplicateAPI() {
  console.log("🔍 Testing Stability AI API...");
  console.log("API Key:", process.env.STABILITY_API_KEY ? "✓ Found" : "✗ Missing");
  return !!process.env.STABILITY_API_KEY;
}