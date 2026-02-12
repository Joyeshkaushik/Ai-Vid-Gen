import { inngest } from "@/inngest/client";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { audioUrl, images, captions } = body;

    if (!audioUrl || !images || !captions) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate unique video ID
    const videoId = `video-${Date.now()}`;

    // Trigger Inngest rendering
    await inngest.send({
      name: "video/render",
      data: {
        videoId,
        audioUrl,
        images,
        captions,
      },
    });

    return NextResponse.json({
      success: true,
      videoId,
      message: "Video rendering started!",
    });
  } catch (error) {
    console.error("Error triggering video render:", error);
    return NextResponse.json(
      { success: false, error: "Failed to start rendering" },
      { status: 500 }
    );
  }
}