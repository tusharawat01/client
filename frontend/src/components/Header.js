"use client"

import {currentTabState,currentUserState,openSideBarMobileState} from '../atoms/userAtom';
import {useRecoilState} from 'recoil'
import {AiOutlineMessage} from 'react-icons/ai';
import {LuMail} from 'react-icons/lu';
import {FiChevronDown} from 'react-icons/fi';
import {useState} from 'react'
import {RiUser3Fill} from 'react-icons/ri';
import {HiOutlineLogout} from 'react-icons/hi';
import {useRouter} from 'next/navigation' 
import Link from 'next/link'
import {HiMenuAlt2} from 'react-icons/hi';

export default function Header() {
	// body...
	const [currentTab,setCurrentTab] = useRecoilState(currentTabState);
	const [openSideBarMobile,setOpenSideBarMobile] = useRecoilState(openSideBarMobileState);
	const [currentUser,setCurrentUser] = useRecoilState(currentUserState);
	const [revealLogOut,setRevealLogOut] = useState(false);
	const router = useRouter();

	return (
		<header className="flex items-center justify-between top-0 w-full md:px-10 px-4 pt-4 pb-3">
			<div className="flex items-center gap-2">
			<HiMenuAlt2 
			onClick={()=>setOpenSideBarMobile(true)}
			className="h-5 w-5 text-gray-700 block xs:hidden cursor-pointer"/>
			<h1 className="md:text-xl text-lg font-semibold text-gray-900 uppercase tracking-[2px]">{currentTab}</h1>
			</div>
			<div className="flex items-center gap-4">

				<div className="md:flex hidden items-center gap-3">
					<div className="p-[6px] hover:bg-gray-200/40 border-[1px] 
					border-gray-500/50 cursor-pointer rounded-xl transition-all duration-100 ease-in-out">
						<AiOutlineMessage className="h-6 w-6 text-sky-400"/>
					</div>
					<div className="p-[6px] hover:bg-gray-200/40 border-[1px] 
					border-gray-500/50 cursor-pointer rounded-xl transition-all duration-100 ease-in-out">
						<LuMail className="h-6 w-6 text-sky-400"/>
					</div>
				</div>
				{
					!currentUser ?
					<Link href="/adminLogin"><button 
					className="bg-blue-600 px-6 py-[6px] rounded-md text-md text-white">Login</button></Link>
					:
					<div onClick={()=>{
						setRevealLogOut(!revealLogOut)
					}} className="p-[6px] cursor-pointer rounded-lg border-[0px] border-gray-500/50 hover:bg-gray-300/30 transition-all 
					duration-200 relative flex items-center gap-2 ease-in-out rounded-lg group">
						<img src={currentUser?.image} 
						alt="" className="h-9 w-9 rounded-full shadow-lg group-hover:shadow-sky-500/20"/>
						<div className="flex flex-col">
							<h1 className="text-sm leading-none select-none text-gray-900">Hi, {currentUser?.name}!</h1>
							<span className="text-xs leading-md mt-1 text-gray-800 select-none">{currentUser?.email}</span>
						</div>
						<div className="">
							<FiChevronDown className={`h-5 w-5 text-gray-800 ${revealLogOut ? 'rotate-180' : 'rotate-0'} transition-all duration-200 ease-in-out`}/>
						</div>

					</div>
				}
				<div className={`fixed right-[70px] top-[65px] bg-gray-50 rounded-lg
				border-gray-300/70 flex flex-col overflow-hidden z-50 ${revealLogOut ? 'h-max border-[1px]' : 'h-0'} `}>
					<div className="flex items-center hover:bg-gray-200/60 py-2 font-semibold text-md 
					cursor-pointer z-50 gap-3 px-3 leading-none py-1 text-gray-800">
						<RiUser3Fill className="h-5 w-5 text-black"/> Profile
					</div>
					<Link href="/clientLogin"><div 
					className="flex items-center hover:bg-gray-200/60 py-2 font-semibold text-md 
					cursor-pointer z-50 gap-3 px-3 py-1 leading-none text-red-500">
						<HiOutlineLogout className="h-5 w-5 text-red-500"/> Logout
					</div></Link>
				</div>

			</div>

		</header>


	)
}