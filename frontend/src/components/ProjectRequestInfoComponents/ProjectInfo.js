"use client"
import {BsThreeDotsVertical} from 'react-icons/bs';
import {AiOutlineDelete,AiOutlineClockCircle,AiFillTags} from 'react-icons/ai';
import {useState,useEffect} from 'react'
import {TfiLocationPin} from 'react-icons/tfi';
import {LiaIndustrySolid} from 'react-icons/lia';
import {LuMaximize2} from 'react-icons/lu'
import {AiOutlineLink,AiOutlineFilePdf} from 'react-icons/ai';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import ReactPlayer from 'react-player/lazy'
import {GrCloudDownload} from 'react-icons/gr';
import {changeStatusById,createProject} from '../../utils/ApiRoutes';
import {FiChevronDown} from 'react-icons/fi'
import {BsCloudDownload} from 'react-icons/bs';
import axios from 'axios';
import {currentUserState} from '../../atoms/userAtom';
import {useRecoilState} from 'recoil';
import {useRouter} from 'next/navigation';
import { AiOutlineDatabase } from "react-icons/ai";
import { RiGpsLine } from "react-icons/ri";

export default function ProjectInfo({request,setRequest}) {
	// body...
	const [revealDelete,setRevealDelete] = useState(false);
	const [status,setStatus] = useState('');
	const [revealStatusOption,setRevealStatusOption] = useState(false);
	const [statusLoading,setStatusLoading] = useState(false);
	const [currentUser,setCurrentUser] = useRecoilState(currentUserState);
	const [dataCollection,setDataCollection] = useState('');
	const router = useRouter()
	
	useEffect(()=>{
		if(request){
			setStatus(request?.status);
			setDataCollection(request?.dataCollection);
		}
	},[request])

	const changeStatus = async(status) => {
		setStatusLoading(true)
		const {data} = await axios.post(changeStatusById,{
			id:request._id,token:'d80a06cb4d4638995778a040c51f86f5',status
		})
		if(data?.status){
			console.log(data)
			setRequest(data?.request);
			setStatusLoading(false);
		}else{
			setStatusLoading(false)
		}
	}

	const acceptTheProjectFunc = async() => {
		try{	
			const approvedAt = new Date().toISOString();
			const approvedBy = {
				name:currentUser?.name,
				email:currentUser?.email,
				image:currentUser?.image,
				roles:currentUser?.roles,
				approvedAt:new Date().toISOString()
			}
			const body = {
				...request,
				dataCollection,
				approvedAt,
				approvedBy,
				requestId:request?._id
			};

			const {data} = await axios.post(createProject,body);
			if(data?.status){
				router.push(`/Projects/${data?.project?._id}?industry=${request?.industry}`);
				console.log(data);
			}else{
				console.log('Something went wrong! ' + data?.msg);
			}
		}catch(ex){
			console.log(ex)
		}
	}

	return (

		<div className="md:px-6 px-2">
			<div className="w-full mt-3 p-3 rounded-xl border-[1px] border-gray-200 bg-white w-full">
				<div className="flex items-center justify-between  pt-2 pb-1"> 
					<h1 className="text-black text-lg font-semibold">{request?.type}</h1>
					<div className="gap-2 flex items-center">
						

						<button className="border-[1px] border-gray-300 rounded-md text-sky-600 
						px-4 py-1 hover:bg-blue-600 transition-all duration-200 ease-in-out text-xs hover:text-white">
							Project info
						</button>
						<div className="hover:bg-gray-200/50 relative transition-all duration-200 p-1 
						cursor-pointer ease-in-out rounded-full">
							<div className={`right-2 z-40 ${revealDelete ? 'absolute' : 'hidden' } top-8 bg-white rounded-md border-[1px] border-gray-200 flex flex-col`}>
								<button 
								onClick={()=>{
									setRevealDelete(false);
									document.getElementById('accept-button').scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
								}}
								className="flex border-b-[1px] transition-all duration-200 ease-in-out hover:bg-gray-200/50 border-gray-300 items-center text-sky-600 gap-1 text-xs px-3 py-1">
									<FiChevronDown className="h-3 w-3"/>
									Accept
								</button>
								<div className="px-3 py-1 hover:bg-gray-200/50 text-xs text-gray-700 hover:text-red-700 transition-all duration-200 ease-in-out flex items-center gap-1">
									<AiOutlineDelete className="h-3 w-3"/> Reject
								</div>	
							</div>

							<BsThreeDotsVertical onClick={()=>{setRevealDelete(!revealDelete)}} className="text-gray-700 h-4 w-4"/>
						</div>
					</div>
				</div>

				<div className="h-[1px] w-[98%] mx-auto my-4 bg-[#EBE8FF]"/>
				<div className="flex md:flex-row md:items-center gap-3 flex-col justify-between">
					<div className="flex items-center gap-3 px-2 py-1 bg-gradient-to-r from-[#3c21f7]/10 rounded-md to-gray-50">
						<div className="rounded-full bg-blue-600 p-[6px]">
							<AiFillTags className="text-white h-5 w-5"/>
						</div>
						<span className="text-black font-semibold text-lg">
							{request?.name}
						</span>
					</div>

					<div className="flex md:items-center gap-5 md:flex-row flex-col">
					       {statusLoading && <span className="loader6 ml-2"/>}
						<div class="max-w-sm ">

					    <div class="relative">
					      <div onClick={()=>{if(!statusLoading) setRevealStatusOption(!revealStatusOption)}} 
					      class="h-10 bg-white flex border border-gray-200 rounded cursor-pointer items-center">
					        <input value={status}
					        onClick={()=>{if(!statusLoading) setRevealStatusOption(!revealStatusOption)}}  
					        name="select" id="select" 
					        class="px-4 appearance-none text-md outline-none text-gray-800 w-full cursor-pointer bg-transparent" />

					        <button class="cursor-pointer outline-none focus:outline-none transition-all text-gray-300 hover:text-gray-600">
					          <svg class="w-4 h-4 mx-2 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					            <line x1="18" y1="6" x2="6" y2="18"></line>
					            <line x1="6" y1="6" x2="18" y2="18"></line>
					          </svg>
					        </button>
					        <label for="show_more" class={`${revealStatusOption ? 'rotate-0' : 'rotate-180'} cursor-pointer outline-none focus:outline-none border-l border-gray-200 transition-all text-gray-300 hover:text-gray-600`}>
					          <svg class="w-4 h-4 mx-2 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					            <polyline points="18 15 12 9 6 15"></polyline>
					          </svg>
					        </label>
					      </div>

					      <div class={`absolute rounded shadow text-sm bg-white overflow-hidden ${revealStatusOption ? 'flex' : 'hidden'} flex-col w-full mt-1 border border-gray-200`}>
					        <div onClick={()=>{
					        	setStatus('Under review');
					        	setRevealStatusOption(false);
					        	changeStatus('Under review');
					        }} 
					        class="cursor-pointer group">
					          <a class="block p-2 border-transparent border-l-4 group-hover:border-blue-600 group-hover:bg-gray-100">Under review</a>
					        </div>
					        <div onClick={()=>{
					        	setStatus('Feasability study');
					        	changeStatus('Feasability study');
					        	setRevealStatusOption(false)
					        }} class="cursor-pointer group border-t">
					          <a class="block p-2 border-transparent border-l-4 group-hover:border-blue-600 border-blue-600 group-hover:bg-gray-100">Feasability study</a>
					        </div>
					        <div onClick={()=>{
					        	setStatus('Client discussion');
					        	changeStatus('Client discussion')
					        	setRevealStatusOption(false)
					        }} class="cursor-pointer group border-t">
					          <a class="block p-2 border-transparent border-l-4 group-hover:border-blue-600 group-hover:bg-gray-100">Client discussion</a>
					        </div>
					        <div onClick={()=>{
					        	setStatus('Finalising Request');
					        	changeStatus('Finalising Request');
					        	setRevealStatusOption(false)
					        }} class="cursor-pointer group border-t">
					          <a class="block p-2 border-transparent border-l-4 group-hover:border-blue-600 group-hover:bg-gray-100">Finalising Request</a>
					        </div>
					      </div>
					    </div>
					  </div>

					  <div className="flex items-center gap-[2px]">
					  	<img src={request?.clientDetails?.image} alt="" className="h-7 w-7 rounded-full" />
					  	<div className="h-7 w-7 bg-blue-600 text-xs text-white rounded-full flex items-center justify-center">+6</div>
					  </div>

					</div>

				</div>

				<div className="h-[1px] w-[98%] mx-auto my-4 bg-[#EBE8FF]"/>

				<div className="flex flex-col ">
					<div className="grid md:grid-cols-2 grid-cols-1">
						<div className="flex items-center gap-1">
							<div className="flex gap-1 items-center text-black font-semibold text-md">
								<TfiLocationPin className="h-5 w-5 text-gray-500"/> Location :
							</div>
							<h1 className="text-md text-gray-700">{request?.projectLocation}</h1>
						</div>
						<div className="flex mt-2 items-center gap-1">
							<div className="flex gap-1 items-center text-black font-semibold text-md">
								<LiaIndustrySolid className="h-5 w-5 text-gray-500"/> Industry :
							</div>
							<h1 className="text-md text-gray-700">{request?.industry}</h1>
						</div>
						<div className="flex mt-2 items-center gap-1">
							<div className="flex gap-1 items-center text-black font-semibold text-md">
								<AiOutlineClockCircle className="h-5 w-5 text-gray-500"/> Start date :
							</div>
							<h1 className="text-md text-gray-700">{request?.startDate}</h1>
						</div>
						<div className="flex mt-2 items-center gap-1">
							<div className="flex gap-1 items-center text-black font-semibold text-md">
								<AiOutlineClockCircle className="h-5 w-5 text-gray-500"/> Deadline :
							</div>
							<h1 className="text-md text-gray-700">{request?.deadline}</h1>
						</div>
						<div className="flex mt-2 items-center gap-1">
							<div className="flex gap-1 items-center text-black font-semibold text-md">
								<AiOutlineDatabase className="h-5 w-5 text-gray-500"/> Data Collection :
							</div>
							<div className="cursor-pointer px-2 py-1 rounded-lg border-[1px] border-gray-300">
								<select value={dataCollection} 
								className="bg-transparent cursor-pointer outline-none" 
								onChange={(e)=>setDataCollection(e.target.value)}>
									<option value="Required">Required</option>
									<option value="Not Required">Not Required</option>
								</select>
							</div>
							{/*<h1 className="text-md text-gray-700">{request?.dataCollection}</h1>*/}
						</div>
						<div className="flex mt-2 items-center gap-1">
							<div className="flex gap-1 items-center text-black font-semibold text-md">
								<RiGpsLine className="h-5 w-5 text-gray-500"/> DGPS :
							</div>
							<h1 className="text-md text-gray-700">{request?.dgps?.map((dgp,k)=>{
								if(k+1 >= request?.dgps?.length){
									return `${dgp}`
								}else{
									return `${dgp},`
								}
							})}</h1>
						</div>
					</div>
					<div className="flex flex-col mt-3">
						<h1 className="text-lg font-semibold text-black">Scope</h1>
						<p className="mt-2 text-sm text-[#878787]">{request?.scope}</p>
					</div>
				</div>

				{
					request?.attachments?.length > 0 &&
					<>
					<div className="h-[1px] w-[98%] mx-auto my-3 bg-[#EBE8FF]"/>
					<h1 className="text-lg font-semibold text-black hover:underline flex items-center gap-1">
					<AiOutlineLink className="h-5 w-5"/> Attachments</h1>
					<div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-3 p-2">
					 {
						request?.attachments?.map((req,j)=>{
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
						request?.attachments?.map((req,j)=>{
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
							request?.attachments?.map((req,j)=>{
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
					<h1 className="text-lg font-semibold mb-2 text-black hover:underline flex items-center gap-1">
					<AiOutlineFilePdf className="h-5 w-5"/> Downloadable attachments</h1>
					<div className="flex flex-col gap-2">
						{
							request?.attachments?.map((attachment,k)=>{


								return (
									<div key={k} className="flex items-center gap-2 text-sm">
										<GrCloudDownload className="h-5 w-5 text-gray-500"/>
										<h1 className="text-gray-800">{attachment.split('/')[attachment?.split('/').length - 1]}</h1>
										<a href={attachment} target="_blank" download><span className="text-sky-600 hover:underline">Download</span></a>
									</div>
								)
							})
						}
						<div className="">
							{
								request?.attachments?.length > 0 &&
								<button className="px-8 mt-3 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
								<BsCloudDownload className="h-5 w-5 text-white"/> 
								Download All</button>
							}

						</div>
					</div>

					</>
				}
				<div className="h-[1px] w-[98%] mx-auto my-3 bg-[#EBE8FF]"/>
				<div className="w-full mt-2 ">
					<div className="flex items-center gap-3">
						<button className="text-red-600 hover:text-red-700 bg-transparent px-6 py-2 rounded-md">
							Reject project
						</button>
						<button onClick={()=>{
							acceptTheProjectFunc()
						}} id="accept-button" className="text-white bg-green-500 hover:bg-green-600 px-6 
						py-2 rounded-md border-[1px] border-gray-300">
							Accept project
						</button>
					</div>
				</div>

			</div>
		</div>
	)
}