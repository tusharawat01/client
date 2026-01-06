"use client"
import {useState,useEffect} from 'react'
import dynamic from 'next/dynamic'

const CesiumComponent = dynamic(
  () => import('../../components/CesiumComponent'),
  { ssr: false }
)

export default function Home() {
  const [currentMap,setCurrentMap] = useState('3d');


return (
  <div className="h-[100vh] w-[100%] relative">
    
      <CesiumComponent />

  </div>
        

)
} 