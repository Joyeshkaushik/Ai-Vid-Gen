import React from 'react';
import { Composition } from 'remotion';
import { MyComposition } from './Composition';
import RemotionComposition from '../app/_components/RemotionComposition';

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="Empty"
        component={MyComposition}
        durationInFrames={60}
        fps={30}
        width={1280}
        height={720}
      />

      <Composition
        id="AIShort"
        component={RemotionComposition}
        durationInFrames={1800}
        fps={30}
        width={1080}
        height={1920}
        calculateMetadata={({ props }) => {
          let captions = [];
          
          try {
            const captionData = props.videoData?.captionJson;
            
            if (typeof captionData === 'string') {
              captions = JSON.parse(captionData);
            } else if (Array.isArray(captionData)) {
              captions = captionData;
            }
          } catch (e) {
            console.error('Error parsing captions in calculateMetadata:', e);
          }
          
          const fps =30;
          let duration = 1800;
          
          if (captions.length > 0) {
            const lastWord = captions[captions.length - 1];
            if (lastWord && lastWord.end) {
              duration = Math.ceil(lastWord.end * fps);
              console.log(`calculateMetadata: Audio duration is ${lastWord.end}s = ${duration} frames`);
            }
          } else {
            console.log('calculateMetadata: No captions found, using default duration');
          }
          
          return {
            durationInFrames: duration,
            fps: 30,
          };
        }}
        defaultProps={{
          videoData: {
            audioUrl: '',
            images: '[]',
            captionJson: '[]'
          }
        }}
      />
    </>
  );
};