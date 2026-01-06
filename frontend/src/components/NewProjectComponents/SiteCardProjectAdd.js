'use client'
import {useState,useEffect,useRef} from 'react'
import {LuMaximize2} from 'react-icons/lu'
import {Tile as TileLayer2, Vector as VectorLayer} from 'ol/layer.js';
import KML from 'ol/format/KML.js';
import Map from 'ol/Map.js';
import VectorSource from 'ol/source/Vector.js';
import View from 'ol/View.js';
import {RxCross2} from 'react-icons/rx';
import XYZ from 'ol/source/XYZ.js';
import { GrMapLocation } from "react-icons/gr";
import { MdOutlineDateRange } from "react-icons/md";
import { AiOutlineFundProjectionScreen } from "react-icons/ai";
import {currentUserState} from '../../atoms/userAtom';
import {useRecoilState} from 'recoil';

export default function SiteCardProjectAdd({site,k,
	openSite,setOpenSitesTab}) {

	const [openLargeMap,setOpenLargeMap] = useState(false);
	const [currentMap,setCurrentMap] = useState(null); 
	const [currentUser,setCurrentUser] = useRecoilState(currentUserState);
	
	const initMap = async() => {
		let vector = new VectorLayer({
		  source: new VectorSource(),
		});

		let view = new View({
		    center: [876970.8463461736, 5859807.853963373],
		    projection: 'EPSG:3857',
		    controls:[],
		    zoom: 10,
		})

		const raster = new TileLayer2({
		  source: new XYZ({
		    url: 'https://api.maptiler.com/tiles/satellite-v2/{z}/{x}/{y}.jpg?key=yCsqOwmerwTFcuIuugTQ',
		    maxZoom: 20,
		  }),
		});
		

		// console.log(raster)
		const map = new Map({
		  layers: [raster, vector],
		  target: document.getElementById(`site-${k}`),
		  view: view,
		  controls: []
		});
		const displayFeatureInfo = function (pixel) {
		  const features = [];
		  map.forEachFeatureAtPixel(pixel, function (feature) {
		    features.push(feature);
		  });

		  if (features.length > 0) {
		    const info = [];
		    let i, ii;
		    for (i = 0, ii = features.length; i < ii; ++i) {
		      info.push(features[i].values_.LOCATION);
		    }
		    // document.getElementById('info').innerHTML = info.join(', ') || '(unknown)';
		    map.getTarget().style.cursor = 'pointer';
		  } else {
		    // document.getElementById('info').innerHTML = '&nbsp;';
		    map.getTarget().style.cursor = '';
		  }
		};
		map.on('pointermove', function (evt) {
		  if (evt.dragging) {
		    return;
		  }
		  const pixel = map.getEventPixel(evt.originalEvent);
		  displayFeatureInfo(pixel);
		});

		map.on('click', function (evt) {
		  displayFeatureInfo(evt.pixel);
		});

		const vectorLayer = new VectorLayer({
	      source: new VectorSource({
	        url: site.kml?.[0] || site?.kml,
	        format: new KML(),
	      }),
	    });

	    await map.addLayer(vectorLayer);

	    vectorLayer.getSource().on("change", () => {
		  const vectorSource = vectorLayer.getSource();

		  if (vectorSource.getState() === "ready") {
		    const extent = vectorSource.getExtent();
		    if (extent[0] === Infinity) {
		      console.log("Extent is invalid. KML data might not be loaded correctly.");
		    } else {
				map.getView().fit(extent, { padding: [100, 100, 100, 100], zoom:10, duration: 1500 });
				setCurrentMap(map);
		    }
		  }
		});

	}

	useEffect(()=>{
		initMap();
		
		// setCurrentMap(map);
	
	},[]);

	return (
		<div className="rounded-lg border-[1px] border-gray-300 shadow-lg hover:shadow-xl flex flex-col">
			<div className="w-full aspect-video cursor-pointer overflow-hidden relative">
				<div className={`h-full w-full ${openLargeMap ? 'fixed top-0 left-0 z-50 bg-white' : 'relative '}
				transition-all duration-200 ease-in-out group`} >
					<div 
					onClick={()=>setOpenLargeMap(false)}
					className={`top-4 ${openLargeMap ? 'absolute' : 'hidden'} z-40 right-4 cursor-pointer rounded-full p-2 bg-black/50`}>
						<RxCross2 className="h-5 w-5 text-gray-200"/>
					</div>
					<div id={`site-${k}`} className="w-full h-full overflow-hidden rounded-md z-30" />
					<div onClick={()=>setOpenLargeMap(true)} className={`${openLargeMap ? 'hidden' : 'absolute'} hover:scale-110  
					transition-all duration-200 ease-in-out z-40 right-3 bottom-3 rounded-full bg-black/50 
					cursor-pointer p-1`}>
						<LuMaximize2 className="h-4 w-4 text-gray-200"/>
					</div>
				</div>							
			</div>

			<div className="p-2 flex flex-col gap-2">
				<p className="text-gray-900 text-md">{site?.siteName}</p>
				<p className="text-gray-900 flex items-center gap-2 text-sm">
					<GrMapLocation className="h-4 w-4"/>
					{site?.location}
				</p>
				<p className="text-gray-900 flex items-center gap-2 text-sm">
					<MdOutlineDateRange className="h-4 w-4"/>
					{site?.createdAt?.split("T")?.[0]}
				</p>
				<p className="text-gray-900 flex items-center gap-2 text-sm">
					<AiOutlineFundProjectionScreen className="h-4 w-4"/>
					Ongoing Projects - {site?.projects?.length}
				</p>
				<button onClick={()=>{
					openSite(site)
					setOpenSitesTab(false)
				}} className="text-white text-sm w-full rounded-lg py-1 mt-1 transition-all 
				duration-200 ease-in-out bg-blue-600 hover:bg-blue-500">
					Select Site
				</button>
			</div>


		</div>
	)
}