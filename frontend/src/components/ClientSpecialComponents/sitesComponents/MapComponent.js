"use client"

import { MapContainer, TileLayer,Marker,Popup, LayersControl } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css'
import "leaflet-defaulticon-compatibility";
import {RxCross2} from 'react-icons/rx';
import {BiCloudDownload} from 'react-icons/bi';
import {useState,useEffect,useRef} from 'react'
import {SiOpenlayers} from 'react-icons/si';
import { useMapEvents } from 'react-leaflet/hooks'
import {MdOutlineArrowBack} from 'react-icons/md';
import ReactLeafletKml from 'react-leaflet-kml';
import KmlComponent from './KmlComponent';
import SiteCard from './SiteCard';


function MyComponent() {
  const map = useMapEvents({
    click: (e) => {
      console.log(e)
    },
    locationfound: (location) => {
      console.log('location found:', location)
    },
  })
  return null
}

export default function MapComponent({
	allSites,currentTab,setCurrentTab
}) {
	const [center, setCenter] = useState({
	    lat: 0,
	    lng: 0,
	  });
	const mapRef = useRef();
	const [loadedKml,setLoadedKml] = useState([]);
	const [showingProject,setShowingProject] = useState([]);

	 function parseKMLCoordinates(kmlText) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(kmlText, 'text/xml');
    
    const coordinates = [];
    const placemarks = xmlDoc.getElementsByTagName('Placemark');

    for (let i = 0; i < placemarks.length; i++) {
      const coordinatesElement = placemarks[i].getElementsByTagName('coordinates')[0];
      if (coordinatesElement) {
        const coordinatesText = coordinatesElement.textContent.trim();
        const coordinatesArray = coordinatesText.split(',').map(coord => coord.trim().split(' '));
        coordinates.push(...coordinatesArray);
      }
    }
    return coordinates
  }

	useEffect(()=>{
		if(loadedKml?.length > 0){
			// const newLat = loadedFiles[0]?.exif_data?.latitude || 0;
			// const newLng = loadedFiles[0]?.exif_data?.longitude || 0; 
			fetch(loadedKml[0])
			.then((response)=>response.text())
			.then(async(kmltext)=>{
				const coordinates = await parseKMLCoordinates(kmltext);
				const newLat = coordinates[1][0];
				const newLng = coordinates[0][0];
				setCenter({ 
					lat: newLat, 
					lng: newLng
				});
				 mapRef?.current?.setView([newLat, newLng], 13);
			})
		}
	},[loadedKml])

	const showProject = (project) => {
		const currProject = [project,...showingProject];
		setShowingProject(currProject);
		const currKmls = [project,...loadedKml]
		setLoadedKml(currKmls);
	}

	const removeProject = (project) => {
		let currProject = [...showingProject];
		const idx = currProject.findIndex(curproject=>{
			if(curproject === project){
				return true	
			}
			return false
		})
		if(idx > -1){
			currProject.splice(idx,1);
			setShowingProject(currProject);
		}
		let currKmls = [...loadedKml];
		const idx2 = currKmls.findIndex((kml)=>{
			if(kml === project){
				return true
			}
			return false
		})
		if(idx2 > -1){
			currKmls.splice(idx2,1);
			setLoadedKml(currKmls);
		}
	}

	console.log(loadedKml)

	return(
		<div className={`z-40 h-full w-full rounded-lg overflow-hidden 
		transition-all duration-200 ease-in-out bg-gray-300/60 flex  gap-1 flex items-center`}>
			<div className="md:w-[28%] w-full bg-[#1f1f1f] h-full overflow-y-auto scrollbar-thin">
				<div className="w-full border-b-[1px] py-2 pr-3 pl-1 border-gray-700 gap-2 flex items-center">
					<div 
					onClick={()=>setCurrentTab('list')}
					className="p-2 h-full flex items-center justify-center transition-all duration-200 ease-in-out cursor-pointer">
						<MdOutlineArrowBack className="h-6 w-6 text-gray-200"/>
					</div>
					<div className="px-2 py-1 border-l-[1px] border-gray-600">
						<img src="https://aero2astro.com/home/assets/logos/logo_white.png" alt=""
						className="w-[90px]"/>
					</div>
				</div>

				<div className="flex flex-col gap-3 px-3 py-3">
					{
						allSites?.map((site,k)=>(
							<SiteCard site={site} key={k} k={k} showProject={showProject}
							removeProject={removeProject}
							/>
						))
					}

				</div>

			</div>
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

				    {
				    	loadedKml?.map((kml,k)=>{
				    		return (
				    			<KmlComponent url={kml} key={k}/>
				    		) 
				    	})
				    }

			        
			        <MyComponent />
			    </MapContainer>
			    

		</div>
	)

}