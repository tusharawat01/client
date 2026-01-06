'use client'
import {useState,useEffect,useRef} from 'react'
import {LuMaximize2} from 'react-icons/lu'
import {AiOutlinePlusCircle} from 'react-icons/ai'
import {Tile as TileLayer2, Vector as VectorLayer} from 'ol/layer.js';
import KML from 'ol/format/KML.js';
import Map from 'ol/Map.js';
import VectorSource from 'ol/source/Vector.js';
import View from 'ol/View.js';
import {RxCross2} from 'react-icons/rx';
import XYZ from 'ol/source/XYZ.js';
import SiteInputMapCard from './SiteInputMapCard';

const key = 'yCsqOwmerwTFcuIuugTQ';
const attributions = ' ';


export default function SiteInputCard({site,k,sites,setSites,openAddSite}){
	const [siteName,setSiteName] = useState('');
	const [location,setLocation] = useState('');
	const [openLargeMap,setOpenLargeMap] = useState(false);
	const [currentKmlFile,setCurrentKmlFile] = useState([]); 
	const [kmlFileName,setKmlFileName] = useState([]);
	const mapboxRef = useRef(null);
	const [kmlLoaded,setKmlLoaded] = useState(false);
	const [newFile,setNewFile] = useState(false);
	const [uploadKMLFileName,setUploadKMLFileName] = useState([]);
	const [uploadKMLArray,setUploadKMLArray] = useState([]);
	const [currentKml,setCurrentKml] = useState('');
	const [path3,setPath3] = useState('');
	const [currentMap,setCurrentMap] = useState(null);

	useEffect(()=>{
		let allSites = [...sites];
		let newSite = {
			siteName,location,kml:currentKmlFile,kmlFileName
		}
		allSites.splice(k,1,newSite);
		setSites(allSites);
	},[siteName,location,currentKmlFile,kmlFileName]);

	useEffect(()=>{
		if(!openAddSite){
			setSiteName('');
			setLocation('');
			setCurrentKmlFile([]);
			setKmlFileName([]);
			setPath3('');setKmlLoaded(false);
			setNewFile(false);
		}
	},[openAddSite])

	const addSourceToMap = async(kmlFile) => {
		let map = currentMap;
		const vectorLayer = new VectorLayer({
	      source: new VectorSource({
	        url: kmlFile,
	        format: new KML(),
	      }),
	    });

	    await map.addLayer(vectorLayer);
	    // changeTheView();
	    // const extent = await vectorLayer.getSource().getExtent();
	    vectorLayer.getSource().on("change", () => {
		  const vectorSource = vectorLayer.getSource();

		  if (vectorSource.getState() === "ready" && !kmlLoaded) {
		    const extent = vectorSource.getExtent();
		    if (extent[0] === Infinity) {
		      console.log("Extent is invalid. KML data might not be loaded correctly.");
		    } else {
		    	setKmlLoaded(true)
				map.getView().fit(extent, { padding: [100, 100, 100, 100], zoom:0, duration: 1500 });
				setCurrentMap(map);
		    }
		  }
		});
	}

	const removeSourceFromMap = () => {
		let map = currentMap
		map.getLayers().forEach((layer) => {
		    const source = layer.getSource();
		    if (source instanceof VectorSource && source.getFormat() instanceof KML) {
		      map.removeLayer(layer);
		    }
	  	});
	  	setCurrentMap(map);
	}

	useEffect(()=>{
		if(currentKml && currentMap){
			if(!kmlLoaded){
				addSourceToMap(currentKml)
			}else{
				setKmlLoaded(false);
				setNewFile(true)
			}
		}else{
			if(currentMap) removeSourceFromMap();
		}
	},[currentKml])

	useEffect(()=>{
		if(!kmlLoaded && newFile){
			addSourceToMap(currentKml);
			setNewFile(false)
		}
	},[kmlLoaded])


	useEffect(()=>{
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
		  target: document.getElementById(`map-${k}`),
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

		setCurrentMap(map);
	
	},[]);

	const url2Setter = () =>{
		const file_input = document.getElementById(`kml-input-${k}`);
		const files = file_input.files;
		Object.keys(files).forEach(i=>{
			const file = files[i];
			if(file?.name?.includes('.kml')){
				const reader = new FileReader();
				reader.addEventListener('load',()=>{
					let uploaded_file = reader.result;
					setCurrentKmlFile([...currentKmlFile,uploaded_file]);
					setKmlFileName([...kmlFileName,file.name]);
				})
				reader.readAsDataURL(file);				
			}
		})	
		setPath3('');
	}

	return (
		<div key={k} className="flex gap- w-full">
			<div className="flex flex-col gap-3 w-[50%] px-4 py-3">
				<div className="flex gap-2 w-full flex-col">
					<h1 className="p-0 m-0 leading-none text-md text-gray-800 font-semibold">
						Site Name <span className="text-red-600">*</span>
					</h1>
					<div className="p-2 w-full border-[1px] bg-gray-50 border-gray-300 rounded-lg">
						<input type="text" className="w-full text-md text-gray-900 bg-transparent outline-none"
						placeholder="Site Name" value={siteName} onChange={(e)=>setSiteName(e.target.value)}
						/>
					</div>
				</div>
				<div className="flex gap-2 w-full flex-col">
					<h1 className="p-0 m-0 leading-none text-md text-gray-800 font-semibold">
						Location or Boundary Coordinates <span className="text-red-600">*</span>
					</h1>
					<div className="p-2 w-full border-[1px] bg-gray-50 border-gray-300 rounded-lg">
						<input type="text" className="w-full text-md text-gray-900 bg-transparent outline-none"
						placeholder="Location or Boundaries" value={location} onChange={(e)=>setLocation(e.target.value)}
						/>
					</div>
				</div>
				<input id={`kml-input-${k}`} onChange={(e)=>{
          			setPath3(e.target.value);url2Setter();
          		}} hidden type="file" accept=".kml" 
				value={path3}
				/>
				<h1 className="p-0 m-0 leading-none text-sm text-gray-800 font-semibold">
					Upload KML <span className="text-red-600">*</span>
				</h1>
				<div className="grid xl:grid-cols-4 lg:grid-cols-4 sm:grid-cols-3 
				xs:grid-cols-2 grid-cols-1 gap-2">
					{
						currentKmlFile?.map((kml,j)=>(
							<SiteInputMapCard kml={kml} key={j} j={j} k={k}
							setCurrentKmlFile={setCurrentKml} currentKmlFile={currentKml}
							/>		
						))
					}
					<button onClick={()=>{
						// if(currentKmlFile.){
						// 	setCurrentKmlFile('');
						// }else{
							document.getElementById(`kml-input-${k}`).click()
						// }
					}} 
					className={`flex items-center justify-center aspect-square bg-gray-200/70 rounded-lg transition-all
					duration-200 ease-in-out px-4 py-2 hover:scale-[105%]`}>
						{/*{currentKmlFile ? 'Remove KML' : 'Upload KML'}*/}
						<AiOutlinePlusCircle className="h-5 w-5 text-gray-600"/>
					</button>
				</div>


			</div>
			<div className="w-[50%] flex flex-col
			gap-2 border-gray-300 border-l-[1px] p-2">
				<div className="border-2 border-sky-400 hover:border-sky-600 transition-all duration-200 
				ease-in-out border-dashed h-full rounded-lg flex items-center 
				justify-center cursor-pointer overflow-hidden relative z-10">
					<div className={`h-full w-full ${openLargeMap ? 'fixed top-0 left-0 z-50 bg-white' : 'relative '}
					transition-all duration-200 ease-in-out group`} >
						<div 
						onClick={()=>setOpenLargeMap(false)}
						className={`top-4 ${openLargeMap ? 'absolute' : 'hidden'} z-40 right-4 cursor-pointer rounded-full p-2 bg-black/50`}>
							<RxCross2 className="h-5 w-5 text-gray-200"/>
						</div>
						<div ref={mapboxRef} id={`map-${k}`} className="w-full h-full overflow-hidden rounded-md z-30" />
						<div onClick={()=>setOpenLargeMap(true)} className={`${openLargeMap ? 'hidden' : 'absolute'} hover:scale-110  
						transition-all duration-200 ease-in-out z-40 right-3 bottom-3 rounded-full bg-black/50 
						cursor-pointer p-1`}>
							<LuMaximize2 className="h-4 w-4 text-gray-200"/>
						</div>
					</div>							
				</div>
			</div>
			

			
		</div>

	)	
}