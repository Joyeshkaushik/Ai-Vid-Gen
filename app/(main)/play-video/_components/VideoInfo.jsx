"use client"
import { Button } from '@/components/ui/button'
import { ArrowLeft, DownloadIcon } from 'lucide-react'
import React, { useState } from 'react'
import Link from 'next/link'

function VideoInfo({videoData}) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    try {
      const videoUrl = videoData?.videoUrl;
      
      if (!videoUrl) {
        alert('Video URL not found. Please ensure the video has been generated.');
        return;
      }

      setIsDownloading(true);

      // Fetch the video from Cloudinary
      const response = await fetch(videoUrl);
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${videoData?.title || 'video'}.mp4`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      window.URL.revokeObjectURL(url);
      setIsDownloading(false);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download video. Please try again.');
      setIsDownloading(false);
    }
  };

  return (
    <div className='p-5 border rounded-xl'>
        <Link href={'/dashboard'}>
        <h2 className='flex gap-2 items-center'>
            <ArrowLeft/>
            Back to Dashboard
        </h2>
        </Link>
        <div className='flex flex-col gap-3'>
        <h2 className='mt-5'>Project Name:{videoData?.title}</h2>
        <p className='text-gray-500'> Script:{videoData?.script}</p>
        <h2>Video Style:{videoData?.videoStyle}</h2>
        <Button 
          variant="white" 
          onClick={handleDownload}
          disabled={isDownloading || !videoData?.videoUrl}
        >
          <DownloadIcon className={isDownloading ? 'animate-spin' : ''}/>
          {isDownloading ? 'Downloading...' : 'Export & Download'}
        </Button>
        </div>
    </div>
  )
}

export default VideoInfo