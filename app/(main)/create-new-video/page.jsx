"use client"
import React, { useState } from 'react'
import Topic from './_components/Topic'
import VideoStyle from './_components/VideoStyle';
import Voice from './_components/Voice';
import Captions from './_components/Captions';
import { Button } from '@/components/ui/button';
import { Loader, Loader2Icon, WandSparkles } from 'lucide-react';
import Preview from './_components/Preview';
import axios from 'axios';
import { api } from '@/convex/_generated/api';
import { useMutation } from 'convex/react';
import { useAuthContext } from '@/app/provider';

function CreateNewVideo() {

  const [formData,setFormData]=useState();
  const {user}=useAuthContext();
  const [loading,setLoading]=useState(false);
  const CreateInitialVideoRecord=useMutation(api.videoData.CreateVideoData)
  
  const onHandleInputChange = (fieldName, fieldValue) => {
    setFormData(prev => ({
      ...(prev ?? {}),
      [fieldName]: fieldValue
    }));
  };

  const GenerateVideo=async()=>{
    console.log("FORM DATA →", formData);
    
    if(user?.credits<=0){
      alert('Please Add More Credits');  // ← Simple alert
      return;
    }
    
    if(!formData?.topic||!formData?.script||!formData?.videoStyle||!formData?.captions||!formData?.voice)
    {
      alert('Please fill in all required fields');  // ← Simple alert
      return;
    }
    
    setLoading(true);

    //Save video data first
    const resp=await CreateInitialVideoRecord({
      title:formData.title,
      topic:formData.topic,
      script:formData.script,
      captions:formData.captions,
      videoStyle:formData.videoStyle,
      voice:formData.voice,
      uid:user._id,
      createdBy:user?.email,
      credits:user?.credits
    });
    
    console.log("--",resp);
    
    const result = await axios.post("/api/generate-video-data", {
      topic: formData.topic,
      script: formData.script,
      captions: formData.captions,
      videoStyle: formData.videoStyle,
      voice: formData.voice,
      recordId:resp,
    });

    console.log(result);
    setLoading(false);
  }

  return (
    <div> 
      <h2 className='text-3xl'>Create New Video</h2>
      <div className='grid grid-cols-1 md:grid-cols-3 mt-8 gap-7'>
        <div className='col-span-2 p-7 border rounded-xl h-[72vh] overflow-auto '>
          <Topic onHandleInputChange={onHandleInputChange}/>
          <VideoStyle onHandleInputChange={onHandleInputChange}/>
          <Voice onHandleInputChange={onHandleInputChange}/>
          <Captions onHandleInputChange={onHandleInputChange}/>
          <Button className='w-full mt-5'
            disabled={loading}
            onClick={GenerateVideo}
            variant="white">
            {loading?<Loader2Icon className='animate-spin'/>:<WandSparkles/>}
            Generate Video
          </Button>
        </div>

        <div>
          <Preview formData={formData}/>
        </div>
      </div>
    </div>
  )
}

export default CreateNewVideo