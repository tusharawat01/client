
import { FiArrowLeft } from "react-icons/fi";
import { FaAngleDown } from "react-icons/fa6";
import {useState,useEffect} from 'react';
import GeoServerTiffViewer from './GeoServerTiffViewer';
import VideoViewer from './VideoViewer';
import CesiumViewer from '../ProjectComponents/ProjectInfoMainComponents/CesiumViewer';

export default function ProcessedDataViewer({
	currentProject,setCurrentProject,currentTab,
	setCurrentTab,setCloseHeader,MdPerson,setOpenProfileOptions,
	openProfileOptions,currentUser
}) {
	const [availableDeliverables,setAvailableDeliverables] = useState([]);
	const [availableDates,setAvailableDates] = useState([]);
	const [selectedDeliverable,setSelectedDeliverable] = useState('');
	const [selectedDate,setSelectedDate] = useState('');
	const [openDeliverable,setOpenDeliverable] = useState({});
	const [showDeliverables,setShowDeliverables] = useState([]);
	const [openDeliverablesOptions,setOpenDeliverablesOptions] = useState(false);
	const [openDatesOptions,setOpenDatesOptions] = useState(false);
	const [mapBasedDeliverables,setMapBasedDeliverables] = useState([]);
	
	useEffect(()=>{
		if(currentProject?.deliverables?.length > 0){
			let deliverables = [...currentProject?.deliverables?.map((deliverable)=>deliverable?.deliverableType),...currentProject?.deliverables?.map((deliverable)=>deliverable?.deliverableType)];
			let filteredDelivereables = [...new Set(deliverables)];
			setAvailableDeliverables(filteredDelivereables);
			setSelectedDeliverable(filteredDelivereables[0])
		}
	},[currentProject])

	useEffect(()=>{
		let filteredDelivereables = currentProject?.deliverables?.filter(deliverable=>{
			if(deliverable?.deliverableType === selectedDeliverable) return true
			return false
		})
		if(filteredDelivereables?.length > 0){
			let dates = [...filteredDelivereables?.map((deliverable)=>deliverable?.date)];
			setAvailableDates([...new Set(dates)]);
			setSelectedDate(dates[0])	
		}
	},[selectedDeliverable]);

	useEffect(()=>{
		if(selectedDeliverable && selectedDate){
			let filteredDelivereables = currentProject?.deliverables?.filter(deliverable=>{
				if(deliverable?.deliverableType === selectedDeliverable && deliverable?.date === selectedDate) return true
				return false
			})
			setShowDeliverables(filteredDelivereables)
		}
	},[selectedDeliverable,selectedDate]);

	useEffect(()=>{
		if(currentProject?.deliverables?.length > 0){
			let filteredDelivereables = currentProject?.deliverables?.filter(deliverable=>{
				if(deliverable?.deliverableType?.toLowerCase() !== 'video' && deliverable?.deliverableType?.toLowerCase() !== '3d model'){
					return true				
				}
				return false
			})
			if(filteredDelivereables?.length > 0){
				setMapBasedDeliverables(filteredDelivereables);
			}
		}
	},[currentProject])

	return (
		<div className="w-full h-[90%]">
			<div className="px-4 flex items-center justify-between py-3 border-b-[1px] border-gray-700
			shadow-lg bg-[#292929] z-30">
				<div className="flex items-center">
					<div onClick={()=>{
						setCloseHeader(false);
						setCurrentTab("details")
					}} className="p-1 rounded-full hover:bg-gray-700/70 cursor-pointer 
					transition-all duration-200 ease-in-out">
						<FiArrowLeft className="h-6 w-6 text-gray-200"/>
					</div>
					<div onClick={()=>{setOpenDeliverablesOptions(!openDeliverablesOptions)}} 
					className="relative p-1 hover:rounded-lg border-[1px] hover:border-gray-500 
					border-transparent border-l-gray-500 transition-all ml-2 duration-200 
					border-l-[1px] ease-in-out px-4 cursor-pointer flex items-center gap-5">
						<h1 className="text-gray-200 text-md  
						border-gray-500">{selectedDeliverable || 'No Deliverable Available'}</h1>
						<FaAngleDown className={`text-gray-200 ${openDeliverablesOptions ? 'rotate-180' : 'rotate-0'} transition-all 
						duration-200 ease-in-out h-4 w-4`}/>

						<div className={`${openDeliverablesOptions ? 'h-auto border-[1px] ' : 'h-[0px] border-[0px] overflow-hidden'} 
						absolute top-9 left-0 border-gray-700 bg-gray-900 rounded-lg transition-all duration-200 
						ease-in-out overflow-hidden z-50`}>
							{
								availableDeliverables?.map((deliverable,k)=>(
									<div onClick={()=>{
										setOpenDeliverablesOptions(false);
										setSelectedDeliverable(deliverable);
										setOpenDeliverable({});
									}} key={k} className="px-3 py-1 flex items-center gap-2 hover:gap-3 border-b-[1px] 
									hover:bg-gray-800 border-gray-700 transition-all duration-200 ease-in-out">
										<p className='text-md font-normal whitespace-nowrap text-gray-200'>{deliverable}</p>
										<FiArrowLeft className="h-5 w-5 rotate-180 text-gray-200"/>
									</div>
								))
							}
						</div>
					</div>

					<div onClick={()=>{setOpenDatesOptions(!openDatesOptions)}} 
					className="relative p-1 hover:rounded-lg border-[1px] hover:border-gray-500 
					border-transparent border-l-gray-500 transition-all ml-4 duration-200 
					border-l-[1px] ease-in-out px-4 cursor-pointer flex items-center gap-5">
						<h1 className="text-gray-200 text-md  
						border-gray-500">{selectedDate || 'Not Available'}</h1>
						<FaAngleDown className={`text-gray-200 ${openDatesOptions ? 'rotate-180' : 'rotate-0'} transition-all 
						duration-200 ease-in-out h-4 w-4`}/>

						<div className={`${openDatesOptions ? 'h-auto border-[1px] ' : 'h-[0px] border-[0px] overflow-hidden'} 
						absolute top-9 left-0 border-gray-700 bg-gray-900 rounded-lg transition-all duration-200 
						ease-in-out overflow-hidden z-50`}>
							{
								availableDates?.map((date,k)=>(
									<div onClick={()=>{
										setOpenDatesOptions(false);
										setSelectedDate(date);
									}} key={k} className="px-3 py-1 flex items-center gap-2 hover:gap-3 border-b-[1px] 
									hover:bg-gray-800 border-gray-700 transition-all duration-200 ease-in-out">
										<p className='text-md font-normal whitespace-nowrap text-gray-200'>{date}</p>
										<FiArrowLeft className="h-5 w-5 rotate-180 text-gray-200"/>
									</div>
								))
							}
						</div>
					</div>


				</div>
				<div className="flex items-center gap-3">
					<p className="text-md font-normal text-gray-300">
						{currentUser?.name}
					</p>
					<MdPerson 
					onClick={()=>setOpenProfileOptions(!openProfileOptions)}
					className="h-8 w-8 text-gray-300 cursor-pointer"/>
				</div>


			</div>

			<div className="w-full flex z-20 h-full">
				<div className='w-[20%] gap-2 bg-[#292929] px-3 flex flex-col py-3'>
					{
						showDeliverables?.length > 0 &&
						<p className="text-md text-gray-200 mb-2">
							Available Deliverables
						</p>
					}
					{
						showDeliverables?.map((deliverable,k)=>(
							<div key={k} onClick={()=>{
								if(openDeliverable?.store === deliverable?.store){
									setOpenDeliverable({})
								}else{
									setOpenDeliverable(deliverable)
								}
							}} className={`px-2 w-full cursor-pointer 
							${openDeliverable?.store === deliverable?.store ? 'bg-blue-600 border-gray-800 hover:bg-blue-500 hover:border-gray-800' : 'bg-gray-900/50 border-gray-700 hover:bg-gray-800 hover:border-gray-600'} 
							border-[1px] break-all transition-all duration-200 ease-in-out rounded-lg py-2`}>
								<p className="text-gray-200 text-md">{deliverable?.fileName}</p>
							</div>
						))
					}
				</div>
				<div className="w-[80%]">
					{
						selectedDeliverable?.toLowerCase() === 'video' ?
						<VideoViewer store={openDeliverable?.store} />
						:
						selectedDeliverable?.toLowerCase() === '3d model' ?
						<CesiumViewer currentStore={openDeliverable?.store} />
						:
						<GeoServerTiffViewer store={openDeliverable?.store} 
						mapBasedDeliverables={mapBasedDeliverables} selectedDate={selectedDate}
						project={currentProject} setProject={setCurrentProject}
						/>
					}
				</div>

			</div>



		</div>
	)
}