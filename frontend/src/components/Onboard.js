"use client"

import Header from './Header';
import {currentTabState,sideBarExtendState} from '../atoms/userAtom';
import {useRecoilState} from 'recoil'
import ImportantNotify from './DashboardComponents/ImportantNotify';
import {useState,useEffect} from 'react';
import {getAccessRequest,getPilotAccessRequest} from '../utils/ApiRoutes';
import OnboardComponent from './OnboardComponents/OnboardComponent'
import axios from 'axios'


export default function Onboard() {
	// body...
	const [currentRequestList,setCurrentRequestList] = useState([]);
	const [currentPilotRequestList,setCurrentPilotRequestList] = useState([]);
	const [sideBarExtend,setSideBarExtend] = useRecoilState(sideBarExtendState);



	const getTheAccountAccessRequests = async() => {
		setCurrentRequestList([]);
		const {data} = await axios.post(getAccessRequest,{
			token:'1jn/BmBe3qYxzGiyxfsiMQ=='
		})
		setCurrentRequestList(data?.request);
	}

	const getThePilotAccessRequests = async() => {
		setCurrentPilotRequestList([]);
		const {data} = await axios.post(getPilotAccessRequest,{
			token:"j2y512vIRMyn9eJtfHykTw=="
		})
		console.log(data.request)
		setCurrentPilotRequestList(data?.request);
	}


	useEffect(()=>{
		getTheAccountAccessRequests();
		getThePilotAccessRequests()
	},[])




	return (
		<main className={`h-full ${sideBarExtend ? 'sm:w-[81%] xs:w-[86%] w-[100%]' : 'w-[100%]'}  bg-gray-50 pb-5 overflow-y-auto`}>
			
			<Header />
			<ImportantNotify />
			<OnboardComponent getTheAccountAccessRequests={getTheAccountAccessRequests} 
			currentRequestList={currentRequestList} setCurrentRequestList={setCurrentRequestList} 
			currentPilotRequestList={currentPilotRequestList} setCurrentPilotRequestList={setCurrentPilotRequestList}
			getThePilotAccessRequests={getThePilotAccessRequests}
			/>
			
			<div className="mt-10 w-full md:px-8 px-4">
				<h1 className="text-lg text-center text-gray-500">
					© 2023 <a href="https://aero2astro.com/" target="blank" className="text-blue-600 cursor-pointer font-semibold">Aero2Astro</a>
				</h1>

			</div>

		</main>

	)
}