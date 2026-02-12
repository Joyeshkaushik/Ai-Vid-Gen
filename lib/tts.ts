import axios from "axios";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dwvuxtauu",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const MAX_CHARS = 200; // ✅ Google-safe limit
const TIMEOUT = 30000;

// Voice → language mapping (Google only supports language)
const VOICE_TO_LANG_MAP: Record<string, string> = {
  af_sarah: "en",
  af_sky: "en",
  af_emma: "en",
  af_aria: "en",
  af_jenny: "en",
  af_lisa: "en",

  am_adam: "en",
  am_michael: "en",
  am_ryan: "en",
  am_eric: "en",
  am_brian: "en",

  in_ravi: "en",
  in_priya: "en",

  gb_george: "en",
  gb_sonia: "en",
};

export async function generateAudio(
  text: string,
  voiceOrLang: string = "en"
): Promise<string> {
  if (!text || typeof text !== "string") {
    throw new Error("Text must be a non-empty string");
  }

  // ✅ SAFE sanitization for Google TTS
  text = text
    .replace(/<\/?[^>]+(>|$)/g, "") // remove HTML
    .replace(/\s+/g, " ")
    .trim();

  if (!text) {
    throw new Error("Text cannot be empty after sanitization");
  }

  if (text.length > MAX_CHARS) {
    console.warn(`[TTS] Truncating text from ${text.length} → ${MAX_CHARS}`);
    text = text.slice(0, MAX_CHARS);
  }

  // Resolve language
  let googleLang =
    VOICE_TO_LANG_MAP[voiceOrLang] ||
    voiceOrLang.split("-")[0].toLowerCase();

  if (!/^[a-z]{2}$/.test(googleLang)) {
    console.warn(`[TTS] Invalid language "${googleLang}", falling back to "en"`);
    googleLang = "en";
  }

  try {
    console.log(`[TTS] Language: ${googleLang}`);
    console.log(`[TTS] Text (${text.length} chars): ${text.slice(0, 60)}...`);

    const audioUrl = generateGoogleTTSUrl(text, googleLang);

    const response = await axios.get(audioUrl, {
      responseType: "arraybuffer",
      timeout: TIMEOUT,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0",
        Accept: "audio/mpeg",
        Referer: "https://translate.google.com/",
      },
    });

    if (!response.data || response.data.length < 500) {
      throw new Error("Invalid or empty audio received");
    }

    return await uploadToCloudinary(response.data);
  } catch (err: any) {
    console.error("[TTS ERROR]", err?.message || err);
    throw new Error("Invalid request to TTS API");
  }
}

function generateGoogleTTSUrl(text: string, lang: string) {
  return `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(
    text
  )}&tl=${lang}&client=tw-ob`;
}

async function uploadToCloudinary(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        resource_type: "video",
        folder: "tts",
        format: "mp3",
      },
      (err, result) => {
        if (err || !result?.secure_url) {
          reject(err || new Error("Cloudinary upload failed"));
        } else {
          resolve(result.secure_url);
        }
      }
    ).end(buffer);
  });
}

export async function generateAudioWithRetry(
  text: string,
  voiceOrLang = "en",
  retries = 3
): Promise<string> {
  let lastError: any;

  for (let i = 1; i <= retries; i++) {
    try {
      console.log(`[TTS] Attempt ${i}/${retries}`);
      return await generateAudio(text, voiceOrLang);
    } catch (err) {
      lastError = err;
      await new Promise((r) => setTimeout(r, i * 1000));
    }
  }

  throw lastError;
}

export default generateAudio;
