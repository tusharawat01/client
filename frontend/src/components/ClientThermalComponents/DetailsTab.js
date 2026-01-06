"use client"
import {TbCurrentLocation} from 'react-icons/tb';
import {TfiLocationPin} from 'react-icons/tfi'
import {useState,useEffect,useRef} from 'react';
import { MapContainer, TileLayer,Marker,Popup, LayersControl } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css'
import "leaflet-defaulticon-compatibility";
import {MdOutlineDateRange} from 'react-icons/md';
import {fetchFilesLength} from '../../utils/ApiRoutes';
import {BsBoxArrowUpRight,BsImages} from 'react-icons/bs';
import axios from 'axios'; 

export default function DetailsTab({
	currentProject,setCurrentProject
}) {
	const mapRef = useRef();
	const [totalFilesLength,setTotalFilesLength] = useState(0);

	const fetchTotalFilesLength = async() => {
		const {data} = await axios.post(fetchFilesLength,{
			folderId:[...currentProject?.folders,...currentProject?.thermalFolders]
		})
		console.log(data)
		if(data?.status){
			setTotalFilesLength(data?.file)
		}
	}

	useEffect(()=>{fetchTotalFilesLength()},[])

	return (
		<main className="mt-[80px] px-5 bg-[#1f1f1f]">
			<div className="w-full flex md:flex-row flex-col gap-7">
				<div className="md:w-[50%] w-full mt-2">
					<h1 className="text-lg text-white font-semibold">
						{currentProject?.name}
					</h1>
					<div className="w-full h-[1px] bg-gray-700 md:mt-1"/>
					<p className="text-md font-normal text-gray-200 flex items-center gap-2 mt-3">
						<div className={`h-2 w-2 bg-yellow-500 rounded-full`}/>
						{currentProject?.status}
					</p>
					<p className="text-md font-normal text-gray-300 mt-2">
						{currentProject?.type}
					</p>
					<p className="flex items-center gap-1 text-gray-400 mt-2">
						<MdOutlineDateRange className="h-4 w-4"/> {currentProject?.createdAt?.split('T')[0]}
					</p>
					<p className="flex items-center gap-1 text-gray-400 mt-2">
						<BsImages className="h-4 w-4"/> {totalFilesLength}
					</p>
					<p className="flex items-center gap-1 text-gray-400 mt-2">
						<TfiLocationPin className="h-4 w-4"/> {currentProject?.projectArea}
					</p>
					<p className="flex items-center gap-1 text-gray-400 mt-2">
						<TbCurrentLocation className="h-4 w-4"/> Location
					</p>
					<ul>
						<li>
							<p className="flex items-center gap-1 text-gray-400 mt-1">
								Lat :- {currentProject?.coordinates?.latitude || 0}
							</p>
						</li>
						<li>
							<p className="flex items-center gap-1 text-gray-400 mt-1">
								Lon :- {currentProject?.coordinates?.longitude || 0}
							</p>
						</li>
					</ul>
				</div>
				<div className="md:w-[50%] w-full rounded-md p-2 border-[1px] h-[270px] border-gray-700 flex flex-col">
					<MapContainer
				      center={[currentProject?.coordinates?.latitude || 0, currentProject?.coordinates?.longitude || 0]}
				      zoom={13}
				      maxZoom={22}
				      style={{ height: "100%", width: "100%", zIndex:'0' }}
				      ref={mapRef}
				      whenCreated={(map) => (mapRef.current = map)}
				    >
				        
				         
					    <LayersControl position="topright">
						    <LayersControl.Overlay checked name="Vector Map">
						        <TileLayer
							        url={`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`}
						        	maxZoom={22}							        
							        attribution=''
							    />
						    </LayersControl.Overlay>

						    <LayersControl.Overlay name="Mapbox Map">
						        <TileLayer
							        url={`https://api.mapbox.com/styles/v1/mapbox/streets-v12/tiles/256/{z}/{x}/{y}@2x?access_token=sk.eyJ1IjoidGhlamFzaGFyaSIsImEiOiJjbG4wazg4c3YxMDMwMmpuemp2eDl6bzh0In0.sUZFHTO5dLZjZDdqINFOwA`}
						        	maxZoom={22}							        
							        attribution=''
							      />
						    </LayersControl.Overlay>

						    <LayersControl.Overlay name="Satellite Map">
						        <TileLayer
							        url={`https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}.png`}
							        attribution=''
						        	maxZoom={22}							        
							    />
						    </LayersControl.Overlay>
					    </LayersControl>

					    <LayersControl.Overlay name="Google Map">
					        <TileLayer
						        url={`https://mt3.google.com/vt/lyrs=y&x={x}&y={y}&z={z}`}
						        attribution=''
						        maxZoom={22}
						      />
					    </LayersControl.Overlay>
					    
			    		<Marker position={[currentProject?.coordinates?.latitude || 0, currentProject?.coordinates?.longitude || 0]} animate={true}>
					        <Popup>
						        {currentProject?.coordinates?.latitude || 0} - {currentProject?.coordinates?.longitude || 0}
					        </Popup>
					    </Marker>
				    
				        
				    </MapContainer>
				</div>
			</div>

			<div className="w-full mt-7">
				<h1 className="text-md font-normal text-white">Progress ({currentProject?.progress}%)</h1>
				<div className="w-full h-[10px] rounded-full overflow-hidden bg-gray-800 my-2">
					<div style={{
						width:`${currentProject?.progress}`
					}} 
					className={`bg-gradient-to-r from-purple-500 via-red-500 
					to-pink-600 h-full`}/>
				</div>
			</div>

			<h1 className="text-gray-400 mt-3 text-md font-normal">{currentProject?.scope}</h1>

			<h1 className="text-lg mt-10 text-white font-semibold">
				Client Details
			</h1>
			<div className="w-full h-[1px] bg-gray-700 md:mt-1"/>
			<div className="flex md:flex-row items-center flex-col-reverse gap-5 mt-4 pb-5">
				<div className="flex flex-col w-full md:w-[50%] gap-2">
					<p className="text-md font-normal text-gray-200 flex items-center gap-2">Name :- {currentProject?.clientDetails?.name} 
					<BsBoxArrowUpRight className="h-4 w-4 text-blue-500 hover:text-sky-300 cursor-pointer"/></p>
					<p className="text-md font-normal text-gray-200 flex items-center gap-2">Organization :- {currentProject?.clientDetails?.organizationName} 
					<BsBoxArrowUpRight className="h-4 w-4 text-blue-500 hover:text-sky-300 cursor-pointer"/></p>
					<p className="text-sm font-normal text-gray-400">Email :- {currentProject?.clientDetails?.email}</p>
					<p className="text-sm font-normal text-gray-400">Contact :- {currentProject?.clientDetails?.number}</p>
					<p className="text-md font-normal text-gray-200">OrganizationId :- {currentProject?.clientDetails?.organizationId}</p>
					<p className="text-md font-normal text-gray-200">Role :- {currentProject?.clientDetails?.organizationRole}</p>

				</div>
				<div className=" w-full md:w-[50%] flex items-center justify-center">
					<img src={currentProject?.clientDetails?.image} alt=""
					className="h-[170px] w-[170px]"/>
				</div>
			</div>
		</main>

	)
}