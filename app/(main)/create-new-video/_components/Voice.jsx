import React, { useState } from 'react'
import { ScrollArea } from "@/components/ui/scroll-area"
const voiceOptions = [
  // Female Voices
  {
    "value": "af_sarah",
    "name": "Sarah (Female)"
  },
  {
    "value": "af_sky",
    "name": "Sky (Female)"
  },
  {
    "value": "af_emma",
    "name": "Emma (Female)"
  },
  {
    "value": "af_aria",
    "name": "Aria (Female)"
  },
  {
    "value": "af_jenny",
    "name": "Jenny (Female)"
  },
  {
    "value": "af_lisa",
    "name": "Lisa (Female)"
  },
  
  // Male Voices
  {
    "value": "am_adam",
    "name": "Adam (Male)"
  },
  {
    "value": "am_michael",
    "name": "Michael (Male)"
  },
  {
    "value": "am_ryan",
    "name": "Ryan (Male)"
  },
  {
    "value": "am_eric",
    "name": "Eric (Male)"
  },
  {
    "value": "am_brian",
    "name": "Brian (Male)"
  },
  
  // Indian English Voices
  {
    "value": "in_ravi",
    "name": "Ravi (Male - Indian)"
  },
  {
    "value": "in_priya",
    "name": "Priya (Female - Indian)"
  },
  
  // British Accent (Clear for Indian audiences)
  {
    "value": "gb_george",
    "name": "George (Male - British)"
  },
  {
    "value": "gb_sonia",
    "name": "Sonia (Female - British)"
  }
]
function Voice({onHandleInputChange}) {
  const[selectedVoice,setSelectedVoice]=useState()
  return (
    <div className='mt-5'>
      <h2>Video Voice</h2>
      <p className='text-sm text-gray-400'>Select voice for your video</p>
      <ScrollArea className='h-[200px] w-full p-4'>
      <div className='grid grid-cols-2 gap-3'>
        {voiceOptions.map((voice,index)=>(
        
            <h2 className={`cursor-pointer  p-3
             dark:bg-slate-900 rounded-lg 
             hover:border dark:border-white ${voice.name==selectedVoice&&'border'}`}
             onClick={()=>{setSelectedVoice(voice.name)
              onHandleInputChange('voice',voice.value)
             }}
              key={index}>{voice.name}</h2>
            

        ))}
      </div>
      </ScrollArea>
    </div>
  )
}

export default Voice