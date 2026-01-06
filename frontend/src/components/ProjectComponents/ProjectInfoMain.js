"use client"
import {BsThreeDotsVertical} from 'react-icons/bs';
import {AiOutlineDelete,AiOutlineClockCircle,AiFillTags,
	AiOutlinePlusCircle} from 'react-icons/ai';
import {useState,useEffect} from 'react'
import {TfiLocationPin} from 'react-icons/tfi';
import {LiaIndustrySolid,LiaCommentsSolid} from 'react-icons/lia';
import ReactPlayer from 'react-player/lazy'
import {changeStatusById,addCommentsToProjectById,createProject,getClientById,
	getAllPilots,updatePilots,updateAssignedProjectsInPilot,updateProcessingTeam} from '../../utils/ApiRoutes';
import {updateAssignedProjectsInProcessingTeam,getAllProcessingTeam} from '../../utils/processingTeamApiRoutes';
import {FiChevronDown} from 'react-icons/fi'
import {MdOutlineLocalPhone,MdOutlineKeyboardDoubleArrowRight} from 'react-icons/md';
import axios from 'axios';
import {currentUserState} from '../../atoms/userAtom';
import {useRecoilState} from 'recoil';
import {useRouter} from 'next/navigation';
import {BiLogoGmail} from 'react-icons/bi';
import {IoMdClose,IoMdCall} from 'react-icons/io';
import OverviewTab from './ProjectInfoMainComponents/OverviewTab'
import DocumentsTab from './ProjectInfoMainComponents/DocumentsTab';
import DeliverablesTab from './ProjectInfoMainComponents/DeliverablesTab';
import CommentsCard from './ProjectInfoMainComponents/CommentsCard';
import FilesTab from './ProjectInfoMainComponents/FilesTab';
import PilotsTab from './ProjectInfoMainComponents/PilotsTab';
import ProcessingTeam from './ProjectInfoMainComponents/ProcessingTeam';
import {RxCross2} from 'react-icons/rx';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ProjectInfoMain({project,setProject}) {
	// body...
	const [revealDelete,setRevealDelete] = useState(false);
	const [status,setStatus] = useState('');
	const [revealStatusOption,setRevealStatusOption] = useState(false);
	const [statusLoading,setStatusLoading] = useState(false);
	const [currentUser,setCurrentUser] = useRecoilState(currentUserState);
	const [currentTab,setCurrentTab] = useState('Overview');
	const [commentText,setCommentText]  = useState('');
	const [loading,setLoading] = useState(false);
	const [showContactTab,setShowContactTab] = useState(false);
	const [contacts,setContacts] = useState([]);
	const [teamMembers,setTeamMembers] = useState([]);
	const [showNumberCopy,setShowNumberCopy] = useState(false);
	const [allPilots,setAllPilots] = useState([]);
	const [allProcessingTeam,setAllProcessingTeam] = useState([]);
	const [openPilotsAddTab,setOpenPilotsAddTab] = useState(false);
	const [openProcessingTeamAddTab,setOpenProcessingTeamAddTab] = useState(false);
	const [assigningPilot,setAssigningPilot] = useState(false);
	const [assigningProcessingTeam,setAssigningProcessingTeam] = useState(false);
	const [removePilotConfirmationTab,setRemovePilotConfirmationTab] = useState('');
	const [removeProcessingTeamConfirmationTab,setRemoveProcessingTeamConfirmationTab] = useState('');
	const router = useRouter();
	const comments = []
	// {
	// 	image:"",
	// 	name:"",
	// 	comment:"",
	// 	likes:[],
	// 	replies:[]
	// }

	function generateRandomUUID() {
	    const uuid = Array.from({ length: 8 }, () => Math.floor(Math.random() * 10)).join('');
	    return uuid;
	}



	function isSafeString(inputString) {
	    const allowedCharacters = /^[a-zA-Z0-9!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]+$/;
	    return true
	    // if (allowedCharacters.test(inputString)) {
	    //     // Check for the absence of potentially malicious items
	    //     // const maliciousItems = ['<script>', '&&', '===']; // Add more items as needed
	    //     // for (const item of maliciousItems) {
	    //     //     if (inputString.includes(item)) {
	    //     //         return false;
	    //     //     }
	    //     // }
	    //     return true;
	    // } else {
	    //     return false;
	    // }
	}

	const addLikes = async() => {

	}


	const addComment = async() => {
		if(isSafeString(commentText)){
			setLoading(true);
			const uuid = await generateRandomUUID();

			const newcomment = {
				image:currentUser?.image,
				name:currentUser?.name,
				comment:commentText,
				likes:[],
				replies:[],
				commentId:uuid,
				createAt:new Date().toISOString()
			}
			const currentComments = [newcomment,...project?.comments];

			const {data} = await axios.post(`${addCommentsToProjectById}?industry=${project?.industry}`,{
				id:project?._id,
				comments:currentComments
			})
			console.log(data);
			if(data?.status){
				setCommentText('');
				setProject(data?.project);
				setLoading(false);
			}else{
				alert("Cant add comment, something went wrong!")
				setLoading(false);
			}
		}else{
			alert("Comment text contains suspecious symbols or items");
		}
	}

	const addReply = async(replyText,commentId) => {
		let comments = [...project?.comments];
		const uuid = await generateRandomUUID();
		let newreply = {
			name:currentUser?.name,
			image:currentUser?.image,
			replyText,replyId:uuid,likes:[],
			createAt:new Date().toISOString()
		}
		const idx = comments.findIndex(comment=>{
			if(comment?.commentId === commentId){
				return true
			}
		})
		if(idx > -1){
			setLoading(true);
			let comment = comments[idx];
			let newreplies = [newreply,...comment.replies]; 			
			const updatedComment = {
				...comment,
				replies:newreplies
			}
			console.log(updatedComment);
			comments[idx] = updatedComment;
			const {data} = await axios.post(`${addCommentsToProjectById}?industry=${project?.industry}`,{
				comments,id:project?._id
			})
			if(data?.status){
				setProject(data?.project);
				setLoading(false)
			}else{
				setLoading(false)
			}
		}
	}

	const likeComment = async(commentId) => {
		let comments = [...project?.comments];
		const idx = comments.findIndex(comment=>{
			if(comment?.commentId === commentId){
				return true
			}
		})
		if(idx > -1){
			let comment = comments[idx];
			if(comment?.likes?.includes(currentUser._id)){
				let newlikes = [...comment?.likes];
				const idx2 = newlikes.findIndex(like=>{
					if(like === currentUser?._id){
						return true
					}
					return false
				})
				if(idx2 > -1){
					newlikes.splice(idx2,1);
					const updatedComment = {
						...comment,
						likes:newlikes
					}
					comments[idx] = updatedComment;
					const {data} = await axios.post(`${addCommentsToProjectById}?industry=${project?.industry}`,{
						comments,id:project?._id
					})
					if(data?.status){
						setProject(data?.project);
					}
				}
			}else{
				let newlikes = [currentUser._id,...comment?.likes];
				const updatedComment = {
					...comment,
					likes:newlikes
				}
				comments[idx] = updatedComment;
				const {data} = await axios.post(`${addCommentsToProjectById}?industry=${project?.industry}`,{
					comments,id:project?._id
				})
				if(data?.status){
					setProject(data?.project);
				}
			}
		}
	}

	const updateComment = async(commentId,replies) => {
		let comments = [...project?.comments];
		const idx = comments.findIndex(comment=>{
			if(comment.commentId === commentId){
				return true
			}
			return false
		})
		if(idx > -1){
			let comment = comments[idx]
			let updatedComment = {
				...comment,
				replies
			}
			comments[idx] = updatedComment;
			const {data} = await axios.post(`${addCommentsToProjectById}?industry=${project?.industry}`,{
				comments,id:project?._id
			})
			if(data?.status){
				setProject(data?.project);
				setLoading(false)
			}else{
				setLoading(false)
			}
		}
	}

	const fetchMember = async(arr = [], j = 0) => {
		const {data} = await axios.post(getClientById,{
			clientId:project?.teamMembers[j]._id
		})

		if(data?.status){
			let newArr = [data?.user,...arr];
			if(j+1 < project?.teamMembers?.length){
				fetchMember(newArr,j+1);
			}else{
				setTeamMembers(newArr);
			}
		}else{
			alert("Something went wrong!")
		}
	}

	// const addGuestsToContacts = (adminContact) => {
	// 	let contactDetails = [];
	// 	for(let i = 0; i < project?.teamMembers?.length; i++){
	// 		const guestDetail = {
	// 			name:project?.teamMembers[i]?.name,
	// 			image:project?.teamMembers[i]?.image,
	// 			number:project?.teamMembers[i]?.number,
	// 			email:project?.teamMembers[i]?.email
	// 		}	
	// 		console.log(guestDetail,project?.teamMembers)
	// 		contactDetails.push(guestDetail);
	// 		if(i+1 === project?.teamMembers?.length){
	// 			contactDetails = [adminContact,...contactDetails]
	// 			setContacts(contactDetails);
	// 		}
	// 	}
	// }

	const addClientToContacts = () => {
		if(project?.teamMembers?.length > 0){
			// addGuestsToContacts(newContacts)
			fetchMember()
		}
	}

	useEffect(()=>{
		if(project){
			setContacts([]);
			addClientToContacts();	
		}
	},[project])

	useEffect(()=>{
		fetchAllPilots();
		fetchAllProcessingTeam();
	},[]);

	const fetchAllPilots = async() => {
		const {data} = await axios.post(getAllPilots,{
			key:"Wq1t9EDJVFfPXJXxjtL577/jETBDoUKeSz2KfclReCw="
		});
		if (data.status){
			setAllPilots(data?.pilot);
			console.log(data)
		}
	}

	const fetchAllProcessingTeam = async() => {
		const {data} = await axios.post(getAllProcessingTeam,{
			key:"Wq1t9EDJVFfPXJXxjtL577/jETBDoUKeSz2KfclReCw="
		});
		if (data.status){
			setAllProcessingTeam(data?.processingTeam);
			console.log(data)
		}
	}

	const copyNumber = (number) => {
		const textarea = document.createElement('textarea');
	    textarea.value = number;
	    document.body.appendChild(textarea);
	    textarea.select();
	    document.execCommand('copy');
	    document.body.removeChild(textarea);
	    setShowNumberCopy(true);
	    setTimeout(()=>{setShowNumberCopy(false)},3000)
	}

	const addPilotToProject = async(pilot) => {
		setAssigningPilot(true);
		let currPilots = [...project.pilots,pilot._id];
		let assignedProjects = [...pilot?.assignedProjects,project._id];
		const data2 = await axios.post(`${updateAssignedProjectsInPilot}/${pilot?._id}`,{
			assignedProjects
		})
		console.log(data2);
		const {data} = await axios.post(`${updatePilots}/${project._id}?industry=${project?.industry}`,{
			pilots:currPilots
		})
		if(data.status){
			setProject(data?.project);
			console.log(data);
			toast('Pilot Successfully added and notified!',toastOptions);
			setAssigningPilot(false);
		}
	} 

	const addProcessingTeamToProject = async(processingTeam) => {
		if(project?.processingTeam?.includes(processingTeam?._id)){
			alert("Already added in the project");
			return "Cancelled"
		}
		setAssigningProcessingTeam(true);
		let currProcessingTeam = [...project.processingTeam,processingTeam._id];
		let assignedProjects = [...processingTeam?.assignedProjects,project._id];
		const data2 = await axios.post(`${updateAssignedProjectsInProcessingTeam}/${processingTeam?._id}?industry=${project?.industry}`,{
			assignedProjects:[...new Set(assignedProjects)]
		})
		console.log(assignedProjects);
		console.log(data2);
		const {data} = await axios.post(`${updateProcessingTeam}/${project._id}?industry=${project?.industry}`,{
			processingTeam:currProcessingTeam
		})
		if(data.status){
			setProject(data?.project);
			console.log(data);
			toast('Processing Team Successfully added and notified!',toastOptions);
			setAssigningProcessingTeam(false);
		}
	} 

	const removeAssignedPilot = async() => {
		const pilotData = removePilotConfirmationTab;
		setRemovePilotConfirmationTab('');
		let currPilots = [...project.pilots];
		const idx = currPilots.findIndex(pilotID=>{
			if(pilotID === pilotData._id){
				return true
			}
			return false
		})
		if(idx > -1){
			currPilots.splice(idx,1);
			const {data} = await axios.post(`${updatePilots}/${project._id}?industry=${project?.industry}`,{
				pilots:currPilots
			})
			if(data.status){
				setProject(data?.project);
				toast('Pilot Successfully removed and notified!',toastOptions);
			}
		}
		let assignedProjectsData = [...pilotData.assignedProjects];
		const idx2 = assignedProjectsData.findIndex(projectData=>{
			if(projectData === project._id){
				return true
			}
			return false
		})
		if(idx2 > -1){
			assignedProjectsData.splice(idx2,1);
			const data2 = await axios.post(`${updateAssignedProjectsInPilot}/${pilotData?._id}`,{
				assignedProjects:assignedProjectsData
			})
			console.log(data2);
		}
	}

	// console.log(project)

	const removeAssignedPilotConfirmation = (pilot) => {
		setRemovePilotConfirmationTab(pilot);
	}

	const removeAssignedProcessingTeam = async() => {
		const processingTeamData = removeProcessingTeamConfirmationTab;
		setRemoveProcessingTeamConfirmationTab('');
		let currProcessingTeam = [...project.processingTeam];
		const idx = currProcessingTeam.findIndex(pilotID=>{
			if(pilotID === processingTeamData._id){
				return true
			}
			return false
		})
		if(idx > -1){
			currProcessingTeam.splice(idx,1);
			const {data} = await axios.post(`${updateProcessingTeam}/${project._id}?industry=${project?.industry}`,{
				processingTeam:currProcessingTeam
			})
			if(data.status){
				setProject(data?.project);
				toast('Pilot Successfully removed and notified!',toastOptions);
			}
		}
		console.log(removeProcessingTeamConfirmationTab)
		let assignedProjectsData = [...processingTeamData?.assignedProjects];
		const idx2 = assignedProjectsData.findIndex(projectData=>{
			if(projectData === project._id){
				return true
			}
			return false
		})
		console.log(idx2);
		if(idx2 > -1){
			assignedProjectsData.splice(idx2,1);
			const data2 = await axios.post(`${updateAssignedProjectsInProcessingTeam}/${processingTeamData?._id}`,{
				assignedProjects:assignedProjectsData
			})
			console.log(data2);
		}

	}

	const removeAssignedProcessingTeamConfirmation = (pilot) => {
		setRemoveProcessingTeamConfirmationTab(pilot);
	}

	const toastOptions =  {
		position: "top-left",
		autoClose: 5000,
		hideProgressBar: false,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: true,
		progress: undefined,
		theme: "light",
	}

	return (
		<div className="md:px-6 px-2">
			<ToastContainer />
			<div className={`fixed top-0 left-0 ${removePilotConfirmationTab ? 'h-full w-full' : 'h-0 w-0'} 
			backdrop-blur-lg bg-black/50 flex items-center justify-center z-50 overflow-hidden`}>
				<div className="md:w-[50%] w-[90%] flex flex-col px-2 py-3 bg-white rounded-lg border-[1px] border-gray-300 gap-2">
					<h1 className="text-md font-semibold text-gray-800">Confirm? Remove <span className="text-blue-500">{removePilotConfirmationTab?.name}</span> from project {project?.name}</h1>
					<div className="w-full h-[1.3px] bg-gray-300"/>
					<div className="w-full flex items-center justify-end mt-1 gap-2">
						<button 
						onClick={()=>setRemovePilotConfirmationTab('')}
						className="text-black rounded-lg px-4 py-1 hover:bg-gray-200 transition-all duration-200 ease-in-out font-medium text-md">Cancel</button>
						<button 
						onClick={removeAssignedPilot}
						className="text-white rounded-lg px-4 py-1 font-medium bg-red-500 hover:bg-red-600 text-md">Remove</button>
					</div>
				</div>
			</div>
			<div className={`fixed top-0 left-0 ${removeProcessingTeamConfirmationTab ? 'h-full w-full' : 'h-0 w-0'} 
			backdrop-blur-lg bg-black/50 flex items-center justify-center z-50 overflow-hidden`}>
				<div className="md:w-[50%] w-[90%] flex flex-col px-2 py-3 bg-white rounded-lg border-[1px] border-gray-300 gap-2">
					<h1 className="text-md font-semibold text-gray-800">Confirm? Remove <span className="text-blue-500">{removeProcessingTeamConfirmationTab?.name}</span> from project {project?.name}</h1>
					<div className="w-full h-[1.3px] bg-gray-300"/>
					<div className="w-full flex items-center justify-end mt-1 gap-2">
						<button 
						onClick={()=>setRemoveProcessingTeamConfirmationTab('')}
						className="text-black rounded-lg px-4 py-1 hover:bg-gray-200 transition-all duration-200 ease-in-out font-medium text-md">Cancel</button>
						<button 
						onClick={removeAssignedProcessingTeam}
						className="text-white rounded-lg px-4 py-1 font-medium bg-red-500 hover:bg-red-600 text-md">Remove</button>
					</div>
				</div>
			</div>
			<div className={`fixed ${openPilotsAddTab ? 'bottom-0' : '-bottom-[100%]'} right-0 flex flex-col rounded-t-lg border-[1px] 
			border-gray-300 border-b-[0px] overflow-hidden sm:h-[50%] transition-all duration-200 ease-in-out 
			sm:w-auto w-full h-[80%] z-50 bg-white`}>
				<div className="bg-[#3b3b3b] px-4 py-2 flex items-center gap-5 justify-between">
					<h1 className="text-md font-semibold text-white">Assign Pilots</h1>
					<div 
					onClick={()=>setOpenPilotsAddTab(false)}
					className="hover:bg-gray-500/50 rounded-full cursor-pointer p-[3px]">
						<RxCross2 className="text-gray-200 h-5 w-5"/>
					</div>
				</div>
				<div className="flex flex-col h-full overflow-y-auto relative scrollbar-md scrollbar-blue-500">
					<div className={`${assigningPilot ? 'absolute' : 'hidden'} top-0 left-0 z-30 h-full w-full bg-gray-100/60 flex items-center 
					justify-center`}>
						<span className="loader"/>
					</div>
					{
						allPilots.map((pilot,k)=>(
							<div key={k} className={`hover:bg-gray-100 px-3 py-2 border-b-[1px] 
							border-gray-300 relative flex items-center gap-5 justify-between`}>
								<div className={`${project?.pilots?.includes(pilot?._id) ? 'absolute' : 'hidden'} bg-gray-100/60 h-full w-full top-0 left-0`}/>
								<div className="flex items-center gap-2">
									<img src={pilot?.image} className="rounded-md h-10 w-10"/>
									<div className="flex flex-col gap-1">
										<h1 className="leading-none text-md font-normal text-gray-900">{pilot?.name}</h1>
										<span className="leading-none text-sm font-medium text-gray-800 flex items-center gap-1"> 
											<div className={`h-2 w-2 rounded-full ${pilot.status === 'Available' ? 'bg-green-500' : pilot.status === 'Busy' ? 'bg-red-500' : pilot.status === 'Away' ? 'bg-orange-400' : 'bg-sky-500' }`}/>
											{pilot?.status}
										</span>
									</div>
								</div>
								<div onClick={()=>addPilotToProject(pilot)} 
								className="p-1 rounded-full hover:bg-gray-200 text-gray-800 cursor-pointer hover:text-blue-500">
									<AiOutlinePlusCircle className="h-6 w-6"/>
								</div>
							</div>
						))
					}
				</div>
			</div>
			<div className={`fixed ${openProcessingTeamAddTab ? 'bottom-0' : '-bottom-[100%]'} right-0 flex flex-col rounded-t-lg border-[1px] 
			border-gray-300 border-b-[0px] overflow-hidden sm:h-[50%] transition-all duration-200 ease-in-out 
			sm:w-auto w-full h-[80%] z-50 bg-white`}>
				<div className="bg-[#3b3b3b] px-4 py-2 flex items-center gap-5 justify-between">
					<h1 className="text-md font-semibold text-white">Assign Processing Team</h1>
					<div 
					onClick={()=>setOpenProcessingTeamAddTab(false)}
					className="hover:bg-gray-500/50 rounded-full cursor-pointer p-[3px]">
						<RxCross2 className="text-gray-200 h-5 w-5"/>
					</div>
				</div>
				<div className="flex flex-col h-full overflow-y-auto relative scrollbar-md scrollbar-blue-500">
					<div className={`${assigningProcessingTeam ? 'absolute' : 'hidden'} top-0 left-0 z-30 h-full w-full bg-gray-100/60 flex items-center 
					justify-center`}>
						<span className="loader"/>
					</div>
					{
						allProcessingTeam.map((PT,k)=>(
							<div key={k} className={`hover:bg-gray-100 px-3 py-2 border-b-[1px] 
							border-gray-300 relative flex items-center gap-5 justify-between`}>
								<div className={`${project?.processingTeam?.includes(PT?._id) ? 'absolute' : 'hidden'} bg-gray-100/60 h-full w-full top-0 left-0`}/>
								<div className="flex items-center gap-2">
									<img src={PT?.image} className="rounded-md h-10 w-10"/>
									<div className="flex flex-col gap-1">
										<h1 className="leading-none text-md font-normal text-gray-900">{PT?.name}</h1>
										<span className="leading-none text-sm font-medium text-gray-800 flex items-center gap-1"> 
											<div className={`h-2 w-2 rounded-full ${PT?.status === 'Available' ? 'bg-green-500' : PT?.status === 'Busy' ? 'bg-red-500' : PT?.status === 'Away' ? 'bg-orange-400' : 'bg-sky-500' }`}/>
											{PT?.status}
										</span>
									</div>
								</div>
								<div onClick={()=>addProcessingTeamToProject(PT)} 
								className="p-1 rounded-full hover:bg-gray-200 text-gray-800 cursor-pointer hover:text-blue-500">
									<AiOutlinePlusCircle className="h-6 w-6"/>
								</div>
							</div>
						))
					}
				</div>
			</div>
			<div className={`fixed h-full w-full ${showContactTab ? 'left-0' : '-left-[100%]'} flex items-center 
			justify-center bg-black/30 z-50 top-0 transition-all duration-200 ease-in-out`}>
				<div className={`fixed z-50 pl-4 pr-5 py-2 rounded-lg bottom-5 ${showNumberCopy ? 'right-5' : '-right-[100%]'} transition-all duration-200 ease-in-out
				bg-green-500 text-white font-semibold flex items-center justify-center gap-2 text-sm`}>
					<IoMdCall className="h-5 w-5"/> Number copied!
				</div>
				<div className="relative m-auto lg:w-[40%] md:w-[60%] border-[1px] border-gray-300/50 sm:w-[80%] sm:max-h-[85%] 
				h-full w-full sm:rounded-3xl bg-white pb-3 overflow-y-scroll 
				scrollbar-none flex flex-col">
					<div className="flex py-3 sticky top-0 bg-white backdrop-blur-lg items-center gap-5 px-2 border-[1px] border-gray-300">
						<div 
						onClick={()=>{
							setShowContactTab(false);
						}}
						className="p-2 hover:bg-gray-300 cursor-pointer transition-all duration-200 ease-in-out rounded-full">
							<IoMdClose className="h-5 w-5 cursor-pointer text-black"/>
						</div>
						<h1 className="text-xl select-none text-black font-semibold">Contacts</h1>
					</div>
					<div className="w-full h-full overflow-y-auto scrollbar-none md:px-3 py-3 flex flex-col">
						<div className="w-full p-2 flex gap-2">
							<img src={project?.clientDetails?.image} alt=""
							className="h-10 w-10 border-gray-300 rounded-full hover:border-blue-400 border-2"

							/>
							<div className="flex flex-col">
								<h1 className="text-md font-semibold break-all text-gray-800 flex items-center gap-1">{project?.clientDetails?.name} <MdOutlineKeyboardDoubleArrowRight className="h-4 w-4 text-sky-600"/><span className="flex items-center cursor-pointer text-sky-600 hover:underline hover:text-sky-500 gap-1 text-sm font-normal">{project?.clientDetails?.roles}</span></h1>
								<div 
								onClick={()=>copyNumber(project?.clientDetails?.number)}
								className="flex text-sm items-center break-all gap-1 text-gray-800 hover:underline hover:text-black cursor-pointer">
									<IoMdCall className="h-4 w-4"/> <MdOutlineKeyboardDoubleArrowRight className="h-4 w-4 text-sky-600"/> {project?.clientDetails?.number}
								</div>
								<div className="flex text-sm items-center break-all gap-1 text-gray-800 hover:underline hover:text-black cursor-pointer">
									<BiLogoGmail className="h-4 w-4"/> <MdOutlineKeyboardDoubleArrowRight className="h-4 w-4 text-sky-600"/> {project?.clientDetails?.email}
								</div>
							</div>
						</div>
						{
							teamMembers.map((contact,j)=>(
								<div key={j} className="w-full p-2 flex gap-2">
									<img src={contact?.image} alt=""
									className="h-10 w-10 border-gray-300 rounded-full hover:border-blue-400 border-2"

									/>
									<div className="flex flex-col">
										<h1 className="text-md font-semibold text-gray-800 break-all flex items-center gap-1">{contact?.name} <MdOutlineKeyboardDoubleArrowRight className="h-4 w-4 text-sky-600"/><span className="flex items-center cursor-pointer text-sky-600 hover:underline hover:text-sky-500 gap-1 text-sm font-normal">{contact?.roles.includes('User') ? 'Guest' : contact?.roles}</span></h1>
										<div 
										onClick={()=>copyNumber(project?.clientDetails?.number)}
										className="flex text-sm items-center break-all gap-1 text-gray-800 hover:underline hover:text-black cursor-pointer">
											<IoMdCall className="h-4 w-4"/> <MdOutlineKeyboardDoubleArrowRight className="h-4 w-4 text-sky-600"/> {contact?.number}
										</div>
										<div className="flex text-sm items-center break-all gap-1 text-gray-800 hover:underline hover:text-black cursor-pointer">
											<a href={`mailto:${contact?.email}`} className="flex items-center gap-1" target="_blank"><BiLogoGmail className="h-4 w-4"/> <MdOutlineKeyboardDoubleArrowRight className="h-4 w-4 text-sky-600"/> {contact?.email}</a>
										</div>
									</div>
								</div>
							))
						}
					</div>
				</div>
			</div>

			<div className="w-full mt-3 p-3 rounded-xl border-[1px] border-gray-200 bg-white w-full">
				<div className="flex items-center justify-between  pt-0 pb-0 px-2"> 
					<h1 className="text-black text-lg font-semibold">{project?.name}</h1>
					<div className="gap-2 flex items-center">
						

						<button className="border-[1px] border-gray-300 rounded-md text-sky-600 
						px-4 py-1 hover:bg-blue-600 transition-all duration-200 ease-in-out text-xs hover:text-white">
							Project info
						</button>
						<div className="hover:bg-gray-200/50 relative transition-all duration-200 p-1 
						cursor-pointer ease-in-out rounded-full">
							<div className={`right-2 z-40 ${revealDelete ? 'absolute' : 'hidden' } top-8 bg-white rounded-md border-[1px] border-gray-200 flex flex-col`}>
								<button 
								onClick={()=>{
									setRevealDelete(false);
									document.getElementById('accept-button').scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
								}}
								className="flex border-b-[1px] transition-all duration-200 ease-in-out hover:bg-gray-200/50 border-gray-300 items-center text-sky-600 gap-1 text-xs px-3 py-1">
									<FiChevronDown className="h-3 w-3"/>
									Accept
								</button>
								<div className="px-3 py-1 hover:bg-gray-200/50 text-xs text-gray-700 hover:text-red-700 transition-all duration-200 ease-in-out flex items-center gap-1">
									<AiOutlineDelete className="h-3 w-3"/> Reject
								</div>	
							</div>

							<BsThreeDotsVertical onClick={()=>{setRevealDelete(!revealDelete)}} className="text-gray-700 h-4 w-4"/>
						</div>
					</div>
				</div>

				<div className="h-[1px] w-[98%] mx-auto my-2 bg-[#EBE8FF]"/>
				<div className="flex md:flex-row md:items-center px-1 gap-3 flex-col justify-between">
					<div className="flex items-center gap-3 px-2 py-1 bg-gradient-to-r from-[#3c21f7]/10 rounded-md to-gray-50">
						<div className="rounded-full bg-blue-600 p-[6px]">
							<AiFillTags className="text-white h-4 w-4"/>
						</div>
						<span className="text-black text-sm">
							{project?.clientDetails?.organizationName}
						</span>
					</div>

					<div className="flex md:items-center gap-5 md:flex-row flex-col">
						<button 
						onClick={()=>setShowContactTab(true)}
						className="border-[1px] border-gray-300 rounded-md text-sky-600 
						px-3 py-2 hover:bg-blue-700 flex items-center gap-1 bg-indigo-300/20 transition-all duration-200 ease-in-out text-xs hover:text-white">
							<MdOutlineLocalPhone  className="h-4 w-4" /> Contact
						</button>
						<button 
						onClick={()=>{document.getElementById('comments-section').scrollIntoView({
							behavior:'smooth',
							block:'start'
						})}}
						className="border-[1px] border-gray-300 rounded-md text-sky-600 
						px-4 py-2 hover:bg-blue-700 bg-indigo-300/20 transition-all duration-200 ease-in-out text-xs hover:text-white">
							{project?.comments?.length} Comments
						</button>
						

					  <div className="flex items-center -space-x-4">
					  	<img src={project?.clientDetails?.image} alt="" className="relative inline-block h-[34px] w-[34px] rounded-full border-2 border-white object-cover object-center hover:z-10 focus:z-10" />
					  	{
					  		project?.teamMembers?.map((member,j)=>(
					  			<img key={j} src={member?.image} alt="" className={`relative inline-block h-[34px] w-[34px] rounded-full border-2 border-white object-cover object-center hover:z-10 focus:z-10 ${j > 3 && 'hidden'} rounded-full`}/>
					  		))
					  	}
					  </div>

					</div>

				</div>

				<div className="h-[1px] w-[98%] mx-auto my-2 bg-[#EBE8FF]"/>

				<div className="flex flex-col ">
					<div className="grid md:grid-cols-2 grid-cols-1">
						<div className="flex items-center gap-1">
							<div className="flex gap-1 items-center text-black font-semibold text-sm">
								<TfiLocationPin className="h-4 w-4 text-gray-500"/> Location :
							</div>
							<h1 className="text-sm text-gray-700">{project?.projectLocation || project?.projectArea}</h1>
						</div>
						<div className="flex mt-2 items-center gap-1">
							<div className="flex gap-1 items-center text-black font-semibold text-sm">
								<LiaIndustrySolid className="h-4 w-4 text-gray-500"/> Industry :
							</div>
							<h1 className="text-sm text-gray-700">{project?.industry}</h1>
						</div>
						<div className="flex mt-2 items-center gap-1">
							<div className="flex gap-1 items-center text-black font-semibold text-sm">
								<AiOutlineClockCircle className="h-4 w-4 text-gray-500"/> Start date :
							</div>
							<h1 className="text-sm text-gray-700">{project?.startDate}</h1>
						</div>
						<div className="flex mt-2 items-center gap-1">
							<div className="flex gap-1 items-center text-black font-semibold text-sm">
								<AiOutlineClockCircle className="h-4 w-4 text-gray-500"/> Deadline :
							</div>
							<h1 className="text-sm text-gray-700">{project?.deadline}</h1>
						</div>
					</div>
					<div className="h-[1px] w-[98%] mx-auto my-3 bg-[#EBE8FF]"/>

					<div className="w-full flex items-center flex-wrap gap-2">
	                    <button 
	                    onClick={()=>setCurrentTab('Overview')}
	                    className={`py-2 hover:bg-blue-600/10 transition-all duration-200 ease-in-out 
	                    hover:text-blue-600 text-md cursor-pointer px-7 border-t-[2px] 
	                    hover:border-blue-500 text-sm ${currentTab === 'Overview' ? 'border-blue-500 bg-blue-600/10 text-blue-600':'text-gray-700 border-gray-400 ' } `}>
	                        Overview
	                    </button>
	                    <button 
	                    onClick={()=>setCurrentTab('Documents')}
	                    className={`py-2 hover:bg-blue-600/10 transition-all duration-200 ease-in-out 
	                    hover:text-blue-600 text-md cursor-pointer px-7 border-t-[2px]
	                    hover:border-blue-500 text-sm ${currentTab === 'Documents' ? 'border-blue-500 bg-blue-600/10 text-blue-600':'text-gray-700 border-gray-400 ' } `}>
	                        Documents
	                    </button>
	                    <button 
	                    onClick={()=>setCurrentTab('Files')}
	                    className={`py-2 hover:bg-blue-600/10 transition-all duration-200 ease-in-out 
	                    hover:text-blue-600 text-md cursor-pointer px-7 border-t-[2px]
	                    hover:border-blue-500 text-sm ${currentTab === 'Files' ? 'border-blue-500 bg-blue-600/10 text-blue-600':'text-gray-700 border-gray-400 ' } `}>
	                        Files
	                    </button>
	                    <button 
	                    onClick={()=>setCurrentTab('Deliverables')}
	                    className={`py-2 hover:bg-blue-600/10 transition-all duration-200 ease-in-out 
	                    hover:text-blue-600 text-md cursor-pointer px-7 border-t-[2px]
	                    hover:border-blue-500 text-sm ${currentTab === 'Deliverables' ? 'border-blue-500 bg-blue-600/10 text-blue-600':'text-gray-700 border-gray-400 ' } `}>
	                        Deliverables
	                    </button>
	                    {
	                    	!currentUser?.roles?.includes("processingTeam") &&
		                    <button 
		                    onClick={()=>setCurrentTab('Pilots')}
		                    className={`py-2 hover:bg-blue-600/10 transition-all duration-200 ease-in-out 
		                    hover:text-blue-600 text-md cursor-pointer px-7 border-t-[2px]
		                    hover:border-blue-500 text-sm ${currentTab === 'Pilots' ? 'border-blue-500 bg-blue-600/10 text-blue-600':'text-gray-700 border-gray-400 ' } `}>
		                        Pilots
		                    </button>
	                    }
	                    <button 
	                    onClick={()=>setCurrentTab('Processing Team')}
	                    className={`py-2 hover:bg-blue-600/10 transition-all duration-200 ease-in-out 
	                    hover:text-blue-600 text-md cursor-pointer px-7 border-t-[2px]
	                    hover:border-blue-500 text-sm ${currentTab === 'Processing Team' ? 'border-blue-500 bg-blue-600/10 text-blue-600':'text-gray-700 border-gray-400 ' } `}>
	                        Processing Team
	                    </button>
	                </div>
					<div className="h-[1px] w-[98%] mx-auto my-3 bg-[#EBE8FF]"/>

					
				</div>
				{
					currentTab === 'Overview' ? 
					<OverviewTab scope={project?.scope} />
					:
					currentTab === 'Documents' ? 
					<DocumentsTab attachments={project?.attachments} />
					:
					currentTab === 'Deliverables' ?
					<DeliverablesTab deliverablesRequested={project?.deliverablesRequired} 
					project={project} setProject={setProject} />
					: 
					currentTab === 'Files' ?
					<FilesTab project={project} setProject={setProject} setCurrentTab={setCurrentTab} />
					:
					currentTab === 'Pilots' ?
					<PilotsTab pilots={project?.pilots} openPilotsAddTab={openPilotsAddTab}
					setOpenPilotsAddTab={setOpenPilotsAddTab} removeAssignedPilot={removeAssignedPilot}
					removeAssignedPilotConfirmation={removeAssignedPilotConfirmation} />
					:
					<ProcessingTeam processingTeam={project?.processingTeam} openProcessingTeamAddTab={openProcessingTeamAddTab}
					setOpenProcessingTeamAddTab={setOpenProcessingTeamAddTab} removeAssignedProcessingTeam={removeAssignedProcessingTeam}
					removeAssignedProcessingTeamConfirmation={removeAssignedProcessingTeamConfirmation} />
				}
				

			</div>
			<div id="comments-section" className="w-full mt-3 p-3 rounded-xl border-[1px] border-gray-200 bg-white w-full">
				<h1 className="text-lg font-semibold mt-1 text-black hover:underline flex items-center gap-1">
				<LiaCommentsSolid className="h-5 w-5"/> Comments ({project?.comments?.length}) </h1>
				<div className="w-auto mt-3 flex items-center md:flex-row flex-col md:gap-3">
					<div className={`md:w-[70%] w-full p-2 rounded-md 
					border-[1.4px] ${loading ? 'border-gray-300' : 'focus-within:border-blue-700 border-gray-300'} `}>
						<input type="text" placeholder="Type your comment here..." className={`w-full outline-none bg-transparent 
						text-md ${loading ? 'text-gray-400 animate-pulse' : 'text-gray-800'} `} value={commentText} onChange={(e)=>{if(!loading) setCommentText(e.target.value)}}
						/>
					</div>
					<button 
					onClick={addComment}
					className="px-7 py-2 md:mt-0 mt-3 hover:scale-[105%] transition-all duration-200 
					ease-in-out hover:bg-blue-700 bg-blue-600 text-white break-none 
					rounded-lg">Add comment</button>
				</div>
				<div className="h-[1px] w-[98%] mx-auto my-3 bg-[#EBE8FF]"/>
				<div className="flex flex-col gap-2 px-3">
					{
						project?.comments?.map((comment,j)=>(
							<CommentsCard j={j} comment={comment} key={j} 
							addReply={addReply} loading={loading} likeComment={likeComment} 
							currentUser={currentUser} updateComment={updateComment}
							/>
						))
					}
				</div>

			</div>	


		</div>

	)
}