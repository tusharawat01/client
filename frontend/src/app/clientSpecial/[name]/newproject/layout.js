"use client"
import {useRef} from 'react'

export default function RootLayout({ children }) {
  const dragRef = useRef()
  return (
      <main ref={dragRef} className="flex h-screen flex-col bg-white overflow-y-auto 
      items-center w-full justify-between">
        <main className="flex h-full flex-col w-full">
          {children}
        </main>
      </main>
  )
}
