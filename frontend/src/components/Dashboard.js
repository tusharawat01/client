"use client"

import Header from './Header';
import {currentTabState,currentUserState,sideBarExtendState} from '../atoms/userAtom';
import {useRecoilState} from 'recoil'
import ImportantNotify from './DashboardComponents/ImportantNotify';
import ProjectStatistics from './DashboardComponents/ProjectStatistics';
import OngoingProjects from './DashboardComponents/OngoingProjects';
import ProjectAndMessage from './DashboardComponents/ProjectAndMessage';
import {useRouter} from 'next/navigation';


export default function Dashboard() {
	// body...
	const [currentTab,setCurrentTab] = useRecoilState(currentTabState);
	const [currentUser,setCurrentUser] = useRecoilState(currentUserState);
	const [sideBarExtend,setSideBarExtend] = useRecoilState(sideBarExtendState);
	const router = useRouter();

	// if(!currentUser){
	// 	router.push('/userLogin')
	// }

	return(
		<main className={`h-full ${sideBarExtend ? 'sm:w-[81%] xs:w-[86%] w-[100%]' : 'w-full'}  
		bg-gray-50 pb-5 overflow-y-scroll`}>
			
			<Header />
			<ImportantNotify />
			<ProjectStatistics />
			<OngoingProjects />
			<ProjectAndMessage />

			<div className="mt-10 w-full md:px-8 px-4">
				<h1 className="text-lg text-center text-gray-500">
					© 2023 <a href="https://aero2astro.com/" target="blank" className="text-blue-600 cursor-pointer font-semibold">Aero2Astro</a>
				</h1>

			</div>

		</main>


	)
}