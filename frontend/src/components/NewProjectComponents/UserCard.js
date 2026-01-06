
"use client"
import {useState} from 'react';
import {AiOutlinePlusCircle} from 'react-icons/ai'

export default function UserCard({client,j,teamMembers,setTeamMembers,addToTeam,
	removeFromTeam}) {
	// body...
	const [added,setAdded] = useState(false);


	return (
		<main className="w-full border-[1px] border-gray-200 hover:bg-gray-100 bg-gray-50
		transition-all duration-200 ease-in-out flex items-center gap-2 justify-between 
		px-2 py-1 rounded-lg">
			<div className="flex items-center gap-2">
				<img src={client?.image} className="h-12 w-12 rounded-full"/>
				<div className="flex flex-col gap-2"> 
					<h1 className="text-md text-gray-800 leading-none font-normal">{client?.name}</h1>
					<h1 className="text-sm font-normal leading-none text-gray-600">{client?.email}</h1>
				</div>
			</div>

			<div 
			onClick={()=>{
				if(!teamMembers.find(mem=>mem._id === client._id)){
					const clientDetails = {
						_id:client?._id,
						image:client?.image
					}
					addToTeam(clientDetails)
				}else{	
					removeFromTeam(client)
				}
			}}
			className="px-2">
			{
				teamMembers.find(mem=>mem._id === client._id) ? 
				<h1 className='text-sm text-red-600 cursor-pointer'>Remove</h1>
				:
				<h1 className='text-sm text-sky-500'> <AiOutlinePlusCircle className="h-6 w-6 cursor-pointer"/> </h1>
			}
			</div>
		</main>
	)
}