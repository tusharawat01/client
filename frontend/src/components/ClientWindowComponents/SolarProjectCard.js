"use client"
import {currentUserState,currentProjectState} from '../../atoms/userAtom';
import {useRecoilState} from 'recoil'	
import {LiaIndustrySolid} from 'react-icons/lia';
import {TbMapPin2} from 'react-icons/tb';
import {useRouter} from 'next/navigation'
import { IoLocationOutline } from "react-icons/io5";

export default function SolarProjectCard({k,project}) {
	const [currentUser,setCurrentUser] = useRecoilState(currentUserState);
	const [currentProject,setCurrentProject] = useRecoilState(currentProjectState)
	const router = useRouter();

	return (
		<div key={k} 
		onClick={()=>{
			setCurrentProject(project);
			router.push(`/clientSpecial/${currentUser?.name}/thermal?id=${project?._id}`)
		}}
		className="flex flex-col border-[1px] rounded-lg border-gray-700 overflow-hidden cursor-pointer group">
			<div className="w-full overflow-hidden aspect-[16/9]">
				<img src={project?.referenceImage}
				alt="Loading..."
				className="w-full object-cover h-full group-hover:scale-110 transition-all duration-300 ease-in-out"/>
			</div>
			<div className="flex flex-col gap-1 px-4 py-2 mt-1 gap-2 group-hover:bg-gray-900 transition-all duration-200 ease-in-out">
				<h1 className="text-md leading-none font-semibold text-gray-100">{project?.name}</h1>
				<h1 className="text-sm leading-none font-semibold text-gray-100">{project?.type}</h1>
				<h1 className="text-xs leading-none flex mt-2 items-center gap-1 text-gray-200">
					<IoLocationOutline className="h-4 w-4"/>
					{project?.projectLocation || project?.projectArea}
				</h1>
				<h1 className="text-xs leading-none flex items-center gap-1 text-gray-200">
					<LiaIndustrySolid className="h-4 w-4"/>
					{project?.industry}
				</h1>
				<h1 className="text-xs leading-none flex items-center gap-1 text-gray-200">
					<TbMapPin2 className="h-4 w-4"/>
					{project?.coordinates?.latitude}, {project?.coordinates?.longitude}
				</h1>
				<div className="flex flex-col gap-2 mt-2 py-1">
					<div className="w-full flex items-center justify-between">
					<h1 className="leading-none text-sm font-mono text-gray-200">
						Status
					</h1>
					<h1 className="leading-none text-sm font-mono text-gray-200">
						Progress {project?.progress}%
					</h1>
					</div>

					<div className="w-full h-2 overflow-hidden rounded-full bg-gray-700">
						<div style={{
							width:`${project?.progress}%`
						}}
						className="h-full bg-gradient-to-r from-purple-500 to-pink-600"/>
					</div>

				</div>


			</div>
		</div>
	)

}