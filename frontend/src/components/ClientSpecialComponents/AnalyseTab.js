"use client"
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { RxCross2 } from 'react-icons/rx';
import { GoScreenFull } from "react-icons/go";

import axios from 'axios'
import { getAllImageWithTags, getAllGroupsWithId } from '../../utils/ApiRoutes';
import GroupWithTagsOption from './GroupWithTagsOption';
import { useRecoilState } from 'recoil';
import { dataState, refreshData } from '../../atoms/userAtom';
import BladeHighlighter from './BladeHighlighter';
const MapComponent = dynamic(() => import('./MapComponent'), {
	ssr: false
})

export default function AnalyseTab({
	openMap, currentImage, zoomEnable, MdOutlineZoomIn,
	MdOutlineChevronLeft, setOpenImageSelector, openImageSelector,
	IoIosArrowUp, setCurrentImage, setMarkersData, markersData,
	mapRef, MapContainer, LayersControl, TileLayer, setZoomEnable,
	Marker, Popup, MyComponent, setOpenMap, currentProject
}) {
	const [allGroups, setAllGroups] = useState([]);
	const [selectedTag, setSelectedTag] = useState('all');
	const [data, setData] = useRecoilState(dataState);
	const [refresh, setReferesh] = useRecoilState(refreshData);

	const searchData = async (tags) => {
		const { data } = await axios.post(getAllImageWithTags, {
			tags: tags
		})
		console.log(data.file);
		if (data.status) {
			setData(data?.file)
		}
	}

	const fetchAllGroups = async () => {
		const { data } = await axios.post(getAllGroupsWithId, {
			groups: currentProject?.groups
		})
		if (data.status) {
			setAllGroups(data?.tagGroup)
		}
	}

	useEffect(() => {
		fetchAllGroups();
	}, [currentProject]);

	function filterUniqueObjects(dataset) {
		let uniqueIds = new Set(); // Set to store unique _id values
		return dataset.filter(obj => {
			if (!uniqueIds.has(obj._id)) {
				uniqueIds.add(obj._id); // Add _id to set if not already present
				return true; // Return true to keep the object
			}
			return false; // Return false to discard the object
		});
	}

	const searchDataAndReturn = async (allTags, i, allData) => {
		const data2 = await axios.post(getAllImageWithTags, {
			tags: allTags[i]
		})
		if (data2?.data?.status) {
			let currentData = [...allData, ...data2?.data?.file];
			currentData = await filterUniqueObjects(currentData);
			allData = currentData
			if (i + 1 !== allTags?.length) {
				console.log(i, allTags);
				searchDataAndReturn(allTags, i + 1, allData);
			} else {
				console.log(allData)
				setData(allData);
			}
		} else {
			alert("Failed to fetch file");
		}
	}

	const searchDataWithCondition = async () => {
		if (selectedTag === 'all' || selectedTag === 'All') {
			setData([]);
			let allTags = []
			// console.log(allGroups)
			for (let i = 0; i < allGroups.length; i++) {
				allTags = [...allTags, ...allGroups[i]?.tags];
			}
			let allData = []
			if (allTags.length > 0) {
				searchDataAndReturn(allTags, 0, allData);
			}
		} else {
			searchData(selectedTag)
		}
	}

	useEffect(() => {
		searchDataWithCondition()
	}, [selectedTag])

	useEffect(() => {
		if (refresh) {
			setReferesh(false);
			searchDataWithCondition()
		}
	}, [refresh])

	// console.log(data)
	return (

		<div className="w-full overflow-auto h-full	flex flex-col justify-between">
			{/* top tabs */}
			<div className='h-8 px-10 w-full text-gray-300 text-3xl flex items-center justify-end'>
				<GoScreenFull  />
			</div>


			<div className={`w-full flex ${openImageSelector ? 'h-[92%]' : 'h-[83%]'} transition-all duration-200 ease-in-out 
			pt-[70px] gap-5 p-5 overflow-auto`}>
				<div className={`flex flex-row-reverse ${openMap ? currentImage ? 'w-[50%]' : 'w-[0%]' : currentImage ? 'w-[50%]' : 'w-[0%]'} gap-3`}>
					<div className="overflow-hidden w-[93%] relative">
						<div
							onClick={() => { setCurrentImage('') }}
							className={`top-2 right-2 p-[6px] z-40 rounded-full cursor-pointer 
		     			bg-gray-200/50 hover:bg-gray-200/80 text-gray-600 hover:text-gray-800 
		     			${currentImage ? 'absolute' : 'hidden'} `}>
							<RxCross2 className="h-5 w-5" />
						</div>
						<div id="image-container" className="object-contain">
							<img src={currentImage?.url} id="image"
								alt="" className="w-full" />
						</div>
					</div>
					<div className={` gap-2 overflow-y-auto scrollbar-none h-[100%] w-[7%]
	     			${!currentImage && 'w-0 h-0 '}`} >
						<div className="flex flex-col-reverse inline-block gap-2">
							<div id="toolbar-container"></div>

							<div className="bg-[#333] p-[3px] rounded-lg">
								<div onClick={() => setZoomEnable(!zoomEnable)}
									className={` ${!zoomEnable ? 'bg-[#555] hover:bg-gray-500' : 'bg-black/30 border-blue-500 border-[1px] shadow-md shadow-blue-500/40'} 
			     					p-[3px] cursor-pointer rounded-md flex items-center justify-center`}>
									<MdOutlineZoomIn className={`h-[25px] w-[25px] ${zoomEnable ? 'text-white' : 'text-black'}`} />
								</div>
							</div>

						</div>
					</div>
				</div>

				{/* Blade Highlighter */}
				<BladeHighlighter />



				<div className="w-[20px] rounded-full ml-auto h-full bg-gray-800 p-[2px] flex items-center justify-center">
					<div onClick={() => setOpenMap(!openMap)}
						className="rounded-full bg-gray-900 hover:bg-blue-600 w-full transition-all cursor-pointer 
					duration-200 ease-in-out flex items-center justify-center">
						<MdOutlineChevronLeft className={`h-full w-full ${openMap ? 'rotate-180' : 'rotate-0'} 
						text-white transition-all duration-200 ease-in-out`} />
					</div>
				</div>
				<div className={`h-full ${openMap ? currentImage ? 'w-[50%]' : 'w-[100%]' : 'w-[0%]'} transition-all duration-200 ease-in-out z-0`}>
					<div className="w-full h-full">
						<MapComponent mapRef={mapRef} MapContainer={MapContainer} LayersControl={LayersControl} TileLayer={TileLayer}
							markersData={markersData} Marker={Marker} Popup={Popup} MyComponent={MyComponent} setMarkersData={setMarkersData}
							data={data} setCurrentImage={setCurrentImage} currentImage={currentImage}
						/>
					</div>
				</div>



			</div>
			<div className={`pt-5 ${openImageSelector ? 'w-full h-[0px]' : 'w-full h-[18%]'} flex items-center transition-all duration-200 ease-in-out`}>
				<div className="h-full w-[100%] relative z-50 border-gray-400 border-t-[1px] group hover:border-blue-500">
					<div
						className={`absolute left-3 -top-8 px-5 py-1 border-[1px] border-b-0 border-gray-400 bg-gray-900 hover:bg-gray-800 transition-all duration-200 ease-in-out cursor-pointer z-10 rounded-t-xl cursor-pointer group-hover:border-blue-500 group hover:border-blue-500`}
					>
						<select onChange={(e) => setSelectedTag(e.target.value)}
							className="border-0 cursor-pointer rounded-full drop-shadow-md px-1 duration-300 bg-gray-900 
			        	text-white hover:bg-gray-800 focus:bg-black-400"
							value={selectedTag}>
							<option value="all" className="text-white bg-black" >All</option>
							{
								allGroups?.map((group, k) => (
									<GroupWithTagsOption group={group} key={k} k={k} />
								))
							}
						</select>
					</div>
					<div
						onClick={() => setOpenImageSelector(!openImageSelector)}
						className={`absolute right-3 -top-8 px-5 py-1 border-[1px] border-b-0 border-gray-400 bg-gray-900 hover:bg-gray-800 transition-all duration-200 ease-in-out cursor-pointer z-10 rounded-t-xl cursor-pointer group-hover:border-blue-500 group hover:border-blue-500`}
					>
						<IoIosArrowUp className={`h-6 w-6 text-gray-300 hover:text-red-500 transition-all duration-200 ease-in-out ${openImageSelector ? 'rotate-180' : 'rotate-0'}`} />
					</div>
					<div className="h-full px-5 py-2 flex items-center gap-4 flex-nowrap scrollbar-none whitespace-nowrap">
						{data?.map((dat, j) => (
							<div key={j} className="h-full relative hover:scale-[108%]">
								<div className="absolute bottom-[2px] left-[2px] z-30 flex items-center gap-1">
									{
										dat?.annotations?.map((anno, k) => (
											<div key={k} className="p-1 relative h-4 w-4 text-[9px] flex items-center justify-center 
			                				rounded-full aspect-square bg-red-500 text-white">
												{anno?.body[0]?.severity}
											</div>
										))
									}
								</div>
								<img src={dat?.url} alt="" key={j} onClick={() => setCurrentImage(dat)}
									className="h-full opacity-[80%] hover:opacity-[100%] border-[1.3px] rounded-md cursor-pointer border-gray-300 
				                hover:border-sky-600 transition-all duration-200 ease-in-out  object-cover"/>
							</div>
						))}
					</div>
				</div>
			</div>

		</div>
	)
}