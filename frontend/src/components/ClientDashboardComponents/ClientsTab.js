"use client"

import {useState,useEffect} from 'react';
import {AiOutlinePlusCircle} from 'react-icons/ai'
import ClientAddByClient from './ClientAddByClient';
import ClientsTabCard from './ClientsTabCard';
import axios from 'axios';
import {getTeamFromOrganisation,updateUserOrganization} from '../../utils/ApiRoutes'

export default function ClientsTab({currentClient}) {
	// body...
	const [addClientOpen,setAddClientOpen] = useState(false);
	const [clientsOfClient,setClientsOfClient] = useState([]);
	const [currentClients,setCurrentClients] = useState([]);
	const [removeClientReveal,setRemoveClientReveal] = useState(false);
	const [removeClient,setRemoveClient] = useState('');
	const [loading,setLoading] = useState(false);

	const loadClients = async() => {
		const organizationId = currentClient?.organizationId;
		const {data} = await axios.post(getTeamFromOrganisation,{
			key:"58f/jNohScxEXiQg82RG",
			organizationId
		})
		if(data?.status){
			setCurrentClients(data.clients);
		}
	}

	useEffect(()=>{
		loadClients()
	},[])

	const removeClientFunc = async(e) => {
		setLoading(true);
		const {data} = await axios.post(updateUserOrganization,{
			organizationId:"",organizationName:"",organizationType:"",
			key:'58f/jNohScxEXiQg82RG',id:removeClient?._id
		});
		if(data?.status){
			setLoading(false);
			setRemoveClientReveal(false);
			setRemoveClient('');
			loadClients();
		}else{
			setLoading(false);
		}
	};

	return(
		<div className="w-full h-full">
			<ClientAddByClient addClientOpen={addClientOpen} setAddClientOpen={setAddClientOpen} 
			clientIndustry={currentClient?.clientIndustry} organizationName={currentClient?.organizationName} 
			organizationType={currentClient?.organizationType} organizationId={currentClient?.organizationId}
			loadClients={loadClients}
			/> 
			{/*<div className="w-full px-5 py-3 flex md:flex-row flex-col 
			md:justify-between bg-white border-b-[1px] border-gray-300/50 shadow-gray-200/20 rounded-lg">
				<form className="flex items-center md:w-[70%] w-full gap-3 ">
					<div className="border-[1px] border-gray-300/60 px-3 py-1 rounded-md">
						<input type="text" className="bg-transparent w-full outline-none ring-none 
						text-black text-md placeholder:text-gray-500 placeholder:text-sm"
						placeholder="Client name"
						/>
					</div>
					<div className="border-[1px] border-gray-300/60 px-3 py-1 rounded-md">
						<input type="text" className="bg-transparent w-full outline-none ring-none 
						text-black text-md placeholder:text-gray-500 placeholder:text-sm"
						placeholder="Project name"
						/>
					</div>
					<button type="submit" className="bg-blue-600 text-white text-sm px-5 py-2 rounded-lg">
						Search
					</button>
				</form>
				<div className="md:mt-0 mt-2">
					<button 
					onClick={()=>setAddClientOpen(true)}
					className="flex items-center bg-blue-600 gap-2 px-5 py-2 rounded-lg text-white ">
						<AiOutlinePlusCircle className="h-5 w-5"/>Add new client
					</button> 
				</div>
			</div>*/}
			<div className="gap-4 mt-4 grid px-4 lg:grid-cols-4 sm:grid-cols-2 grid-cols-1">
				{
					currentClients.map((client,j)=>(
						<ClientsTabCard key={j} client={client} j={j}
						setRemoveClientReveal={setRemoveClientReveal}
						setRemoveClient={setRemoveClient}
						/>
					))
				}


			</div>

			<div className={`fixed ${removeClientReveal ? 'w-full h-full' : 'h-[0px] w-[0px]'} overflow-hidden
			bg-white/60 z-50 top-0 left-0 right-0 bottom-0 m-auto flex items-center justify-center transition-all 
			duration-300 ease-in-out`}>
				<div className="p-3 bg-white border-[1px] border-gray-300 rounded-lg flex flex-col">
					<h1 className="text-xl font-cursive text-black mr-5">Are you sure? Remove <span className="text-blue-500">{removeClient?.name}</span> from client role.</h1>
					<div className="flex items-center mt-3 justify-end gap-5">
						<button onClick={(e)=>setRemoveClientReveal(false)}
						className="px-3 py-1 rounded-md text-black">Cancel</button>
						<button 
						onClick={()=>{if(!loading) removeClientFunc()}}
						className={`${loading ? 'bg-red-300/50 animate-pulse' : 'bg-red-600'} text-white rounded-md px-3 py-1`}>{
							loading ? 
							'Loading...'
							:
							'Remove'
						}</button>
					</div>
				</div>
			</div>

		</div>

	)
}