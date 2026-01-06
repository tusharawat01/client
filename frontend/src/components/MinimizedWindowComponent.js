"use client"
import {useEffect} from 'react'

export default function MinimizedWindowComponent({
	setMinimizeWindow,
	FiVideoOff,
	permissionGranted,
	myStream
}) {
	
	useEffect(()=>{
		const minStream = document.getElementById('videoMainStreamMinimized');
		minStream.srcObject = myStream
	},[])


	return (
		<div 
		onClick={()=>setMinimizeWindow(false)}
		className="h-[150px] cursor-pointer relative md:aspect-[16/9] mx-auto sm:aspect-[9/16] sm:w-auto w-full overflow-hidden">
			{
				!permissionGranted && 
				<div className="h-full w-full top-0 left-0 z-30 bg-gray-900 flex items-center justify-center flex-col">
					<FiVideoOff className="h-[40] w-[40] text-gray-200"/>
					<h1 className="md:text-md text-sm mt-4 text-gray-200">Camera blocked/Not allowed</h1>
					<p className="md:text-sm text-md text-gray-600">Could not connect to call</p>
				</div>
			}
			<video id="videoMainStreamMinimized" 
			className="h-full w-full object-cover object-center bg-black" src=""></video>
		</div>
	)
}