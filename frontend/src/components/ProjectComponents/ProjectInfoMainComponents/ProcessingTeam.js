"use client"
import {useState,useEffect} from 'react';
import {AiOutlinePlusCircle} from 'react-icons/ai';
import {currentUserState} from '../../../atoms/userAtom';
import {useRecoilState} from 'recoil';
import {getProcessingTeamByIds} from '../../../utils/processingTeamApiRoutes';
import axios from 'axios';
import {TiLocationOutline} from 'react-icons/ti';
import {MdOutlineEmail,MdPhone} from 'react-icons/md';
import {TbDrone} from 'react-icons/tb';

export default function ProcessingTeam({
	processingTeam,openProcessingAddTab,
	setOpenProcessingTeamAddTab,removeAssignedProcessingTeam,
	removeAssignedProcessingTeamConfirmation
}) {
	const [assignedProcessingTeam,setAssignedProcessingTeam] = useState([]);
	const [currentUser,setCurrentUser] = useRecoilState(currentUserState);

	const fetchAllProcessinTeamById = async() => {
		const {data} = await axios.post(getProcessingTeamByIds,{
			id:processingTeam
		})
			console.log(data)
		if(data.status){
			setAssignedProcessingTeam(data?.processingTeam);
		}
	};
	// console.log(processingTeam,currentUser)

	useEffect(()=>{
		if(processingTeam){
			fetchAllProcessinTeamById();
		}
	},[processingTeam])

	// console.log(currentUser)

	return (
		<div className="w-full">
			<h1 className="text-lg font-semibold text-black px-2 flex items-center gap-2">
				Processing Team Assigned 
				{
					currentUser?.roles?.includes("processingTeamManager") &&
					<AiOutlinePlusCircle 
					onClick={()=>setOpenProcessingTeamAddTab(!openProcessingAddTab)}
					className="cursor-pointer text-gray-800 hover:text-blue-500
					h-5 w-5"/>
				}
			</h1>
			{
				!processingTeam || processingTeam?.length < 1 ?
				<div className="w-full flex items-center justify-center px-10 py-5 gap-2">
					No Processing Team were currently assigned
				</div>
				:
				''
			}
			<div className="w-full grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-3 px-2 mt-1">
				{
					assignedProcessingTeam?.map((pilot,j)=>(
						<div key={j} className={`flex flex-col rounded-lg ${pilot?._id === currentUser._id ? 'bg-gradient-to-br to-purple-700 from-purple-500 shadow-lg shadow-purple-500/50' : '' } border-[1.4px] border-gray-300`}>
							<div className="flex items-center md:flex-row flex-col md:gap-3 gap-2 px-2 pt-3 w-full">
								<img src={pilot?.image} alt="" className="h-12 w-12 rounded-full hover:shadow-md shadow-sky-600 "/>
								<div className={`w-[2px] h-[90%] rounded-full ${pilot?._id === currentUser._id ? 'bg-gray-300/70' : 'bg-gray-700' }`}/>
								<div className="flex flex-col gap-2">
									<h1 className={`text-md leading-none font-semibold ${pilot?._id === currentUser._id ? 'text-gray-200' : 'text-gray-800' } `}>{pilot?.name}</h1>
									<div className={`flex ${pilot?._id === currentUser._id ? 'text-gray-200' : 'text-gray-800' }  leading-none text-sm items-center gap-2`}>
										<div className={`h-2 w-2 rounded-full ${pilot?.status === 'Available' ? 'bg-green-500' : pilot?.status === 'Busy' ? 'bg-red-500' : pilot?.status === 'Away' ? 'bg-orange-400' : 'bg-sky-500' }`}/>
										
										{pilot?.status}
									</div>
								</div>
							</div>
							<div className={`w-[90%] mx-auto h-[1px] ${pilot?._id === currentUser._id ? 'bg-gray-200' : 'bg-gray-200' } mt-2`}/>
							<div className="flex flex-col gap-[6px] p-2 px-3">
								<div className={`flex items-center gap-1 ${pilot?._id === currentUser._id ? 'text-gray-200' : 'text-gray-800' }`}>
									<MdPhone className="h-4 w-4"/> <h1 className="text-sm truncate font-medium">{pilot?.number}</h1>
								</div>
								<a href={`mailto:${pilot?.email}`} target="_blank" > 
									<div className={`flex items-center gap-1 ${pilot?._id === currentUser._id ? 'text-gray-200 hover:text-blue-400' : 'text-gray-800 hover:text-blue-500' } cursor-pointer`}>
										<MdOutlineEmail className="h-4 w-4"/> <h1 className="text-sm truncate font-medium">{pilot?.email}</h1>
									</div>
								</a>
								<div className={`flex items-center gap-1 ${pilot?._id === currentUser._id ? 'text-gray-200 hover:text-blue-400' : 'text-gray-800 hover:text-blue-500' }`}>
									<TiLocationOutline className="h-4 w-4"/> <h1 className="text-sm font-medium">{pilot?.location}</h1>
								</div>
							</div>
							<div className="w-[90%] mx-auto h-[1px] bg-gray-300"/>
							<div className="w-full flex items-center justify-end px-3 py-2">
								<button 
								onClick={()=>removeAssignedProcessingTeamConfirmation(pilot)}
								className="px-3 py-1 rounded-md bg-red-500 text-sm text-white">
									Remove
								</button>
							</div>

						</div>
					))
				}
			</div>

		</div>
	)
}