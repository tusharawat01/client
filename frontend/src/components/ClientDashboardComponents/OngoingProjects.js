'use client'

import {useRecoilState} from 'recoil';
import {currentProjectState,currentUserState} from '../../atoms/userAtom';
import {HiArrowLeft,HiArrowRight} from 'react-icons/hi';
import {AiOutlineDoubleRight} from 'react-icons/ai';
import {BsThreeDotsVertical} from 'react-icons/bs';
import { GrProjects } from "react-icons/gr";
import {useRouter} from 'next/navigation';

export default function OngoingProjects({
	currentProjects,setCurrentProjects
}) {
	// body...
	const router = useRouter();
	const [currentProject,setCurrentProject] = useRecoilState(currentProjectState);
	const [currentUser,setCurrentUser] = useRecoilState(currentUserState);
	const colors = ['bg-blue-600','bg-orange-600','bg-indigo-600',
		'bg-green-600'];
	const projectsList = [
		{
			name:'Railway',
			totalTasks:50,
			completedTasks:25,
			color:'bg-blue-600',
			clients:[
				{
					image:'https://th.bing.com/th?id=OIP.ViGlpoU2qdl9vGC1mxhpNgHaHa&w=250&h=250&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2'
				},
				{
					image:'https://th.bing.com/th?id=OIP.Tv3oG-Is7dcMNcysxIVwLAHaHa&w=250&h=250&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2'
				},
				{
					image:'https://th.bing.com/th?id=OIP.ueWoSOP2NBNORHxxLiuXxQHaHa&w=250&h=250&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2'
				},
				{
					image:'https://th.bing.com/th?id=OIP.iattzUh9ORYsWdrgKMmAWAHaHU&w=251&h=248&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2'
				},
				{
					image:'https://th.bing.com/th?id=OIP.EreFd3Q7maWqVepcPb_hdQHaHa&w=250&h=250&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2'
				},
				{
					image:'https://th.bing.com/th?id=OIP.V1yjhU6ibQ4itHxQV-KTugHaG_&w=257&h=242&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2'
				},
			]
		},
		{
			name:'Roadway',
			totalTasks:28,
			color:'bg-orange-600',
			completedTasks:15,
			clients:[
				{
					image:'https://th.bing.com/th?id=OIP.ViGlpoU2qdl9vGC1mxhpNgHaHa&w=250&h=250&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2'
				},
				{
					image:'https://th.bing.com/th?id=OIP.Tv3oG-Is7dcMNcysxIVwLAHaHa&w=250&h=250&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2'
				},
				{
					image:'https://th.bing.com/th?id=OIP.ueWoSOP2NBNORHxxLiuXxQHaHa&w=250&h=250&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2'
				},
				{
					image:'https://th.bing.com/th?id=OIP.iattzUh9ORYsWdrgKMmAWAHaHU&w=251&h=248&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2'
				},
				{
					image:'https://th.bing.com/th?id=OIP.EreFd3Q7maWqVepcPb_hdQHaHa&w=250&h=250&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2'
				},
				{
					image:'https://th.bing.com/th?id=OIP.V1yjhU6ibQ4itHxQV-KTugHaG_&w=257&h=242&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2'
				},
			]
		},
		{
			name:'Construction',
			totalTasks:70,
			color:'bg-indigo-600',
			completedTasks:25,
			clients:[
				{
					image:'https://th.bing.com/th?id=OIP.ViGlpoU2qdl9vGC1mxhpNgHaHa&w=250&h=250&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2'
				},
				{
					image:'https://th.bing.com/th?id=OIP.Tv3oG-Is7dcMNcysxIVwLAHaHa&w=250&h=250&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2'
				},
				{
					image:'https://th.bing.com/th?id=OIP.ueWoSOP2NBNORHxxLiuXxQHaHa&w=250&h=250&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2'
				},
				{
					image:'https://th.bing.com/th?id=OIP.iattzUh9ORYsWdrgKMmAWAHaHU&w=251&h=248&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2'
				},
				{
					image:'https://th.bing.com/th?id=OIP.EreFd3Q7maWqVepcPb_hdQHaHa&w=250&h=250&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2'
				},
				{
					image:'https://th.bing.com/th?id=OIP.V1yjhU6ibQ4itHxQV-KTugHaG_&w=257&h=242&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2'
				},
			]
		},
		{
			name:'Bridge',
			totalTasks:40,
			color:'bg-green-600',
			completedTasks:25,
			clients:[
				{
					image:'https://th.bing.com/th?id=OIP.ViGlpoU2qdl9vGC1mxhpNgHaHa&w=250&h=250&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2'
				},
				{
					image:'https://th.bing.com/th?id=OIP.Tv3oG-Is7dcMNcysxIVwLAHaHa&w=250&h=250&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2'
				},
				{
					image:'https://th.bing.com/th?id=OIP.ueWoSOP2NBNORHxxLiuXxQHaHa&w=250&h=250&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2'
				},
				{
					image:'https://th.bing.com/th?id=OIP.iattzUh9ORYsWdrgKMmAWAHaHU&w=251&h=248&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2'
				},
				{
					image:'https://th.bing.com/th?id=OIP.EreFd3Q7maWqVepcPb_hdQHaHa&w=250&h=250&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2'
				},
				{
					image:'https://th.bing.com/th?id=OIP.V1yjhU6ibQ4itHxQV-KTugHaG_&w=257&h=242&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2'
				},
			]
		},


	]

	return(
		<div className="w-full md:px-8 px-4 mt-5">

			<div className="bg-white md:p-4 p-2 flex flex-col rounded-lg shadow-lg shadow-gray-200/40">
				<div className="flex items-center justify-between w-full">
					<div className="flex flex-col gap-1">
						<h1 className="text-lg font-semibold text-gray-900">Ongoing projects</h1>
						<p className="leading-none text-gray-600 text-sm">Projects that are active</p>
					</div>
					<div className="flex items-center gap-3 pr-5">
						<HiArrowRight onClick={()=>{
							router.push(`/clientSpecial/${currentUser?.name?.replace(" ",'')}`)
						}} className="h-6 w-6 hover:scale-[105%] transition-all duration-200 
						ease-in-out text-blue-500 cursor-pointer"/>
					</div>
				</div>
				<div className="grid sm:grid-cols-2 grid-cols-1 lg:grid-cols-4 md:grid-cols-3 gap-3 mt-3">
					{
						currentProjects?.map((project,j)=>(
							<div key={j} className="bg-white flex flex-col p-3 rounded-md shadow-[1px_1px_19px_-8px_rgba(0,0,0,0.2)]">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<div className={`h-7 w-7 flex items-center justify-center 
										rounded-full ${colors[j % colors.length]} `}>
											<h1 className="text-md font-bold text-white">{project?.name?.split('')[0]}</h1>
										</div>
										<h1 className="text-md font-semibold text-black">{project.industry}</h1>
									</div>
									<div className="hover:bg-gray-200/40 cursor-pointer rounded-full transition-all duration-200 ease-in-out p-1">
										<BsThreeDotsVertical className="h-4 w-4 text-gray-600"/>
									</div>
								</div>
								<h1 className="text-sm font-semibold text-gray-700 flex items-center gap-1 px-[2px] mt-2">
									<GrProjects className="h-3 w-3"/>
									{project?.name}
								</h1>
								<div className="flex flex-col gap-2 mt-2">
									<div className="w-full justify-between gap-2 flex md:flex-row flex-col">
										<h1 className="text-gray-500 font-semibold text-xs">Total Progress</h1>
										<h1 className="text-gray-500 font-semibold text-xs">{project?.progress}%</h1>
									</div>
									<div className="w-full h-[6px] rounded-lg overflow-hidden bg-gray-200">
										<div style={{
											width:`${project?.progress}%`
										}} className={`h-full bg-blue-600`} />
									</div>
								</div>
								<div className="w-full flex items-center justify-between mt-4">
									<div className="flex">
										{
											[
												{
													image:'https://th.bing.com/th?id=OIP.ViGlpoU2qdl9vGC1mxhpNgHaHa&w=250&h=250&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2'
												},
												{
													image:'https://th.bing.com/th?id=OIP.Tv3oG-Is7dcMNcysxIVwLAHaHa&w=250&h=250&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2'
												},
												{
													image:'https://th.bing.com/th?id=OIP.ueWoSOP2NBNORHxxLiuXxQHaHa&w=250&h=250&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2'
												},
												{
													image:'https://th.bing.com/th?id=OIP.iattzUh9ORYsWdrgKMmAWAHaHU&w=251&h=248&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2'
												},
												{
													image:'https://th.bing.com/th?id=OIP.EreFd3Q7maWqVepcPb_hdQHaHa&w=250&h=250&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2'
												},
												{
													image:'https://th.bing.com/th?id=OIP.V1yjhU6ibQ4itHxQV-KTugHaG_&w=257&h=242&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2'
												},
											]?.map((client,j)=>(
												<img key={j} className={`h-5 -mx-[3px] w-5 ${j > 5 && 'hidden'} rounded-full`} src={client?.image}
												/>	
											))
										}
									</div>
									<h1 onClick={()=>{
										setCurrentProject(project);
										if(project?.industry?.toLowerCase() === 'solar'){
											router.push(`/clientSpecial/${currentUser?.name}/thermal?id=${project?._id}`)
										}else{
											router.push(`/clientSpecial/${currentUser?.name}/inspection?id=${project?._id}`)
										}

									}} className="flex items-center text-xs hover:text-blue-500 cursor-pointer text-gray-600">
										More info <AiOutlineDoubleRight className="h-3 w-3"/>
									</h1>
								</div>


							</div>


						))
					}

				</div>

			</div>



		</div>


	)
}