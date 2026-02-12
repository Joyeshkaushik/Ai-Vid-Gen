import { Button } from '@/components/ui/button'
import React from 'react'
import Authentication from './Authentication'

function Hero() {
  return (
    <div className='p-10 flex flex-col items-center justify-center mt-24 
    md:px-20 lg:px-36 xl:px-48'>
        <h2 className='font-bold text-6xl text-center'>AI Youtube Short Video Generator</h2>
        <p className='mt-4 text-2xl text-center text-gray-500'>AI genrates scripts,images,and voiceovers in seconds. Create,edit,and publish engaging shorts with ease.!

        </p>
        <div className='mt-7 gap-8 flex '>
          <Authentication>
             <Button size="lg" className='w-42 h-14 bg-white text-black font-bold rounded-full'>Get started</Button>
          </Authentication>
             
             <Button size="lg" variant="secondary" className="w-42 h-14 bg-black text-white rounded-full font-bold">Explore</Button>
           
        </div>
        </div>
  )
}

export default Hero