import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const videoId = searchParams.get("videoId");

  if (!videoId) {
    return NextResponse.json(
      { error: "No videoId provided" }, 
      { status: 400 }
    );
  }

  const videoPath = path.join(process.cwd(), "public/videos", `${videoId}.mp4`);
  const exists = fs.existsSync(videoPath);

  return NextResponse.json({
    ready: exists,
    videoUrl: exists ? `/videos/${videoId}.mp4` : null,
  });
}