"use client"
import {RiSearch2Line} from 'react-icons/ri';
import {AiOutlinePlusCircle} from 'react-icons/ai';
import {useState,useEffect} from 'react';
import {MdFormatListBulleted} from 'react-icons/md';
import {LuMapPin} from 'react-icons/lu'; 
import {HiOutlineLogout} from 'react-icons/hi';
import {useRecoilState} from 'recoil'
import {currentUserState,currentProjectState} from '../../atoms/userAtom';
import SiteCard from '../ClientWindowComponents/ProjectComponents/SiteCard';
import {FaDrawPolygon} from 'react-icons/fa';
import {PiUploadSimpleBold} from 'react-icons/pi';
import Link from 'next/link';
import MapComponent from './sitesComponents/MapComponent';

export default function SiteTab({
	closeHeader,setCloseHeader
}) {

	const [openProfileOptions,setOpenProfileOptions] = useState(false);
	const [searchValue,setSearchValue] = useState('');
	const [currentTab,setCurrentTab] = useState('list');
	const [currentUser,setCurrentUser] = useRecoilState(currentUserState);
	const [currentProject,setCurrentProject] = useRecoilState(currentProjectState);
	const [addSiteOptions,setAddSiteOptions] = useState(false);
	
	useEffect(()=>{
		if(currentTab === 'list'){
			setCloseHeader(false)
		}else{
			setCloseHeader(true)
		}
	},[currentTab])

	return (
		<main className="h-full w-full overflow-y-auto scrollbar scrollbar-thin scrollbar-thumb-blue-500 
		scrollbar-track-gray-800">
			{
				currentTab === 'list' &&
				<div className="w-full px-5 flex items-center 
				justify-end mt-[65px] z-30">
					
					
				</div>
			}

			{
				currentTab === 'list'
				&&
				<div className="w-full flex items-center gap-1 justify-end px-4 py-3">
					<div 
					onClick={()=>setCurrentTab('list')}
					className={`flex items-center text-sm gap-2 p-2 cursor-pointer rounded-md font-semibold transition-all duration-200 ease-in-out
					hover:bg-gray-800 ${currentTab === 'list' ? 'text-gray-200 bg-gray-800' : 'bg-gray-900/70 text-gray-400/80'} `}>
						<MdFormatListBulleted className="h-5 w-5"/>
						List
					</div>

					<div 
					onClick={()=>setCurrentTab('map')}
					className={`flex items-center text-sm gap-2 p-2 cursor-pointer rounded-md font-semibold transition-all duration-200 ease-in-out
					hover:bg-gray-800 ${currentTab === 'map' ? 'text-gray-200 bg-gray-800' : 'bg-gray-900/70 text-gray-400/80'} `}>
						<LuMapPin className="h-5 w-5"/>
						Map
					</div>

					<div className="flex items-center gap-3">
						<button 
						onClick={()=>setAddSiteOptions(!addSiteOptions)}
						className="px-4 whitespace-nowrap py-2 rounded-lg leading-none bg-blue-500 hover:bg-blue-600 text-white 
						flex items-center ml-2 gap-2">
							<AiOutlinePlusCircle className="h-5 w-5"/>
							Add Site
						</button>
					</div>
				</div>
			}

			{
				currentTab === 'list' ? 
				<div className="max-w-[1100px] px-5 py-2 mx-auto mt-2 ">
					<div className="flex flex-col w-full gap-2">
						<h1 className="text-xl font-semibold text-gray-200">Project Sites</h1>
						<div className="w-full h-[1px] bg-gray-600 rounded-full"/>
						<div className="grid gap-3 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 px-2 py-2">
							{
								currentProject?.kmlkmzFiles?.map((kml,k)=>(
									<SiteCard kml={kml} key={k} k={k}
									siteNames={currentProject?.siteNames}
									/>
								))
							}

						</div>
					</div>		
				</div>
				:
				<MapComponent allSites={currentProject?.kmlkmzFiles} currentTab={currentTab}
				setCurrentTab={setCurrentTab}
				/>

			}

			<div className={`fixed ${openProfileOptions ? 'right-3' : '-right-[100%]'} top-[70px] flex rounded-lg overflow-hidden 
			flex-col bg-gray-900 transition-all duration-200 ease-in-out `}>
				<div className="px-3 py-2 border-b-[1px] hover:bg-gray-800 transition-all duration-200 ease-in-out border-gray-500">
					<h1 className="text-sm font-semibold text-gray-200">Hi! {currentUser?.name}</h1>
				</div>
				<div className="px-3 py-2 group border-gray-500 hover:bg-gray-800 transition-all cursor-pointer duration-200 ease-in-out">
					<h1 className="text-sm font-semibold text-gray-200 group-hover:text-red-400 flex items-center gap-1"> 
						<HiOutlineLogout className="h-4 w-4"/>
						Log out
					</h1>
				</div>
			</div>

			<div className={`fixed ${addSiteOptions ? 'right-10' : '-right-[100%]'} top-[120px] flex rounded-lg overflow-hidden 
			flex-col bg-gray-900 transition-all duration-200 ease-in-out `}>
				<Link href={`/clientDashboard/sites`}>
					<div className="px-6 py-2 group border-gray-500 border-b-[1px] hover:bg-gray-800 transition-all cursor-pointer duration-200 ease-in-out">
						<h1 className="text-md font-semibold text-gray-200 flex items-center gap-1"> 
							<PiUploadSimpleBold className="h-4 w-4"/>
							Upload
						</h1>
					</div>
				</Link>
				<Link href={`/client/${currentUser?.name}/${currentProject?._id}/createsite`}>
					<div
					className="px-6 py-2 group border-gray-500 hover:bg-gray-800 transition-all cursor-pointer duration-200 ease-in-out">
						<h1 className="text-md font-semibold text-gray-200 flex items-center gap-1"> 
							<FaDrawPolygon className="h-4 w-4"/>
							Manual
						</h1>
					</div>
				</Link>
			</div>
		</main>

	)
}