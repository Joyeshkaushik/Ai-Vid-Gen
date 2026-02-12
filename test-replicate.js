import { generateImage, generateMultipleImages, testReplicateAPI } from './lib/huggingface.js';

async function test() {
  // Test 1: Check API
  console.log("Test 1: API Connection");
  await testReplicateAPI();
  
  // Test 2: Single image
  console.log("\n\nTest 2: Single Image");
  const singleUrl = await generateImage("a beautiful sunset over mountains");
  console.log("Result:", singleUrl);
  
  // Test 3: Multiple images
  console.log("\n\nTest 3: Multiple Images");
  const urls = await generateMultipleImages([
    "a cat in space",
    "a futuristic city",
    "an underwater scene"
  ]);
  console.log("Results:", urls);
}

test();