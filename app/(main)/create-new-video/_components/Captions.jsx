import React, { useState } from 'react'
const options=[
    {
        name:'Youtuber',
       style:'text-yellow-400 text-3xl font-extrabold uppercase'
    },
    {
        name:'Supreme',
        style:'text-white text-3xl font-bold italic drop-shadow-lg'
    },
    {
        name:'Neon',
        style:'text-green-500 text-3xl font-extrabold uppercase'
    },
    {
        name:'Glitch',
        style:'text-pink-500 text-3xl font-extrabold uppercase'
    },
    {
        "name":"Fire",
        "style":"text-red-500 text-3xl font-extrabold uppercase"
    }

]
function Captions({onHandleInputChange}) {
    const [selectedCaptionStyle,SetSelectedCaptionStyle]=useState();
  return (
    <div className='mt-5'>
        <h2>Caption Style</h2>
        <p className='text-sm text-gray-400'>Select caption Style</p>
        <div className='flex flex-wrap gap-4 mt-2'>
            {options.map((option,index)=>(
                <div key={index}
                onClick={()=>{
                    SetSelectedCaptionStyle(option.name)
                    onHandleInputChange('captions',option.name)
                }}
                 className={`p-2 cursor-pointer
                bg-slate-900 border-gray-300 rounded-lg hover:border
                ${selectedCaptionStyle==option.name&&'border'}`}>
                    <h2 className={option.style}>{option.name}</h2>
                    </div>
            ))}
        </div>
    </div>
  )
}

export default Captions