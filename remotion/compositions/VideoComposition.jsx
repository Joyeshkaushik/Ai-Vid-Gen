import { AbsoluteFill, Audio, Img, useCurrentFrame, useVideoConfig } from "remotion";

export const AIShortComposition = ({ audioUrl, images, captions }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const currentTime = frame / fps;

  // ✅ ADD THIS SAFETY CHECK
  if (!images || images.length === 0 || !images[0]) {
    return (
      <AbsoluteFill style={{ backgroundColor: "#000", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontSize: 32 }}>Generating images...</div>
      </AbsoluteFill>
    );
  }

  // Calculate which image to show
  const totalDuration = durationInFrames / fps;
  const timePerImage = totalDuration / images.length;
  const imageIndex = Math.min(
    Math.floor(currentTime / timePerImage),
    images.length - 1
  );

  // ✅ ADD THIS EXTRA CHECK
  const currentImage = images[imageIndex];
  if (!currentImage) {
    return (
      <AbsoluteFill style={{ backgroundColor: "#000" }}>
        <div style={{ color: "#fff" }}>Loading image {imageIndex + 1}...</div>
      </AbsoluteFill>
    );
  }

  // Find current caption
  const currentCaption = captions?.find(
    (cap) => currentTime >= cap.start && currentTime < cap.end
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* Background Image */}
      <Img
        src={currentImage}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />

      {/* Captions */}
      {currentCaption && (
        <div
          style={{
            position: "absolute",
            bottom: 120,
            left: 0,
            right: 0,
            textAlign: "center",
            padding: "0 40px",
          }}
        >
          <div
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              color: "white",
              fontSize: 56,
              fontWeight: "bold",
              padding: "20px 40px",
              borderRadius: 16,
              display: "inline-block",
              lineHeight: 1.4,
            }}
          >
            {currentCaption.text}
          </div>
        </div>
      )}

      {/* Audio */}
      {audioUrl && <Audio src={audioUrl} />}
    </AbsoluteFill>
  );
};