"use client"
import {useState,useEffect} from 'react';
import axios from 'axios';
import {getProjectById,getClientById} from '../utils/ApiRoutes';
import PilotHeader from './pilot/PilotHeader';
import {sideBarExtendState,currentUserState} from '../atoms/userAtom';
import {useRecoilState} from 'recoil'
import ImportantNotify from './DashboardComponents/ImportantNotify'
import {BiCategoryAlt} from 'react-icons/bi';
import {HiOutlineLocationMarker,HiOutlineMail} from 'react-icons/hi';
import {AiOutlineTeam} from 'react-icons/ai';
import ProjectInfoMain from './PilotProjectComponents/ProjectInfoMain';
import TeamInfoMain from './PilotProjectComponents/TeamInfoMain';

export default function PilotProjectDetails({params}) {
	const [currentProject,setCurrentProject] = useState('');
	const [loading,setLoading] = useState(true);
	const [currentUser,setCurrentUser] = useRecoilState(currentUserState)
	const [sideBarExtend,setSideBarExtend] = useRecoilState(sideBarExtendState);
	const [currentTab,setCurrentTab] = useState('projectInfo')

	const fetchCurrentProject = async() => {
		const {data} = await axios.post(getProjectById,{
			id:params?.projectId
		})
		if(data?.status){
			setCurrentProject(data?.project[0]);
			setLoading(false)
		}
		console.log(data)
	}


	useEffect(()=>{
	    // fetchTempUser()
	  },[])

	  const fetchTempUser = async() => {
	    const {data} = await axios.post(getClientById,{
	      clientId:'65341160546f3e72bce9dfcc'
	    })
	    if(data.status){
	      setCurrentUser(data?.user);
	    }
	  }
	  

	useEffect(()=>{
		if(!currentProject){
			fetchCurrentProject()
		}
	},[])

	if(loading){
		return (
			<main className="w-full flex items-center flex-col gap-5 justify-center">
				<span className="loader"/>
				<h1 className="text-xl font-semibold text-blue-600 animate-pulse">Loading...</h1>
			</main>
		)
	}

	return (
		<main className={`h-full ${sideBarExtend ? 'w-full' : 'w-[100%]'} transition-all duration-300 ease-in-out bg-gray-50 pb-5 overflow-y-auto`}>
			<PilotHeader />
			<div className={`w-full z-45  ${currentTab === 'map' ? 'fixed top-2 right-2' : 'relative'} flex items-center justify-end mt-3 px-5`}>
				<div className="flex bg-white items-center border-[1px] border-gray-400 rounded-md overflow-hidden">
					<div onClick={()=>{
						setCurrentTab('projectInfo')
					}} className={`border-r-[1px] ${currentTab === 'projectInfo' ? 'bg-blue-500 text-white border-blue-400' : 'hover:bg-gray-200 text-gray-700 border-gray-400'} p-1 cursor-pointer 
					transition-all duration-200 ease-in-out`}>
						<BiCategoryAlt className="h-4 w-4"/>
					</div>
					<div onClick={()=>{
						setCurrentTab('map')
					}} className={`border-r-[1px] ${currentTab === 'map' ? 'bg-blue-500 text-white border-blue-400' : 'hover:bg-gray-200 text-gray-700 border-gray-400'} p-1 cursor-pointer 
					transition-all duration-200 ease-in-out`}>
						<HiOutlineLocationMarker className="h-4 w-4"/>
					</div>
					<div onClick={()=>{
						setCurrentTab('clientsInfo')
					}} className={`border-r-[1px] ${currentTab === 'clientsInfo' ? 'bg-blue-500 text-white border-blue-400' : 'hover:bg-gray-200 text-gray-700 border-gray-400'} p-1 cursor-pointer 
					transition-all duration-200 ease-in-out`}>
						<AiOutlineTeam className="h-4 w-4"/>
					</div>
				</div>
			</div>
			{
				currentTab === 'projectInfo' ? 
				<ProjectInfoMain project={currentProject} setProject={setCurrentProject} />
				:
				currentTab === 'clientsInfo' ? 
				<TeamInfoMain project={currentProject} />
				:
				''
			}


		</main>

	)
}