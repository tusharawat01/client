"use client"

import ImportantNotify from './DashboardComponents/ImportantNotify';
import Header from './Header';
import {useState,useEffect} from 'react'
import {useRecoilState} from 'recoil';
import {sideBarExtendState,currentUserState,currentChatState} from '../atoms/userAtom'
import ContactSelectTab from './MessageComponents/ContactSelectTab';
import MessagesTab from './MessageComponents/MessagesTab';
import {IoMdClose} from 'react-icons/io'
import {AiOutlineSearch} from 'react-icons/ai';
import {searchClient,getClientById,getUserByIdWithChats} from '../utils/ApiRoutes';
import {BsThreeDots} from 'react-icons/bs';
import axios from 'axios';
import {motion} from 'framer-motion'
import {HiOutlineUserGroup,HiOutlineUser} from 'react-icons/hi';
import {TbMap2} from 'react-icons/tb'
import {PiGifBold} from 'react-icons/pi';
import {CgImage} from 'react-icons/cg';

export default function UserManager() {
	// body...
	const [sideBarExtend,setSideBarExtend] = useRecoilState(sideBarExtendState);
	const [currentUser,setCurrentUser] = useRecoilState(currentUserState)
	const [newMessageSearch,setNewMessageSearch] = useState(false);
	const [searchText,setSearchText] = useState('');
	const [selectedUsers,setSelectedUsers] = useState([]);
	const [searchResult,setSearchResult] = useState([]);
	const [currentChat,setCurrentChat] = useRecoilState(currentChatState);
	const [creatingGroup,setCreatingGroup] = useState(false);

	// useEffect(()=>{
	//     fetchTempUser()
	//   },[])

	//   const fetchTempUser = async() => {
	//     const {data} = await axios.post(getUserByIdWithChats,{
	//       id:'65341160546f3e72bce9dfcc'
	//     })
	//     if(data.status){
	//       setCurrentUser(data?.user);
	//     }
	//   }

	useEffect(()=>{
		if(searchText.length > 0){
			findUser()
		}else{
			setSearchResult([])
		}
	},[searchText])

	const findUser = async() => {
		const {data} = await axios.post(searchClient,{
			searchText
		})
		if(data?.status){
			setSearchResult(data?.user)
		}else{

		}
	}

	const generateId = () => {
		let id = '';
		for(let i =0; i<10;i++){
			id = id + Math.floor(Math.random()*10).toString();
		}
		return id;
	}

	const nextStep = async() => {

		if(selectedUsers.length===1){
			setSearchText('');
			// setMsgReveal(true);
			setCurrentChat(selectedUsers[0])
			setSelectedUsers([]);
			setNewMessageSearch(false);
			// router.push('/messages');
		}else if(selectedUsers.length > 1) {
			let name = currentUser.name;
			let _id = [currentUser._id];
			let username = currentUser.username;
			let image = [currentUser.image];
			const group = true;
			const groupId = await generateId()
			const createdAt = new Date().toISOString();

			for(let i = 0; i<selectedUsers.length; i++){
				name = name + ', ' + selectedUsers[i].name;
				username = username + ', ' + selectedUsers[i].username;
				_id = [..._id, selectedUsers[i]._id];
				image = [...image, selectedUsers[i].image];
			}
			const chat = {
				name,_id,image,group,username,createdAt,groupId
			}
			setSearchText('');
			// setMsgReveal(true);
			setCurrentChat(chat);
			setSelectedUsers([]);
			setNewMessageSearch(false);
			// router.push('/messages');
		}
		// setSearchText('');
		// setCurrentChat(selectedUsers);
		// setSelectedUsers([]);
		// setNewMessageSearch(false);
	}

	useEffect(()=>{
		if(!creatingGroup){
			if(selectedUsers.length > 1){
				const users = [selectedUsers[0]];
				setSelectedUsers(users)
			}
		}
	},[creatingGroup])

	const modifySelectedUsers = async(user) => {
		if(creatingGroup) {
			if(user._id !== currentUser._id){
				const check2 = await selectedUsers.some(element=>{
					if(element._id === user._id){
						return true;
					}
					return false
				})

				if(!check2){
					setSelectedUsers(selectedUsers=>[...selectedUsers,user]);
				}else{
					const idx = await selectedUsers.findIndex(element=>{
						if(element._id === user._id){
							return true
						}
						return false
					})
					let selected2 = [...selectedUsers];
					await selected2.splice(idx,1);
					setSelectedUsers(selected2);
				}			
			}
		}else{
			if(user._id !== currentUser._id){
				setSelectedUsers([user])			
			}
		}
	}

	const removeSelectedUser = async(j) => {
		let selected2 = [...selectedUsers];
		selected2.splice(j,1);
		setSelectedUsers(selected2);
	}

	// console.log(currentChat)

	return (
		<main className={`h-[100%] ${sideBarExtend ? 'sm:w-[81%] xs:w-[86%] w-[100%]' : 'w-[100%]'}  bg-gray-50 overflow-y-auto`}>
			
			{
				newMessageSearch &&
				<div className="fixed flex items-center left-0 top-0 justify-center h-full w-full z-50 bg-black/30 ">
					<div className="relative m-auto lg:w-[40%] md:w-[60%] sm:w-[80%] sm:max-h-[85%] h-full w-full sm:rounded-3xl 
					border-[1px] border-gray-200/50 bg-white py-3 flex flex-col">
						<div className="flex w-full justify-between items-center top-0 px-4 items-center gap-5">
							<div className="flex gap-5 w-full items-center">
								<div 
								onClick={()=>{
									setNewMessageSearch(false);
								}}
								className="p-2 hover:bg-gray-300 cursor-pointer transition-all duration-200 ease-in-out rounded-full">
									<IoMdClose className="h-5 w-5 cursor-pointer text-black"/>
								</div>
								<h1 className="text-xl select-none text-black font-semibold">New Message</h1>
							</div>
							<button 
							onClick={nextStep}
							className={`text-white font-semibold py-1 px-4 ${selectedUsers.length>0 ? 'bg-black cursor-pointer':'bg-black/60 cursor-not-allowed' } rounded-full`}>Next</button>
						</div>
						<div className="flex mt-4 mb-4 px-6 w-full gap-4 ">
							<AiOutlineSearch className="h-6 w-6 text-sky-600"/>
							<input type="text" className="bg-transparent outline-none placeholder:text-gray-500 
							text-black w-full"
							placeholder="Search people"
							value={searchText}
							onChange={(e)=>setSearchText(e.target.value)}
							/>
						</div>
						<div className="bg-gray-300/50 h-[1.7px] w-full"/>
						<div 
						onClick={()=>setCreatingGroup(!creatingGroup)}
						className={`py-2 ${selectedUsers.length>0 && !creatingGroup && 'hidden'} ${creatingGroup ? 'bg-blue-500 hover:bg-blue-600' : 'hover:bg-gray-200/40'} border-b-[1.5px] 
						border-gray-200/60 transition-all duration-200 ease-in-out
						cursor-pointer px-4 flex items-center gap-3`}>
							<div className={`p-2 rounded-full border-[1px] ${creatingGroup ? ' ' : 'border-gray-300'} `}>
								{
									creatingGroup ? 
									<HiOutlineUser className={`h-5 w-5 ${creatingGroup ?'text-gray-100' : ' text-sky-500'} `}/>
									:
									<HiOutlineUserGroup className={`h-5 w-5 ${creatingGroup ?'text-gray-100' : ' text-sky-500'} `}/>
								}
							</div>
							<h1 className={`font-semibold text-md ${creatingGroup ? 'text-gray-100' : 'text-sky-500'}`}>{creatingGroup ? 'Cancel Group' : 'Create a group'}</h1>
						</div>
						<div className={` ${selectedUsers?.length > 0 ? 'py-3 border-b-[1.5px]' : 'py-0'} border-gray-200/60 
						transition-all duration-200 ease-in-out	px-4 
						flex items-center flex-wrap overflow-y-scroll scrollbar scrollbar-w-[3px] scrollbar-thumb-sky-500 gap-1`}>
							{
								selectedUsers.map((user,i)=>(
									<div key={i} className='flex items-center p-[2px] px-[5px] hover:bg-gray-200/70 transition-all duration-200 ease-in-out
									cursor-pointer rounded-full gap-2 border-[1px] border-gray-300/80'>
										{
											user?.group ? 
											<div className="h-5 w-5 rounded-full overflow-hidden grid grid-cols-2">
												{
													user?.image?.map((img,j)=>{
														if(user.image.length === 3){
															if(j<2){
																return (
																	<img src={img} key={j} className="object-cover w-full h-full" alt=""/>
																)
															}
														}else{
															if(j<4){
																return (
																	<img src={img} key={j} className="object-cover w-full h-full" alt=""/>
																)
															}	
														}
													})
												}
											</div>
											:
											<img src={user.image} alt="" className="h-5 w-5 rounded-full"/>
										}
										
										<h1 className="text-md select-none font-semibold text-black">{user.name}</h1>
										<IoMdClose 
										onClick={()=>removeSelectedUser(i)}
										className="text-sky-500 select-none hover:text-red-500 transition-all duration-200 ease-in h-5 w-5"/>
									</div>
								))
							}
						</div>
						<div className="flex flex-col h-full overflow-y-scroll scrollbar-thin 
						scrollbar-thumb-sky-400 scrollbar-track-gray-200 ">
							{
								searchResult?.length>0?
									<>
									{
										searchResult?.map((res,k)=>(
											<div 
											key={k}
											onClick={()=>{
												modifySelectedUsers(res)
											}}
											className="flex z-40 cursor-pointer gap-[7px] w-full px-4 hover:bg-gray-200/50 transition-all duration-200 ease-in-out py-3">
												<img src={res.image} className={`h-10 select-none w-10 ${currentUser?._id === res._id && 'opacity-50' } rounded-full`}/>
												<div className="flex flex-col truncate shrink">
													<span className={`text-black text-md truncate select-none font-semibold m-0 p-0 
													${currentUser._id === res._id && 'opacity-50' }`}>{res.name}</span>
													<span className={`text-gray-700 text-sm truncate select-none m-0 p-0 
													${currentUser._id === res._id && 'opacity-50' }`}>{res?.organizationName} - {res?.roles}</span>
												</div>
											</div>

										))
									}

									
									</>
									:
									currentUser?.chats?.map((res,i)=>(
										<div key={i}
										onClick={()=>{
											modifySelectedUsers(res);
										}}
										className={`flex z-40 cursor-pointer gap-[7px] w-full px-4 w-full hover:bg-gray-200/50 
										transition-all duration-200 ease-in-out py-3`}>
											<img src={res?.image} alt="" className="h-12 w-12 rounded-full"/>										
											<div className="flex flex-col truncate shrink">
												<span className="text-black text-md truncate font-semibold m-0 p-0">{res?.name}</span>
												<span className="text-black text-sm truncate font-semibold m-0 p-0">{
													res.lastChat.includes('Kml') ?
													<span className="flex items-center gap-1" ><TbMap2 className="text-sky-500 h-4 w-4"/> KML/KMZ</span>
													:
													res.lastChat.includes('https://ik.imagekit.io') ?
													<span className="flex items-center gap-1" ><CgImage className="text-sky-500 h-4 w-4"/> Image</span>
													:
													res.lastChat.includes('https://media.tenor.com') ?
													<span className="flex items-center gap-1" ><PiGifBold className="text-sky-500 h-4 w-4"/> Gif</span>
													:
													res?.lastChat?.length > 20 ?
													res?.lastChat?.substring(0,17) + '...'
													:
													res?.lastChat
												}</span>
											</div>
										</div>

									))
							}
						</div>
					</div>
				</div>
			}


			<div className="flex w-full h-[100%] items-center">
				<ContactSelectTab  setNewMessageSearch={setNewMessageSearch} />
				<MessagesTab setNewMessageSearch={setNewMessageSearch}
				/>
			</div>

		</main>

	)
}