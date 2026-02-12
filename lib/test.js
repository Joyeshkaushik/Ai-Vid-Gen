// test-image-gen.js
import { generateImage, testHordeAPI } from './huggingface.js';

async function test() {
  // First test the API
  await testHordeAPI();
  
  // Then try generating one simple image
  const testPrompt = "A beautiful sunset over the ocean";
  console.log("\n🧪 Testing single image generation...\n");
  
  const result = await generateImage(testPrompt, 0);
  
  if (result) {
    console.log("\n✅ TEST PASSED!");
    console.log("Image URL:", result);
  } else {
    console.log("\n❌ TEST FAILED - check logs above");
  }
}

test();