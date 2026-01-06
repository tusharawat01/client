"use client"

import {useState,useRef,useEffect} from 'react';
import {MdPerson} from 'react-icons/md'
import {useRecoilState} from 'recoil';
import {currentUserState} from '../../../../atoms/userAtom';
import {createSolarProject,updateSolarProjectsId} from '../../../../utils/ApiRoutes';
import {AiOutlineCloudUpload} from 'react-icons/ai';
import {RxCross2} from 'react-icons/rx';
import { MapContainer, TileLayer,Marker,Popup, LayersControl } from 'react-leaflet'
import { useMapEvents } from 'react-leaflet/hooks'
import 'leaflet/dist/leaflet.css'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css'
import ImageKit from 'imagekit';
import axios from 'axios';
import "leaflet-defaulticon-compatibility";
import {useRouter} from 'next/navigation'

const options = [
	'Solar in Forest',
	'Solar in House',
	'Solar in Industries'
	
]





export default function Home() {
	const [openProfileOptions,setOpenProfileOptions] = useState(false);
	const [currentUser,setCurrentUser] = useRecoilState(currentUserState);
	const [area,setArea] = useState('');
	const [nameOrID,setNameOrID] = useState('');
	const [type,setType] = useState('Lattice Self-Supported Horizontal Structure');
	const [url,setUrl] = useState('');
	const [loadedImage,setLoadedImage] = useState('');
	const [latitude,setLatitude] = useState('');
	const [longitude,setLongitude] = useState('');
	const mapRef = useRef();
	const router = useRouter();
	const [position,setPosition] = useState(['0','0']); 
	const [scope,setScope] = useState('');
	const [loading,setLoading] = useState(false);
	const imagekit = new ImageKit({
	    publicKey : process.env.NEXT_PUBLIC_IMAGEKIT_ID,
	    privateKey : process.env.NEXT_PUBLIC_IMAGEKIT_PRIVATE,
	    urlEndpoint : process.env.NEXT_PUBLIC_IMAGEKIT_ENDPOINT
	});

	console.log(currentUser)

	function MyComponent() {
	  const map = useMapEvents({
	    click: (e) => {
	      console.log(e)
	      let pos = [e.latlng.lat]
	      pos = [...pos,e.latlng.lng]
	      setLatitude(e.latlng.lat)
	      setLongitude(e.latlng.lng);
	      setPosition(pos);
	    },
	    locationfound: (location) => {
	      console.log('location found:', location)
	    },
	  })
	  return null
	}

	const url2Setter = () =>{
		const file_input = document.getElementById('file1');
		const files = file_input.files;
		Object.keys(files).forEach(i=>{
			const file = files[i];
			const reader = new FileReader();
			reader.addEventListener('load',()=>{
				let uploaded_file = reader.result;
				setLoadedImage(uploaded_file)
			})
			reader.readAsDataURL(file);				
		})	
		setUrl('');
	}

	const checkImage = (imageData) => {
		if(imageData.split(':')[1].split('/')[0] === 'image'){
			return true
		}else{
			setLoadedImage('');
			alert("Not supported image format for reference image")
			return false
		}
	}

	const createProjectWithImage = async(image) => {
		const {data} = await axios.post(createSolarProject,{
			name:nameOrID,referenceImage:image,
			projectArea:area,startDate:new Date().toISOString(),
			scope,
			type:type,
			coordinates:{
				latitude:latitude,
				longitude:longitude
			},
			clientDetails:{
				name:currentUser?.name,
				_id:currentUser?._id,
				image:currentUser?.image,
				organizationName:currentUser?.organizationName,
				organizationRole:currentUser?.organizationRole,
				organizationId:currentUser?.organizationId,
				organizationDescription:currentUser?.organizationDescription,
				email:currentUser?.email,
				number:currentUser?.number
			}
		});
		if(data?.status){
			console.log(data);
			updateUserSolarProjectId(data?.solar?._id)
		}else{
			setLoading(false)
			alert("Something went wrong! can't create project")
		}
	}

	const updateUserSolarProjectId = async(solarDBId) => {
		const ids = [...currentUser?.solarProjectsId,solarDBId];
		console.log(ids);
		const {data} = await axios.post(updateSolarProjectsId,{
			id:currentUser?._id,
			solarProjectsId:ids
		})
		if(data?.status){
			setCurrentUser(data?.user);
			setLoading(false)
			router.back()
		}else{
			alert("Project created but not assigned to you!")
		}
	} 

	const uploadImage = (url) => {
		setLoading(true)
		imagekit.upload({
		    file : url, //required
		    folder:"Images",
		    fileName : `${nameOrID}-reference-image`,   //required
		}).then(response => {
			createProjectWithImage(response.url);
		}).catch(error => {
			console.log(error);
			setAlertTheUser('Something went wrong while uploading!');
			setLoading(false);
		});
	}

	const createProject = () => {
		if(nameOrID.length > 2 && area.length > 2 && latitude && longitude && type && loadedImage ){
			if(checkImage(loadedImage)){
				uploadImage(loadedImage);
			}
		}else{
			alert("Please Fill The Required Details!")
		}
	}

	return (
		<main className="w-[100%] h-[100vh] overflow-y-scroll pb-[50px]">
			<div className="fixed top-0 z-50 w-full px-5 flex items-center 
			justify-between py-3 bg-[#292929] z-30">
				<div className="flex items-center gap-4">
					<div className="px-2 border-r-[1px] border-gray-600">
						<img src="https://aero2astro.com/home/assets/logos/logo_white.png" alt=""
						className="w-[100px]"/>
					</div>
					<h1 className="md:text-xl text-md font-semibold text-gray-200">New Project</h1>
				</div>
				<div className="flex items-center gap-2">
					<MdPerson 
					onClick={()=>setOpenProfileOptions(!openProfileOptions)}
					className="h-8 w-8 text-gray-300 cursor-pointer"/>
					<h1 className="text-xl font-semibold text-gray-200">{currentUser?.name}</h1>
				</div>
			</div>
			<div className="flex md:flex-row flex-col px-5 py-3 gap-10 max-w-6xl mx-auto pt-[100px]">
				<div className="rounded-lg flex flex-col bg-[#262626] border-[1px] 
				border-gray-700 px-5 py-3 md:w-[50%] w-full">
					<h1 className="text-md font-semibold text-gray-200">Name or ID <span className="text-red-500">*</span></h1>
					<div className="px-4 py-2 mt-2 rounded-md border-[1px] border-gray-600 focus-within:border-sky-600 bg-gray-900/30 hover:bg-gray-900/60 w-full">
						<input type="text" className="placeholder:text-gray-500 text-gray-200 bg-transparent outline-none w-full" 
						placeholder="Enter solar plane name or ID" value={nameOrID} onChange={(e)=>setNameOrID(e.target.value)}
						/>
					</div>
					<h1 className="text-md font-semibold text-gray-200 mt-5">Area <span className="text-red-500">*</span></h1>
					<div className="px-4 py-2 mt-2 rounded-md border-[1px] border-gray-600 focus-within:border-sky-600 bg-gray-900/30 hover:bg-gray-900/60 w-full">
						<input type="text" className="placeholder:text-gray-500 text-gray-200 bg-transparent outline-none w-full" 
						placeholder="Enter solar plant name or ID" value={area} onChange={(e)=>setArea(e.target.value)}
						/>
					</div>
					<h1 className="text-md font-semibold text-gray-200 mt-5">Coordinates <span className="text-red-500">*</span> <span className="text-gray-500/70 ml-1">(Place marker on map)</span> </h1>
					<div className="flex items-center gap-5 md:flex-row flex-col">
						<div className="px-4 py-2 mt-2 rounded-md border-[1px] border-gray-600 focus-within:border-sky-600 bg-gray-900/30 hover:bg-gray-900/60 w-full">
							<input type="text" className="placeholder:text-gray-500 text-gray-200 bg-transparent outline-none w-full" 
							placeholder="Enter latitude" value={latitude} onChange={(e)=>setLatitude(e.target.value)}
							/>
						</div>
						<div className="px-4 py-2 mt-2 rounded-md border-[1px] border-gray-600 focus-within:border-sky-600 bg-gray-900/30 hover:bg-gray-900/60 w-full">
							<input type="text" className="placeholder:text-gray-500 text-gray-200 bg-transparent outline-none w-full" 
							placeholder="Enter longitude" value={longitude} onChange={(e)=>setLongitude(e.target.value)}
							/>
						</div>
					</div>
					<h1 className="text-md font-semibold text-gray-200 mt-5">Solar type <span className="text-red-500">*</span></h1>
					<div className="px-4 py-2 mt-2 rounded-md border-[1px] border-gray-600 focus-within:border-sky-600 bg-gray-900/30 hover:bg-gray-900/60 w-full">
						<select value={type} onChange={(e)=>setType(e.target.value)}
						className="placeholder:text-gray-500 text-gray-200 bg-transparent outline-none w-full" 
						>
						{
							options?.map((opt,k)=>(
								<option className="bg-gray-900/80 text-white" value={opt} key={k}>{opt}</option>
							))
						}
						</select>
					</div>
					<h1 className="text-md font-semibold text-gray-200 mt-5">Scope (if any)</h1>
					<div className="px-4 py-2 mt-2 rounded-md border-[1px] border-gray-600 focus-within:border-sky-600 bg-gray-900/30 hover:bg-gray-900/60 w-full">
						<textarea type="text" className="resize-none h-[100px] placeholder:text-gray-500 text-gray-200 bg-transparent outline-none w-full" 
						placeholder="Enter scope" value={scope} onChange={(e)=>setScope(e.target.value)}
						/>
					</div>
					<h1 className="text-md font-semibold text-gray-200 mt-5">Reference Image <span className="text-red-500">*</span></h1>
					{
						loadedImage ? 
						<div className="rounded-md mt-2 w-[100%] border-[1px] border-gray-500 relative">
							<div 
							onClick={()=>setLoadedImage('')}
							className="absolute top-3 right-3 bg-gray-900/50 hover:bg-gray-900/80 rounded-full p-1 
							cursor-pointer flex items-center justify-center">
								<RxCross2 className="text-gray-300 hover:text-sky-500 h-5 w-5"/>
							</div> 
							<img src={loadedImage} alt="" className="h-full w-full rounded-md"/>
						</div>
						:
						<div onClick={()=>{document.getElementById('file1').click()}} className="px-4 flex items-center gap-3 py-2 mt-2 cursor-pointer rounded-md border-[1px] border-gray-600 focus-within:border-sky-600 bg-gray-900/30 hover:bg-gray-900/60 w-full">
							<AiOutlineCloudUpload className="h-6 w-6 text-gray-200"/>
							<p className="text-md font-semibold text-gray-200">Upload Reference Image</p>
							<input type="file" id="file1" hidden className="placeholder:text-gray-500 text-gray-200 bg-transparent outline-none w-full" 
							placeholder="Enter tower name or ID" value={url} accept="Image/*" onChange={(e)=>{setUrl(e.target.value);url2Setter()}}
							/>
						</div>
					}
				</div>
				<div className="md:w-[50%] w-full" >
					<div className="w-full rounded-lg flex flex-col bg-[#262626] border-[1px] 
					border-gray-700 px-3 py-3 ">
						<div className="w-full h-[300px] border-[1px] border-gray-500">
							<MapContainer
						      center={[18.941842351894458, 73.0256777078700]}
						      zoom={13}
						      style={{ height: "100%", width: "100%" }}
						      ref={mapRef}
						      whenCreated={(map) => (mapRef.current = map)}
						    >
						        
						         
							    <LayersControl position="topright">
								    <LayersControl.Overlay checked name="Vector Map">
								        <TileLayer
									        url={`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`}
									        attribution=''
									    />
								    </LayersControl.Overlay>

								    <LayersControl.Overlay name="Mapbox Map">
								        <TileLayer
									        url={`https://api.mapbox.com/styles/v1/mapbox/streets-v12/tiles/256/{z}/{x}/{y}@2x?access_token=sk.eyJ1IjoidGhlamFzaGFyaSIsImEiOiJjbG4wazg4c3YxMDMwMmpuemp2eDl6bzh0In0.sUZFHTO5dLZjZDdqINFOwA`}
									        attribution=''
									      />
								    </LayersControl.Overlay>

								    <LayersControl.Overlay name="Satellite Map">
								        <TileLayer
									        url={`https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}.png`}
									        attribution=''
									    />
								    </LayersControl.Overlay>
							    </LayersControl>
							    <Marker position={position}>
							      <Popup>
							        {position}
							      </Popup>
							    </Marker>
							   

						        
						        <MyComponent />
						    </MapContainer>

						</div>

					</div>

					<button onClick={()=>{if(!loading) createProject()}} 
					className="py-2 px-5 rounded-md	border-[1px] border-gray-700 bg-blue-600 hover:bg-blue-700 my-5 
					w-full text-white cursor-pointer">
						{
							loading ?
							<span className="loader1" />
							:
							'Create Project'
						}
					</button>

				</div>

			</div>
		</main>
	)
}