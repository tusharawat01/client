"use client"

import {getClientById} from '../../utils/ApiRoutes';
import axios from 'axios'
import {useState,useEffect} from 'react';
import {HiOutlineMail} from 'react-icons/hi';
import { FaIndustry } from "react-icons/fa6";
import {BsFillPersonFill} from 'react-icons/bs';
import {LiaIndustrySolid} from 'react-icons/lia';
import GeneralInfoTab from './GeneralInfoTab'
import TeamTab from './TeamTab'
import ClientsTab from './ClientsTab'
import {MdPeople} from 'react-icons/md';
import ProjectTab from './ProjectTab'

export default function ClientInfo({clientId}) {
	// body...
	const [loading,setLoading] = useState(true);
	const [currentClient,setCurrentClient] = useState('');
	const [currentTab,setCurrentTab] = useState('Summary');

	const availbleTabs = [
		{
			name:'Summary'
		},{
			name:'Team'
		},{
			name:'Projects'
		}
	]

	useEffect(()=>{
		fetchClient()
	},[])

	useEffect(()=>{
		fetchClient()
	},[availbleTabs])

	const fetchClient = async() => {
		const {data} = await axios.post(getClientById,{
			clientId
		})
		if(data?.status){
			setLoading(false);
			setCurrentClient(data.user);
		}else{
			setCurrentClient("not found")
		}
	}
	if(!currentClient){
		return (
			<div className="flex flex-col h-full bg-gray-100 w-full jusitfy-center gap-4 items-center">
				<div className="flex flex-col items-center gap-5 my-auto">
					<span className="loader"/>
					<h1 className="text-xl font-semibold text-gray-900">Loading the client details</h1>
				</div>
			</div>
		)
	}

	if(currentClient === 'not found'){
		return (
			<div className="flex flex-col h-full bg-gray-100 w-full jusitfy-center gap-4 items-center">
				<div className="flex flex-col items-center gap-5 my-auto">
					<img src="https://ik.imagekit.io/d3kzbpbila/thejashari_J8X5kpsWT" 
					className="rounded-md w-[200px]"/>
					<h1 className="text-xl font-semibold text-gray-900">Client not found</h1>
				</div>
			</div>
		)
	}

	return (
		<main className="w-full flex flex-col ">
			<div className="p-5 flex gap-5 w-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 
			shadow-lg" > 
				<div className="">
					<img src={currentClient?.image} alt="" className="w-[140px] h-[140px] rounded-lg"/>
				</div>
				<div className="flex flex-col items-center flex-1">
					<h1 className="text-2xl text-white">{currentClient?.name}</h1>
					<div className="grid md:grid-cols-2 grid-cols-1 mt-6 w-full md:gap-0 gap-2">
						<div className="flex flex-col items-center md:gap-5 gap-2 ">
							<div className="flex items-center gap-1">
								<FaIndustry className="h-5 w-5 text-white"/>
								<p className="text-md text-white" >{currentClient?.organizationName}</p>
							</div>
							<div className="flex items-center gap-1">
								<HiOutlineMail className="h-5 w-5 text-white"/>
								<p className="text-md text-white" >{currentClient?.email}</p>
							</div>
						</div>
						<div className="flex flex-col items-center md:gap-5 gap-2 ">
							<div className="flex items-center gap-1">
								<LiaIndustrySolid className="h-5 w-5 text-white"/>
								<p className="text-md text-white" >{
									currentClient?.clientIndustry?.map((industry,k)=>{
										if(k+1 === currentClient?.clientIndustry?.length) return `${industry}`
										return `${industry},`
									})
								}</p>
							</div>
							<div className="flex items-center gap-1">
								<MdPeople className="h-5 w-5 text-white"/>
								<p className="text-md text-white" >{currentClient?.organizationType}</p>
							</div>
						</div>
					</div>
				</div>	
			</div>

			<div className="w-full flex flex-col pt-3">
				<div className="w-full flex items-center flex-wrap border-b-[1px] 
				border-gray-300/50 px-2 gap-3">
					{
						availbleTabs?.map((tab,j)=>(
							<div key={j}
							onClick={()=>setCurrentTab(tab?.name)}
							className={`px-2 py-[1px] pt-2 rounded-t-md cursor-pointer ${currentTab === tab.name ? 'bg-sky-100/50' : 'bg-transparent'} flex flex-col gap-1`}>
								<h1 className="text-md text-gray-800">{tab?.name}</h1>
								<div className={`h-[3px] rounded-full transition-all duration-200
								ease-in-out w-[95%] mx-auto ${currentTab === tab.name && 'bg-blue-600'}`}/>
							</div>		
						))
					}
				</div>

				{
					currentTab === 'Summary' ? 
					<GeneralInfoTab currentClient={currentClient} setCurrentClient={setCurrentClient} 
					setCurrentTab={setCurrentTab}
					/>
					:
					currentTab === 'Clients' ? 
					<TeamTab currentClient={currentClient} />
					:
					currentTab === 'Team' ? 
					<ClientsTab currentClient={currentClient} />
					:
					<ProjectTab currentClient={currentClient} clientId={clientId} />
				}

			</div>


		</main>

	)
}