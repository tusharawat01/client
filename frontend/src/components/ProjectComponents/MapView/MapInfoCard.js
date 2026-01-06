
"use client"

import {useState,useEffect,useRef} from 'react'
import KML from 'ol/format/KML.js';
import Map from 'ol/Map.js';
import VectorSource from 'ol/source/Vector.js';
import View from 'ol/View.js';
import XYZ from 'ol/source/XYZ.js';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
import {add} from 'ol/coordinate.js';
import * as olCoordinate from 'ol/coordinate';

const key = 'yCsqOwmerwTFcuIuugTQ';
const attributions = '';




export default function MapInfoCard({currentFile,setCurrentFile,setShowName,showName,
	kml,changeToFile,j,setKmlFile}) {
	// body...
	// const [kmlLoaded,setKmlLoaded] = useState(false);
	const mapRef = useRef();
	let map;

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

		const raster = new TileLayer({
		  source: new XYZ({
		    url: 'https://api.maptiler.com/tiles/satellite/{z}/{x}/{y}.jpg?key=' + key,
		    maxZoom: 40,
		  }),
		});		

		map = new Map({
		  layers: [raster, vector],
		  target: document.getElementById(`mapId-${j}`),
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
			evt.stopPropagation();
		  if (evt.dragging) {
		    return;
		  }
		  const pixel = map.getEventPixel(evt.originalEvent);
		  displayFeatureInfo(pixel);
		});

		map.on('click', function (evt) {
			evt.stopPropagation();
		  displayFeatureInfo(evt.pixel);
		});	

		// map.stopPropagation()

		// setTimeout(()=>{changeTheView()},1000)	

	},[])

	useEffect(()=>{
		addSourceToMap()
		
	},[kml])


	const addSourceToMap = async() => {
		// console.log(j)
		const vectorLayer = new VectorLayer({
	      source: new VectorSource({
	        url: kml,
	        format: new KML(),
	      }),
	    });

	    await map.addLayer(vectorLayer);
	    let kmlLoaded = false
	    vectorLayer.getSource().on("change", () => {
		  const vectorSource = vectorLayer.getSource();
		  if (vectorSource.getState() === "ready" && !kmlLoaded) {
		    const extent = vectorSource.getExtent();
		    // console.log(extent + ' ' + j)
		    if (extent[0] === Infinity) {
		      console.log("Extent is invalid. KML data might not be loaded correctly.");
		    } else {
		    	kmlLoaded = true
		    	// console.log("im changing view" + j)
					map.getView().fit(extent, { padding: [0, 0, 0, 0], zoom:0, duration: 1500 });
		    }
		  }
		});
	}

	return (
		<div
		onClick={()=>{
			setCurrentFile(kml);
			setKmlFile(kml);
		}} className={`rounded-xl ${currentFile === kml ? 'bg-gradient-to-l to-sky-500 from-sky-600 shadow-lg shadow-sky-80/10 ' : 'bg-transparent'} 
		p-2 flex items-center gap-3 hover:bg-gradient-to-l to-sky-500 from-sky-600 hover:shadow-lg hover:shadow-sky-80/10 cursor-pointer transition-all 
		group justify-between gap-1`} key={j} >
			<h2 className={`text-md ${currentFile === kml ? 'text-gray-200 font-semibold' : 'text-black' }
			group-hover:text-gray-200 block w-[60%] group-hover:font-semibold block break-all`}>{kml?.split('/')[kml?.split('/').length - 1].replaceAll('_',' ')?.split('.')[0]}</h2>
			<div className={`group-hover:shadow-lg shadow-gray-500/40 bg-white rounded-xl ${currentFile === kml ? 'text-sky-500' : 'text-black'} 
			group-hover:text-sky-500 shadow-md overflow-hidden transition-scale duration-300 ease-in-out `}>
				<div className="h-12 w-14">
					<div ref={mapRef} id={`mapId-${j}`} className=" h-full w-full" />
				</div>
			</div>
		</div>

	)
}