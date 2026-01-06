"use client"

import {useState,useEffect} from 'react';
import {getProjectById,fetchAllProjects} from '../../utils/ApiRoutes';
import axios from 'axios';
import {HiLocationMarker,HiOutlineMail} from 'react-icons/hi';
import {FiCornerDownRight} from 'react-icons/fi'; 
import {AiOutlineCalendar} from 'react-icons/ai';
import {LiaIndustrySolid} from 'react-icons/lia';
import Link from 'next/link';
import { IoMdSearch } from "react-icons/io";

export default function ProjectCardComponent({currentUser}) {
	// body...
	const [projects,setProjects] = useState([]);
	const [currentIndustries,setCurrentIndustries] = useState([]);
	const [selectedIndustry,setSelectedIndustry] = useState('');
	const [searchValue,setSearchValue] = useState('');
	const [filteredProjects,setFilteredProjects] = useState([]);

	useEffect(()=>{
		fetchAllProjectsFunc()
		if(currentUser?.roles?.includes('Admin')){
		}
	},[currentUser]);

	useEffect(()=>{
		if(searchValue){
			const filtered = projects?.filter((proj)=>{
				if(proj?.name?.toLowerCase()?.includes(searchValue?.toLowerCase()) || proj?.projectLocation?.toLowerCase()?.includes(searchValue?.toLowerCase()) || proj?.projectArea?.toLowerCase()?.includes(searchValue?.toLowerCase())) return true;
				return false;
			})
			setFilteredProjects(filtered);
		}else{
			setFilteredProjects([]);
		}
	},[searchValue]);


	const fetchProjects = async() => {
		const {data} = await axios.post(getProjectById,{
			id:currentUser?.projectsId
		})
		if(data?.status){
			const industriesTemp = data?.project?.map((ind)=>ind.industry);
			let industriesUniq = [...new Set(industriesTemp)];
			setCurrentIndustries(industriesUniq);
			setProjects(data?.project)
		}
	}

	const fetchAllProjectsFunc = async() => {
		console.log("Hello")
		const {data} = await axios.post(fetchAllProjects);
		console.log("Data : ",data)
		if(data?.status){
			const industriesTemp = data?.project?.map((ind)=>ind.industry);
			let industriesUniq = [...new Set(industriesTemp)];
			setCurrentIndustries(industriesUniq);
			if(industriesUniq?.length > 0){
				setSelectedIndustry(industriesUniq?.[0]);
			}
			setProjects(data?.project)
		}
	};


	return (
		<>
		<div className="flex mt-1 w-full md:px-10 px-4 items-center gap-5">
			<div className="w-full flex items-center gap-3 flex-wrap ">
				{
					currentIndustries?.map((industry,k)=>(
						<div key={k} onClick={()=>{setSelectedIndustry(industry)}} className={`px-2 py-1 ${selectedIndustry === industry ? 'bg-blue-600  text-white' : 'text-black border-gray-300'}
						border-[1px] cursor-pointer rounded-lg transition-all duration-200 ease-in-out`}>
							<h1 className="text-md px-5">{industry}</h1>
						</div>
					))
				}

			</div>
			<div className="rounded-lg flex items-center gap-2 border-[1px] border-gray-400 
			focus-within:border-blue-500 px-2 py-1">
				<IoMdSearch className="h-4 w-4 text-gray-800"/>
				<input type="text" className="bg-transparent text-sm outline-none w-[200px]"
				placeholder="Project Name / Location" value={searchValue} 
				onChange={(e)=>setSearchValue(e.target.value)} />
			</div>
		</div>
		<div className="md:px-10 px-4">
			<div className="w-[98%] mx-auto my-2 mt-3 h-[1px] bg-gray-300"/>	
		</div>
		<div className="w-full flex items-center flex-wrap md:px-8 px-4 gap-3 overflow-x-auto scrollbar-none">

			{
				filteredProjects?.length > 0 ?
				filteredProjects?.map((req,j)=>{
					if (req?.industry === selectedIndustry)
					return(
					<div key={j} className="bg-white mt-5 flex lg:min-w-[32%] md:min-w-[48%] relative
					sm:min-w-[70%] sm:mx-0 mx-auto min-w-[95%] flex-col px-3 py-2 rounded-xl 
					border-[1px] border-gray-400 hover:bg-gray-50/10 transition-all duration-100 ease-in-out">
						<div className="absolute border-[1px] border-gray-400 rounded-xl text-black text-sm 
						text-gray-800 left-3 -top-4 z-40 bg-white px-2 py-1">
							{req?.type?.length > 20 ? `${req?.type?.slice(0,20)}...` : req?.type}
						</div>
						<div className="w-full mt-2">
							<h1 className="text-lg font-semibold text-sky-600 leading-sm">{req?.name}</h1>
						</div>
						<div className="h-[1px] bg-gray-300 w-[80%]"/>
						<div className="flex items-center gap-1 mt-1 text-xs">
							<div className={`h-2 w-2 rounded-full ${req?.status==='Ongoing project' ? 'bg-purple-500' : 'bg-sky-600'}`}/>
							{req.status}
						</div>
						<h1 className="text-sm font-normal mt-2 flex items-center gap-1 text-gray-800"><LiaIndustrySolid className="h-4 w-4 text-gray-500"/>{req?.clientDetails?.organizationName}</h1>
						<h1 className="text-sm font-normal mt-1 flex items-center gap-1 text-gray-800"><HiLocationMarker className="h-4 w-4 text-gray-500"/>{req?.projectArea || req?.projectLocation}</h1>
						<h1 className="text-sm font-normal mt-1 flex items-center gap-1 text-gray-800"><AiOutlineCalendar className="h-4 w-4 text-gray-500"/>{req?.startDate} - {req?.deadline}</h1>
						<h1 className="text-sm font-normal mt-1 flex items-center gap-1 text-blue-600"><FiCornerDownRight className="h-4 w-4"/>
						<Link href={`/Projects/${req?._id}?industry=${req.industry}`} 
						className="hover:underline cursor-pointer">More details</Link></h1>
					</div>
				)}
				)
				:
				projects?.map((req,j)=>{
					if (req?.industry === selectedIndustry)
					return(
					<div key={j} className="bg-white mt-5 flex lg:min-w-[32%] md:min-w-[48%] relative
					sm:min-w-[70%] sm:mx-0 mx-auto min-w-[95%] flex-col px-3 py-2 rounded-xl 
					border-[1px] border-gray-400 hover:bg-gray-50/10 transition-all duration-100 ease-in-out">
						<div className="absolute border-[1px] border-gray-400 rounded-xl text-black text-sm 
						text-gray-800 left-3 -top-4 z-40 bg-white px-2 py-1">
							{req?.type?.length > 20 ? `${req?.type?.slice(0,20)}...` : req?.type}
						</div>
						<div className="w-full mt-2">
							<h1 className="text-lg font-semibold text-sky-600 leading-sm">{req?.name}</h1>
						</div>
						<div className="h-[1px] bg-gray-300 w-[80%]"/>
						<div className="flex items-center gap-1 mt-1 text-xs">
							<div className={`h-2 w-2 rounded-full ${req?.status==='Ongoing project' ? 'bg-purple-500' : 'bg-sky-600'}`}/>
							{req.status}
						</div>
						<h1 className="text-sm font-normal mt-2 flex items-center gap-1 text-gray-800"><LiaIndustrySolid className="h-4 w-4 text-gray-500"/>{req?.clientDetails?.organizationName}</h1>
						<h1 className="text-sm font-normal mt-1 flex items-center gap-1 text-gray-800"><HiLocationMarker className="h-4 w-4 text-gray-500"/>{req?.projectArea || req?.projectLocation}</h1>
						<h1 className="text-sm font-normal mt-1 flex items-center gap-1 text-gray-800"><AiOutlineCalendar className="h-4 w-4 text-gray-500"/>{req?.startDate} - {req?.deadline}</h1>
						<h1 className="text-sm font-normal mt-1 flex items-center gap-1 text-blue-600"><FiCornerDownRight className="h-4 w-4"/>
						<Link href={`/Projects/${req?._id}?industry=${req.industry}`} 
						className="hover:underline cursor-pointer">More details</Link></h1>
					</div>
				)}
				)
			}
		</div>

		
		</>
	)
}