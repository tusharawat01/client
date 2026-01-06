"use client"
import {useRef} from 'react'

export default function RootLayout({ children }) {
  const dragRef = useRef()
  return (
      <main ref={dragRef} className="flex h-screen flex-col bg-[#292929] items-center justify-between">
        
        <main className="flex h-full w-full">
          {children}
        </main>
      </main>
  )
}
