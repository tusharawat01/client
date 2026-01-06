"use client"
import Header from './Header';
import ImportantNotify from './DashboardComponents/ImportantNotify';
import dynamic from 'next/dynamic'
import {useRecoilState} from 'recoil';
import {sideBarExtendState} from '../atoms/userAtom'
import NewProjectForm from './NewProjectComponents/NewProjectForm'

export default function NewProject() {
	// body...
	const [sideBarExtend,setSideBarExtend] = useRecoilState(sideBarExtendState);
	// console.log("I ran")

	return (
		<main className={`h-full ${sideBarExtend ? 'sm:w-[81%] xs:w-[86%] w-[100%]' : 'w-[100%]'}  bg-gray-50 pb-5 overflow-y-auto`}>
				
			<Header />
			<ImportantNotify />	
			<NewProjectForm/>

		</main>

	)
}