"use client"

import Header from './Header';
import {currentTabState,sideBarExtendState} from '../atoms/userAtom';
import {useRecoilState} from 'recoil'
import AddClient from './ClientComponents/AddClient';
import AllClients from './ClientComponents/AllClients';
import ImportantNotify from './DashboardComponents/ImportantNotify';
import {useState} from 'react';


export default function Client() {
	// body...
	const [currentTab,setCurrentTab] = useRecoilState(currentTabState);
	const [addClientOpen,setAddClientOpen] = useState(false);
	const [currentClients,setCurrentClients] = useState([]);
	const [removeClientReveal,setRemoveClientReveal] = useState(false);
	const [sideBarExtend,setSideBarExtend] = useRecoilState(sideBarExtendState)

	return(
		<main className={`h-full ${sideBarExtend ? 'sm:w-[81%] xs:w-[86%] w-[100%]' : 'w-[100%]'}  bg-gray-50 pb-5 overflow-y-auto`}>

			
			<Header />
			<ImportantNotify />
			<AllClients addClientOpen={addClientOpen} setAddClientOpen={setAddClientOpen} 
			currentClients={currentClients} setCurrentClients={setCurrentClients} />
			<AddClient addClientOpen={addClientOpen} setAddClientOpen={setAddClientOpen} 
			currentClients={currentClients} setCurrentClients={setCurrentClients} /> 

			<div className="mt-10 w-full md:px-8 px-4">
				<h1 className="text-lg text-center text-gray-500">
					© 2023 <a href="https://aero2astro.com/" target="blank" className="text-blue-600 cursor-pointer font-semibold">Aero2Astro</a>
				</h1>

			</div>

		</main>


	)
}