"use client"
import {useState,useEffect} from 'react'
import dynamic from 'next/dynamic'
import {RxCross2} from 'react-icons/rx'

const CesiumComponent = dynamic(
  () => import('../../CesiumComponent'),
  { ssr: false }
)


export default function CesiumViewer({currentStore,setOpenCesiumViewer,setCurrentStore}) {
  const [currentMap,setCurrentMap] = useState('3d');



return (
  <div className="h-[100%] w-[100%] relative">
    {
      setOpenCesiumViewer &&
      <div onClick={()=>{
        setOpenCesiumViewer(false);
        if(setCurrentStore){
          setCurrentStore('');
        }
      }} className="absolute top-10 
     	z-50 cursor-pointer right-4 p-2 rounded-full hover:bg-gray-300/60 transition-all 
     	duration-200 ease-in-out">
     		<RxCross2 className="text-gray-900 h-8 w-8"/>
     	</div>
    }
    {
      currentStore &&
      <CesiumComponent currentStore={currentStore} />
    }

  </div>
        

)
} 