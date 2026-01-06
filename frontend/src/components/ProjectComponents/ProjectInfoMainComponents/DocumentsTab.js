"use client"

import {LuMaximize2} from 'react-icons/lu'
import {GrCloudDownload} from 'react-icons/gr';
import {BsCloudDownload} from 'react-icons/bs';
import {AiOutlineLink,AiOutlineFilePdf} from 'react-icons/ai';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import {BsImages} from 'react-icons/bs';
import ReactPlayer from 'react-player';


export default function DocumentsTab({attachments}) {
	// body...

	function processString(inputString) {
	    const parts = inputString.split('_');

	    parts.pop();

	    const resultString = parts.join(' ');

	    return resultString;
	}

	return (
		<div className="w-full" >
			{
				attachments?.length > 0 &&
				<>
				<h1 className="text-lg font-semibold text-black hover:underline flex items-center gap-1">
				<AiOutlineLink className="h-5 w-5"/> Attachments ({attachments?.length}) </h1>
				<div className="h-[1px] w-[98%] mx-auto my-3 bg-[#EBE8FF]"/>
				<h1 className="text-lg font-semibold mb-2 text-black hover:underline flex items-center gap-1">
				<BsImages className="h-5 w-5"/> Media</h1>
				<div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-3 p-2">
				 {
					attachments?.map((req,j)=>{
						if(req.includes('jpg') || req.includes('jpeg') || req.includes('png') || req.includes('svg')){
							return (
								<div key={j} className="">
									<div className="relative group overflow-hidden">
										<a href={req} target="_blank"><div className="absolute opacity-0 rounded-md h-full w-full z-30 bg-black/30 
										hover:opacity-[100%] transition-all duration-200 ease-in-out cursor-pointer flex items-end p-3 justify-end">
											<div className="hover:bg-white/10 transition-all duration-200 ease-in-out p-1 rounded-full">
												<LuMaximize2 className="text-white h-5 w-5"/>
											</div>
										</div></a>
										<img src={req} alt="" className="hover:opacity-[90%] cursor-pointer transition-all duration-200 ease-in-out rounded-md" />
									</div>

								</div>
							)
						}
					})
				} 
				</div>

				<div className="p-2 grid grid-cols-2">
				{
					attachments?.map((req,j)=>{
						if(req.includes('mp4') || req.includes('mpeg')){
							return (
								<div key={j} className="relative group overflow-hidden">
									<ReactPlayer url={req} width='100%'
									height='250px' />
								</div>
							)
						}
					})
				} 
				</div>

				<div className="h-[1px] w-[98%] mx-auto my-3 bg-[#EBE8FF]"/>
				<h1 className="text-lg font-semibold mb-2 text-black hover:underline flex items-center gap-1">
				<AiOutlineFilePdf className="h-5 w-5"/> PDFs</h1>
				<div className="px-2 grid lg:grid-cols-2 grid-cols-1 gap-3">
					{
						attachments?.map((req,j)=>{
							if(req?.includes('.pdf')){
								return (
									<div key={j} className="h-[400px] w-full sm:rounded-3xl 
									border-[1px] border-gray-300/50 bg-white pt-3 pb-1 overflow-hidden">
										<h1 className="text-sm px-5 py-2 text-gray-600">{req?.split('/')[req?.split('/').length - 1]} <a target="_blank" href={req}><span className="text-sky-600 hover:underline">Open</span></a>  </h1>
										<div className="h-full w-full overflow-y-auto">
											<Worker className="w-full" workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
												<Viewer fileUrl={req} />
											</Worker>
										</div>
									</div>
								)
							}
						})
					}
				</div>

				<div className="h-[1px] w-[98%] mx-auto my-3 bg-[#EBE8FF]"/>
				<h1 className="text-md font-semibold mb-2 text-black hover:underline flex items-center gap-1">
				<AiOutlineFilePdf className="h-5 w-5"/> Download attachments</h1>
				<div className="flex flex-col gap-2">
					{
						attachments?.map((attachment,k)=>{


							return (
								<div key={k} className="flex items-center gap-2 text-sm">
									<GrCloudDownload className="h-4 w-4 text-gray-500"/>
									<h1 className="text-gray-800">{processString(attachment.split('/')[attachment?.split('/').length - 1])}</h1>
									<a href={attachment} target="_blank" download><span className="text-sky-600 hover:underline">Download</span></a>
								</div>
							)
						})
					}
					<div className="">
						{
							attachments?.length > 0 &&
							<button className="px-8 mt-3 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
							<BsCloudDownload className="h-5 w-5 text-white"/> 
							Download All</button>
						}

					</div>
				</div>
				

				</>
			}
		</div>
	)
}