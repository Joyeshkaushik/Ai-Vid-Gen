import { inngest } from "./client";
import axios from "axios";
import { generateAudio } from "@/lib/tts";
import { data } from "autoprefixer";
import { createClient } from "@deepgram/sdk";
export const runtime = "nodejs";
import { GenerateImageScript } from "@/configs/AiModel";
import { generateMultipleImages } from "@/lib/huggingface";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import path from "path";
import fs from "fs";
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME?.trim(),
  api_key: process.env.CLOUDINARY_API_KEY?.trim(),
  api_secret: process.env.CLOUDINARY_API_SECRET?.trim(),
});

const ImagePromptScript=`Generate Image prompt of{style} style with all details for each scene for 30 seconds video:script:{script}
-Just Give specifying image prompt depends on the story line
-do not give camera angle image prompt
-Follow the Following schema and return JSON data(Max 4-5 Images)
-[
{
 imagePrompt:'',
 sceneContent:'<Script Content>'
}

]`


export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { message: `Hello ${event.data.email}!` };
  },
);

export const GenerateVideoData=inngest.createFunction(
    {id:'generate-video-data'},
    {event:'generate-video-data'},
    async({event,step})=>{
       const { script, topic, title, caption, videoStyle, voice, recordId } = event?.data;
        const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL)
    
    if (!script) {
      throw new Error("GenerateVideoData: 'script' is missing in event.data");
    }

        const GenerateAudioFile=await step.run(
            "GenerateAudioFile",
            async()=>{
               const voiceCode = voice === "en-US-AriaNeural" ? "en-IN" : voice;
                return await generateAudio(
          script,
          voiceCode || "en-IN"
        );
                
            }
        )
     

        const GenerateCaptions=await step.run(
          "generateCaptions",
          async()=>{
            const deepgram=createClient(process.env.DEEPGRAM_API_KEY);
             const { result, error } = await deepgram.listen.prerecorded.transcribeUrl(
           { 
             url: GenerateAudioFile },
           {
           model: "nova-2",
         }
        );
       const words = result?.results?.channels?.[0]?.alternatives?.[0]?.words || [];
      
       return {
             words
          };
          }
        )

        const GetVideoDuration = await step.run(
          "calculateVideoDuration",
          async () => {
            const words = GenerateCaptions.words;
            if (words && words.length > 0) {
              const lastWord = words[words.length - 1];
              const audioDuration = lastWord.end;
              const fps = 30;
              const durationInFrames = Math.ceil(audioDuration * fps);
              
              console.log(`Calculated video duration: ${audioDuration}s = ${durationInFrames} frames`);
              
              return {
                audioDuration,
                durationInFrames,
                fps
              };
            }
            
            console.log("No captions found, using default duration");
            return {
              audioDuration: 30,
              durationInFrames: 900,
              fps: 30
            };
          }
        );
        
        const GenerateImagePrompts=await step.run(
          "generateImagePrompt",
          async()=>{
            const FINAL_PROMPT=ImagePromptScript
              .replace('{style}', videoStyle || 'cinematic')
              .replace('{script}', script);
            
            const resp = await GenerateImageScript(FINAL_PROMPT);
            
            return resp;
          }
        )
        
        const GeneratedImages = await step.run(
      "generateImages",
      async () => {
        console.log("STEP: generateImages STARTED");
        try {
          const imagePrompts = GenerateImagePrompts.map(item => item.imagePrompt);
          
          console.log("Image prompts:", imagePrompts);
          
          const imageUrls = await generateMultipleImages(imagePrompts);
          console.log("Image URLs returned:", imageUrls);
          
          // ✅ FIXED: Validate that we got real Cloudinary URLs
          const hasValidImages = imageUrls && 
                                 imageUrls.length > 0 && 
                                 imageUrls.every(url => url && url.includes('cloudinary.com'));
          
          if (!hasValidImages) {
            console.log("⚠️ Image generation returned invalid URLs, returning null");
            return null; // Return null instead of placeholders
          }
          
          const imagesWithMetadata = GenerateImagePrompts.map((item, index) => ({
            imagePrompt: item.imagePrompt,
            sceneContent: item.sceneContent,
            imageUrl: imageUrls[index],
          }));
          
          console.log("✅ Images with metadata:", imagesWithMetadata);
          
          return imagesWithMetadata;
        } catch(error) {
          console.error("❌ Image generation step failed:", error.message);
          console.log("⚠️ Returning null - placeholders will be added by backend");
          return null; // Return null instead of placeholders
        }
      }
    )


    const UpdateDB = await step.run(
      'UpdateDB',
      async () => {
        console.log("First update: Saving audio, captions, and images...");
        
        // ✅ FIXED: Only send images if they were actually generated
        const updateData = {
          recordId: recordId,
          audioUrl: GenerateAudioFile,
          captionJson: JSON.stringify(GenerateCaptions.words),
        };
        
        // Only add images if they exist and are valid
        if (GeneratedImages && Array.isArray(GeneratedImages) && GeneratedImages.length > 0) {
          updateData.images = JSON.stringify(GeneratedImages);
          console.log("✅ Sending real generated images to database");
        } else {
          console.log("⚠️ No valid images - database will use placeholders");
          // Don't send images field at all, let backend handle placeholders
        }
        
        const result = await convex.mutation(api.videoData.UpdateVideoRecord, updateData);
        console.log("First update complete");
        return result;
      }
    )

    const bundleLocation = await step.run("bundle-remotion", async () => {
      console.log("Bundling Remotion...");
      const bundlePath = await bundle({
        entryPoint: path.join(process.cwd(), "remotion/index.js"),
        webpackOverride: (config) => config,
      });
      console.log("Bundle created at:", bundlePath);
      return bundlePath;
    });

    const composition = await step.run("select-composition", async () => {
      console.log("Selecting composition...");
      
      // ✅ FIXED: Use placeholders for composition if no images
      const imagesToUse = GeneratedImages || [
        { imageUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYGD4DwABBAEAW9Essential" },
        { imageUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYGD4DwABBAEAW9Essential" },
        { imageUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYGD4DwABBAEAW9Essential" }
      ];
      
      const comp = await selectComposition({
        serveUrl: bundleLocation,
        id: "AIShort",
        inputProps: {
          videoData: {
            audioUrl: GenerateAudioFile,
            images: JSON.stringify(imagesToUse),
            captionJson: JSON.stringify(GenerateCaptions.words),
          }
        },
      });
      console.log("Composition selected:", comp);
      console.log("Composition default duration:", comp.durationInFrames, "frames");
      return comp;
    });

    const videoResult = await step.run("render-video", async () => {
      const outputDir = path.join(process.cwd(), "public/videos");
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      console.log("Rendering video... This may take 2-5 minutes");
      console.log(`Duration: ${GetVideoDuration.audioDuration}s (${GetVideoDuration.durationInFrames} frames)`);
      
      const outputLocation = path.join(outputDir, `${recordId}.mp4`);

      // ✅ FIXED: Use placeholders for rendering if no images
      const imagesToRender = GeneratedImages || [
       
  { imageUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAI/hLGeYQAAAABJRU5ErkJggg==" },
  { imageUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAI/hLGeYQAAAABJRU5ErkJggg==" },
  { imageUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAI/hLGeYQAAAABJRU5ErkJggg==" }
];
      

      await renderMedia({
        composition: {
          ...composition,
          durationInFrames: GetVideoDuration.durationInFrames,
        },
        serveUrl: bundleLocation,
        codec: "h264",
        outputLocation,
        inputProps: {
          videoData: {
            audioUrl: GenerateAudioFile,
            images: JSON.stringify(imagesToRender),
            captionJson: JSON.stringify(GenerateCaptions.words),
          }
        },
      });

      console.log("Video rendered successfully!");
      console.log(`Local file saved to: ${outputLocation}`);

      console.log("Uploading to Cloudinary...");
      const upload = await cloudinary.uploader.upload(outputLocation, {
        folder: "ai-videos",
        public_id: `video_${recordId}`,
        overwrite: true,
        resource_type: "video",
      });

      console.log("Uploaded to Cloudinary:", upload.secure_url);

      try {
        fs.unlinkSync(outputLocation);
        console.log("Local file cleaned up");
      } catch (error) {
        console.log("Could not delete local file:", error.message);
      }

      return {
        success: true,
        videoUrl: upload.secure_url,
        cloudinaryPublicId: upload.public_id,
        filePath: outputLocation,
        duration: GetVideoDuration.audioDuration,
        durationInFrames: GetVideoDuration.durationInFrames,
      };
    });

    const FinalUpdate = await step.run(
      'UpdateVideoUrl',
      async () => {
        console.log("Final update: Adding video URL...");
        const result = await convex.mutation(api.videoData.UpdateVideoRecord, {
          recordId: recordId,
          videoUrl: videoResult.videoUrl
        });
        console.log("Final update complete with video URL:", videoResult.videoUrl);
        return result;
      }
    )

       console.log("AUDIO URL:", GenerateAudioFile);
       console.log("CAPTIONS:", GenerateCaptions);
       console.log("IMAGE PROMPTS:", GenerateImagePrompts);
       console.log("VIDEO DURATION:", GetVideoDuration);
       console.log("VIDEO RESULT:", videoResult);

        return {
          GenerateCaptions,
          GenerateImagePrompts,
          GenerateAudioFile,
          GeneratedImages,
          GetVideoDuration,
          UpdateDB,
          videoResult,
          FinalUpdate
        }
    }
)