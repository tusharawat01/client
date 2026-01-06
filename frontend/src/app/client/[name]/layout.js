


"use client"
// import Sidebar from '../../components/Sidebar'
import {useRef} from 'react'

export default function RootLayout({ children }) {
  const dragRef = useRef()
  return (
      <main ref={dragRef} className="flex h-screen flex-col bg-[#1f1f1f] items-center justify-between">
        <main className="flex h-full w-full">
          {/*<Sidebar dragRef={dragRef} />*/}
          {children}
        </main>
      </main>
  )
}
