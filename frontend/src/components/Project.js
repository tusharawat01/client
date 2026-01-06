"use client"
import Header from './Header';
import dynamic from 'next/dynamic';
import {currentUserState,sideBarExtendState} from '../atoms/userAtom';
import {useRecoilState} from 'recoil'
import {AiOutlinePlusCircle} from 'react-icons/ai';
import { VscProject } from "react-icons/vsc";
import RequestComponent from './ProjectComponents/RequestComponent';
import ProjectCardComponent from './ProjectComponents/ProjectCardComponent';
import {useRouter} from 'next/navigation';
// const NewProjectForm = dynamic(() => import('./NewProjectComponents/NewProjectForm'), {
//   ssr: false,
// })
export default function NewProject() {
	// body...
	const [currentUser,setCurrentUser] = useRecoilState(currentUserState);
	const [sideBarExtend,setSideBarExtend] = useRecoilState(sideBarExtendState);
	const router = useRouter();

	console.log(currentUser)

	return (
		<main className={`h-full ${sideBarExtend ? 'sm:w-[81%] xs:w-[86%] w-[100%]' : 'w-[100%]'} transition-all duration-300 ease-in-out bg-gray-50 pb-5 overflow-y-auto`}>
			<Header />
			<div className="w-[97%] mx-auto bg-gray-300/70 h-[1px]"/>
			<div className="w-full py-2 px-4 flex items-center justify-end gap-5">
				<button onClick={()=>{
					router.push('/projectRequests');
				}} 
				className="text-white bg-blue-600 pr-7 pl-5 cursor-pointer py-2 flex items-center gap-2 rounded-lg border-[1px] border-gray-300">
					<VscProject className="text-white h-5 w-5" /> Project Requests
				</button>
				<button onClick={()=>{
					router.push('/newproject');
				}} 
				className="text-white bg-blue-600 pr-7 pl-5 cursor-pointer py-2 flex items-center gap-2 rounded-lg border-[1px] border-gray-300">
					<AiOutlinePlusCircle className="text-white h-5 w-5" /> New project
				</button>
			</div>
			{
				currentUser?.projectRequestsId?.length > 0 &&
				<div className="md:px-10 w-full py-2 px-4">
					<h1 className="text-lg text-black">Ongoing Projects</h1>	
				</div>
			}
			<ProjectCardComponent currentUser={currentUser} />
			{/*{
							currentUser?.projectRequestsId?.length > 0 &&
							<div className="md:px-10 w-full py-2 mt-5 px-4">
								<h1 className="text-lg text-black">Your Project Requests</h1>	
							</div>
						}		
						<RequestComponent />*/}
		</main>

	)
}