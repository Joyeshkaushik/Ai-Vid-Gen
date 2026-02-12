"use client"
import React, { useState, useEffect } from 'react'
import { Player } from "@remotion/player";
import RemotionComposition from '@/app/_components/RemotionComposition';

function RemotionPlayer({videoData}) {
  const [durationInFrames, setDurationInFrames] = useState(1800);

  useEffect(() => {
    if (videoData?.captionJson) {
      try {
        let captions = [];
        
        if (typeof videoData.captionJson === 'string') {
          captions = JSON.parse(videoData.captionJson);
        } else if (Array.isArray(videoData.captionJson)) {
          captions = videoData.captionJson;
        }
        
        if (captions.length > 0) {
          const lastWord = captions[captions.length - 1];
          if (lastWord && lastWord.end) {
            const fps = 30;
            const calculatedDuration = Math.ceil(lastWord.end * fps);
            setDurationInFrames(calculatedDuration);
            console.log(`Player: Calculated duration ${lastWord.end}s = ${calculatedDuration} frames`);
          }
        }
      } catch (error) {
        console.error('Error calculating duration in player:', error);
      }
    }
  }, [videoData]);

  // ✅ Debug: Log what data we're passing to the player
  useEffect(() => {
    console.log('🎬 RemotionPlayer received videoData:', videoData);
    console.log('🖼️ Images in videoData:', videoData?.images);
    console.log('🎵 Audio in videoData:', videoData?.audioUrl);
  }, [videoData]);

  return (
    <div>
      <Player
        component={RemotionComposition}
        durationInFrames={durationInFrames}
        compositionWidth={720}
        compositionHeight={1280}
        fps={30}
        controls
        style={{
          width:'25vw',
          height:'70vh'
        }}
        inputProps={{
          videoData: videoData // This should have images, audioUrl, captionJson
        }}
         renderLoading={() => <div style={{color: 'white'}}>Loading images...</div>}
  errorFallback={({ error }) => {
    console.error('Player error:', error);
    return <div style={{color: 'red'}}>Error: {error.message}</div>;
  }}
      />
    </div>
  )
}

export default RemotionPlayer