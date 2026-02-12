"use client"
import React, { useEffect, useState } from 'react'
import { AbsoluteFill, Img, Sequence, useVideoConfig, continueRender, delayRender, useCurrentFrame, interpolate, Audio } from 'remotion';

function RemotionComposition({videoData}) {
     const {fps, durationInFrames} = useVideoConfig();
     const [handle] = useState(() => delayRender());
     const frame = useCurrentFrame();
     
     // ✅ Parse captions
     let captions = [];
     try {
         const captionData = videoData?.captionJson;
         
         if (captionData) {
             if (typeof captionData === 'string') {
                 captions = JSON.parse(captionData);
             } else if (Array.isArray(captionData)) {
                 captions = captionData;
             }
         }
     } catch (error) {
         console.error('Error parsing captions:', error);
     }
     
     // ✅ FIXED: Parse images - extract imageUrl from objects
     let imageList = [];
     try {
         const rawImages = videoData?.images;
         
         if (typeof rawImages === 'string') {
             const parsed = JSON.parse(rawImages);
             imageList = Array.isArray(parsed) 
                 ? parsed.map(item => {
                     if (typeof item === 'string') return item;
                     if (item?.imageUrl) return item.imageUrl;
                     return null;
                   })
                 : [];
         } else if (Array.isArray(rawImages)) {
             // FIXED: Extract imageUrl from each object
             imageList = rawImages.map(item => {
                 if (typeof item === 'string') return item;
                 if (item?.imageUrl) return item.imageUrl;
                 return null;
             });
         }
         
         imageList = imageList.filter(Boolean);
         
         console.log('📸 Images to render:', imageList);
         console.log('📸 First image preview:', imageList[0]?.substring(0, 100));
     } catch (error) {
         console.error('Error parsing images:', error);
     }

     // ✅ Simplified preload - base64 images load instantly
     useEffect(() => {
         // For base64 images, no need to preload
         continueRender(handle);
     }, [handle]);
     
     const getCurrentCaption = () => {
        const currentTime = frame / fps;
        const currentCaption = captions?.find((item) => 
            currentTime >= item?.start && currentTime <= item?.end
        );
        
        return currentCaption?.word || '';
     }
     
     // ✅ REMOVED: Don't block rendering when no images
     // Just show black background with captions and audio

     const currentCaption = getCurrentCaption();
     const totalDuration = durationInFrames;
     
     return (
        <AbsoluteFill>
            <AbsoluteFill style={{backgroundColor: '#000'}}>
                 {imageList && imageList.length > 0 && imageList.map((imageUrl, index) => {
                    const durationPerImage = Math.floor(totalDuration / imageList.length);
                    const startTime = index * durationPerImage;
                    const isLastImage = index === imageList.length - 1;
                    const imageDuration = isLastImage 
                        ? totalDuration - startTime
                        : durationPerImage;

                    const scale = interpolate(
                        frame,
                        [startTime, startTime + imageDuration / 2, startTime + imageDuration],
                        index % 2 === 0 ? [1, 1.8, 1] : [1.8, 1, 1.8],
                        {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
                    )
                    
                    return(
                        <Sequence 
                            key={index} 
                            from={startTime} 
                            durationInFrames={imageDuration}
                        >
                            <AbsoluteFill style={{backgroundColor: '#1a1a1a'}}>
                                <Img
                                    src={imageUrl}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        transform: `scale(${scale})`
                                    }}
                                    onError={() => {
                                        console.error(`❌ Failed to load image ${index}`);
                                    }}
                                />
                            </AbsoluteFill>
                        </Sequence>
                    )
                 })}
            </AbsoluteFill>
            
            <AbsoluteFill style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-end',
                paddingBottom: '100px',
                zIndex: 10
            }}>
               {currentCaption && (
                   <div style={{
                       color: '#FFFF00',
                       fontSize: '60px',
                       fontWeight: 'bold',
                       textAlign: 'center',
                       textTransform: 'uppercase',
                       padding: '20px 40px',
                       backgroundColor: 'rgba(0, 0, 0, 0.8)',
                       borderRadius: '10px',
                       textShadow: '3px 3px 6px rgba(0, 0, 0, 0.8)',
                       maxWidth: '80%',
                       fontFamily: 'Arial, sans-serif',
                   }}>
                       {currentCaption}
                   </div>
               )}
            </AbsoluteFill>
            
            {videoData?.audioUrl && <Audio src={videoData?.audioUrl} />}
        </AbsoluteFill>
     )
}

export default RemotionComposition