"use client"

import {BsBox,BsPeopleFill} from 'react-icons/bs';
import {RiCopilotFill} from 'react-icons/ri';
import {TbDrone} from 'react-icons/tb';
import {useState} from 'react'
import WeatherCard from './WeatherCard';
import YourProjectLocations from './YourProjectLocations';

export default function ProjectAndMessage({currentProjects,
	setCurrentProjects}) {
	// body...
	const [userMessages,setUserMessages] = useState([
		{
			user:'Vicky vikky',
			image:"https://th.bing.com/th?id=OIP.ViGlpoU2qdl9vGC1mxhpNgHaHa&w=250&h=250&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2",
			msg:'Hello! Good morning'
		},{
			user:'Santhosh',
			image:"https://th.bing.com/th?id=OIP.Tv3oG-Is7dcMNcysxIVwLAHaHa&w=250&h=250&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2",
			msg:'This project was interesting'
		}

	])


	return (
		<div className="w-full md:px-8 px-4 grid md:grid-cols-2 grid-cols-1 mt-4 gap-5">
			{/*<div className="grid grid-cols-2 gap-3">
							<div className="bg-white rounded-lg md:p-4 p-2 flex justify-between shadow-lg shadow-gray-300/40 gap-2">
								<div className="flex flex-col gap-2">
									<h1 className="text-sm font-semibold text-gray-700">Total projects</h1>
									<div className="flex items-center gap-2"> 
										<h1 className="text-xl font-bold text-black">71 +</h1>
									</div>
								</div>
								<div className="flex items-center justify-center">
									<div className="p-3 rounded-full bg-blue-600">
										<BsBox className="h-6 w-6 text-white"/>
									</div>
								</div>
							</div>
							<div className="bg-white rounded-lg md:p-4 p-2 flex justify-between shadow-lg shadow-gray-300/40 gap-2">
								<div className="flex flex-col gap-2">
									<h1 className="text-sm font-semibold text-gray-700">Total clients</h1>
									<div className="flex items-center gap-2"> 
										<h1 className="text-xl font-bold text-black">120 +</h1>
									</div>
								</div>
								<div className="flex items-center justify-center">
									<div className="p-3 rounded-full bg-orange-600">
										<BsPeopleFill className="h-6 w-6 text-white"/>
									</div>
								</div>
							</div>
							<div className="bg-white rounded-lg md:p-4 p-2 flex justify-between shadow-lg shadow-gray-300/40 gap-2">
								<div className="flex flex-col gap-2">
									<h1 className="text-sm font-semibold text-gray-700">Total pilots</h1>
									<div className="flex items-center gap-2"> 
										<h1 className="text-xl font-bold text-black">20 +</h1>
									</div>
								</div>
								<div className="flex items-center justify-center">
									<div className="p-3 rounded-full bg-green-600">
										<RiCopilotFill className="h-6 w-6 text-white"/>
									</div>
								</div>
							</div>
							<div className="bg-white rounded-lg md:p-4 p-2 flex justify-between shadow-lg shadow-gray-300/40 gap-1">
								<div className="flex flex-col gap-2">
									<h1 className="text-sm font-semibold text-gray-700">Drones available</h1>
									<div className="flex items-center gap-2"> 
										<h1 className="text-xl font-bold text-black">35 +</h1>
									</div>
								</div>
								<div className="flex items-center justify-center">
									<div className="p-3 rounded-full bg-sky-400">
										<TbDrone className="h-6 w-6 text-white"/>
									</div>
								</div>
							</div>
			
						</div>*/}

			<div className="">
				<WeatherCard />
			</div>
			<YourProjectLocations currentProjects={currentProjects}
			setCurrentProjects={setCurrentProjects} />

			{/*<div className="">
				<div className="w-full flex flex-col px-4 pt-4 pb-2 bg-white rounded-lg 
				shadow-lg shadow-gray-300/40 overflow-hidden">
					<h1 className="text-lg font-semibold text-black">New messages</h1>
					<div className="mt-2 flex flex-col gap-1 overflow-y-auto scrollbar-none ">
						{
							userMessages?.map((msg,j)=>(
								<div className="w-full flex hover:bg-gray-200/50 rounded-lg transition-all duration-200
								ease-in-out cursor-pointer items-center gap-2 px-3 py-3">
									<div className="p-[1px] border-[1px] border-blue-600 rounded-full">
										<img className={`h-8 w-8 rounded-full`} src={msg.image} alt="" />
									</div>
									<div className="flex flex-col gap-1">
										<h1 className="leading-none text-md font-semibold text-gray-900">
											{msg.user}
										</h1>
										<p className="leading-none text-xs font-semibold text-gray-500">
											{msg.msg}
										</p>
									</div>

								</div>
							))
						}

					</div>


				</div>
			</div>*/}

		</div>


	)
}