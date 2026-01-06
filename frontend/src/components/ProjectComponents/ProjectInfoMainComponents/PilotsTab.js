"use client"
import {useState,useEffect} from 'react';
import {AiOutlinePlusCircle} from 'react-icons/ai';
import {getPilotsByIds} from '../../../utils/ApiRoutes';
import axios from 'axios';
import {currentUserState} from '../../../atoms/userAtom';
import {useRecoilState} from 'recoil';
import {TiLocationOutline} from 'react-icons/ti';
import {MdOutlineEmail,MdPhone} from 'react-icons/md';
import {TbDrone} from 'react-icons/tb';

export default function PilotsTab({pilots,openPilotsAddTab,setOpenPilotsAddTab,removeAssignedPilotConfirmation}) {
	const [assignedPilots,setAssignedPilots] = useState([]);
	const [currentUser,setCurrentUser] = useRecoilState(currentUserState);

	const fetchAllPilotsById = async() => {
		const {data} = await axios.post(getPilotsByIds,{
			id:pilots
		})
		if(data.status){
			setAssignedPilots(data?.pilot);
		}
	}

	useEffect(()=>{
		if(pilots){
			fetchAllPilotsById();
		}
	},[pilots])

	return (
		<div className="w-full">
			<h1 className="text-lg font-semibold text-black px-2 flex items-center gap-2">
				Pilots Assigned 
				{
					currentUser?.roles?.includes("admin") || currentUser?.roles?.includes("Admin") &&
					<AiOutlinePlusCircle 
					onClick={()=>setOpenPilotsAddTab(!openPilotsAddTab)}
					className="cursor-pointer text-gray-800 hover:text-blue-500
					h-5 w-5"/>
				}
				<AiOutlinePlusCircle 
					onClick={()=>setOpenPilotsAddTab(!openPilotsAddTab)}
					className="cursor-pointer text-gray-800 hover:text-blue-500
					h-5 w-5"/>
			</h1>
			{
				!pilots || pilots?.length < 1 ?
				<div className="w-full flex items-center justify-center px-10 py-5 gap-2">
					No pilots were currently assigned
				</div>
				:
				''
			}
			<div className="w-full grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-3 px-2 mt-1">
				{
					assignedPilots?.map((pilot,j)=>(
						<div key={j} className="flex flex-col rounded-lg border-[1.4px] border-gray-300">
							<div className="flex items-center md:flex-row flex-col md:gap-3 gap-2 px-2 pt-3 w-full">
								<img src={pilot?.image} alt="" className="h-12 w-12 rounded-full hover:shadow-md shadow-sky-600 "/>
								<div className="w-[3px] h-[90%] rounded-full bg-blue-600"/>
								<div className="flex flex-col gap-2">
									<h1 className="text-md leading-none font-semibold text-gray-800">{pilot?.name}</h1>
									<div className="flex text-gray-800 leading-none text-sm items-center gap-2">
										<div className={`h-2 w-2 rounded-full ${pilot?.status === 'Available' ? 'bg-green-500' : pilot?.status === 'Busy' ? 'bg-red-500' : pilot?.status === 'Away' ? 'bg-orange-400' : 'bg-sky-500' }`}/>
										
										{pilot?.status}
									</div>
								</div>
							</div>
							<div className="w-[90%] mx-auto h-[1px] bg-gray-300 mt-2"/>
							<div className="flex flex-col gap-[6px] p-2 px-3">
								<div className="flex items-center gap-1 text-gray-800">
									<MdPhone className="h-4 w-4"/> <h1 className="text-sm truncate font-medium">{pilot?.number}</h1>
								</div>
								<a href={`mailto:${pilot?.email}`} target="_blank" > <div className="flex items-center gap-1 text-gray-800 cursor-pointer hover:text-blue-500">
									<MdOutlineEmail className="h-4 w-4"/> <h1 className="text-sm truncate font-medium">{pilot?.email}</h1>
								</div></a>
								<div className="flex items-center gap-1 text-gray-800 hover:text-blue-500">
									<TiLocationOutline className="h-4 w-4"/> <h1 className="text-sm font-medium">{pilot?.district}</h1>
								</div>
								<div className="flex items-center gap-1 text-gray-800">
									<TbDrone className="h-4 w-4"/> <h1 className="text-sm font-medium">{pilot?.dronesHaving?.map((drone,k)=>(
										<span key={k} className="">{drone}{k === pilot?.dronesHaving?.length - 1 ? '.' : ', '}</span>
									))}</h1>
								</div>
							</div>
							<div className="w-[90%] mx-auto h-[1px] bg-gray-300"/>
							<div className="w-full flex items-center justify-end px-3 py-2">
								<button 
								onClick={()=>removeAssignedPilotConfirmation(pilot)}
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