"use client"
import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useConvex } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useAuthContext } from '@/app/provider';
import moment from 'moment/moment';
import { RefreshCcw } from 'lucide-react';

function VideoList() {
    const [videoList, setVideoList] = useState([]);
    const convex = useConvex();
    const {user} = useAuthContext();

    useEffect(() => {
        if(user?._id) {
            GetUserVideoList();
        }
    }, [user])
    
    const GetUserVideoList = async() => {
        const result = await convex.query(api.videoData.GetUserVideos, {
            uid: user?._id
        });
        setVideoList(result); 
        const isPendingVideo = result?.find((item) => item.status === 'pending');
        if(isPendingVideo) {
            GetpendingVideoStatus(isPendingVideo);
        }
        console.log('Full video list:', result);
    }
    
    const GetpendingVideoStatus = (pendingVideo) => {
        const intervalId = setInterval(async() => {
            //get video data by id
            const result = await convex.query(api.videoData.GetVideoById, {
                videoId: pendingVideo?._id
            })
            if(result?.status === 'completed') {
                clearInterval(intervalId);
                console.log("Video Process Completed");
                GetUserVideoList();
            }
            console.log('still pending');
        }, 5000)
    }
    
    return (
        <div className='p-4'>
            {videoList?.length === 0 ? (
                <div className='flex flex-col items-center justify-center mt-28 gap-5 p-5 border border-dashed rounded-xl py-16'>
                    <Image 
                        src={'/logo.svg'}
                        alt='logo' 
                        width={60} 
                        height={60}
                    />
                    <h2 className='text-gray-400 text-lg'>You dont have any video created. Create new one</h2>
                    <Link href={'/create-new-video'}>
                        <Button variant="white">+Create New Video</Button>
                    </Link>
                </div>
            ) : (
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 mt-6'>
                    {videoList?.map((video) => {
                        // Parse the images JSON string
                        let parsedImages = [];
                        try {
                            parsedImages = typeof video.images === 'string' 
                                ? JSON.parse(video.images) 
                                : video.images;
                        } catch (error) {
                            console.error('Error parsing images:', error);
                        }
                        
                        const imageUrl = parsedImages?.[0]?.imageUrl;
                        
                        // Check if image is a placeholder (old placehold.co or new via.placeholder.com)
                        const isPlaceholder = imageUrl?.includes('placehold.co') || imageUrl?.includes('via.placeholder.com');
                        
                        return (
                            <Link 
                                key={video._id} 
                                href={`/play-video/${video._id}`}
                            >
                                <div className='cursor-pointer border rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-shadow duration-300 bg-white'>
                                    <div className='relative w-full aspect-video overflow-hidden bg-gray-100'>
                                        {video?.status === 'completed' && imageUrl ? (
                                            <>
                                                <Image 
                                                    src={imageUrl}
                                                    alt={video?.title || 'Video thumbnail'}
                                                    fill
                                                    unoptimized={isPlaceholder}  // ← ADD THIS LINE
                                                    className='object-cover'
                                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, (max-width: 1536px) 25vw, 20vw"
                                                />
                                                {/* Dark gradient overlay for better text readability */}
                                                <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent'></div>
                                            </>
                                        ) : (
                                            <div className='w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50'>
                                                <RefreshCcw className='w-12 h-12 text-blue-500 animate-spin mb-3'/>
                                                <h2 className='text-lg font-semibold text-gray-700'>Generating...</h2>
                                                <p className='text-sm text-gray-500 mt-1'>Please wait</p>
                                            </div>
                                        )}
                                        
                                        {/* Title and time overlay - ONLY on image */}
                                        <div className='absolute bottom-0 left-0 right-0 p-4 text-white'>
                                            <h3 className='font-semibold text-base line-clamp-2 mb-1'>
                                                {video?.title}
                                            </h3>
                                            <p className='text-xs text-gray-200'>
                                                {moment(video?._creationTime).fromNow()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    )
}

export default VideoList