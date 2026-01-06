
"use client"

import {useState,useEffect} from 'react'
import KML from 'ol/format/KML.js';
import Map from 'ol/Map.js';
import VectorSource from 'ol/source/Vector.js';
import View from 'ol/View.js';
import XYZ from 'ol/source/XYZ.js';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
import {add} from 'ol/coordinate.js';
import * as olCoordinate from 'ol/coordinate';

const key = 'yCsqOwmerwTFcuIuugTQ';
const attributions = ' ';




export default function NewProjectMapCard({kml,j,setCurrentKmlFile,currentKmlFile}) {
	// body...

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
		    url: 'https://api.maptiler.com/tiles/satellite-v2/{z}/{x}/{y}.jpg?key=yCsqOwmerwTFcuIuugTQ',
		    maxZoom: 20,
		  }),
		});
		

		map = new Map({
		  layers: [raster, vector],
		  target: document.getElementById(`map-${j}`),
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
			evt.stopPropagation()
		  if (evt.dragging) {
		    return;
		  }
		  const pixel = map.getEventPixel(evt.originalEvent);
		  displayFeatureInfo(pixel);
		});

		map.on('click', function (evt) {
			evt.stopPropagation()
		  displayFeatureInfo(evt.pixel);
		});	
		
		// setTimeout(()=>{changeTheView()},1000)	

	},[])

	// const changeTheView = async() => {
	// 	const coord = [7.85, 47.983333];
	// 	if(vector.getSource().getFeatures().length > 0){
	// 		view.animate({zoom: 5,duration:1000}, {duration:3000,zoom:0,center: vector.getSource().getFeatures()[1].getGeometry().getCoordinates()});
	// 	}
	// }

	useEffect(()=>{addSourceToMap()},[kml])

	const addSourceToMap = async() => {
		// console.log(j)
		const vectorLayer = new VectorLayer({
	      source: new VectorSource({
	        url: kml,
	        format: new KML(),
	      }),
	    });
		try{
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
						map.getView().fit(extent, { padding: [0, 0, 0, 0], zoom:10, duration: 1500 });
			    }
			  }
			});

		}catch(ex){
			console.log("Cant add the kml to map")
		}
	}


	return (
		<div
		onClick={()=>{
			if(currentKmlFile === kml){
				setCurrentKmlFile('');
			}else{
				setCurrentKmlFile(kml);
			}
		}} className={`rounded-lg ${currentKmlFile === kml ? 'bg-gradient-to-l to-sky-500 from-sky-600 shadow-lg shadow-sky-80/10 ' : 'bg-transparent'} 
		p-[3px] flex items-center gap-3 hover:bg-gradient-to-l to-sky-500 from-sky-600 hover:shadow-lg hover:shadow-sky-80/10 cursor-pointer transition-all 
		group justify-between gap-1 aspect-square w-full`} key={j} >
			<div className={`bg-white shadow-md 
			overflow-hidden h-full rounded-md w-full transition-scale duration-300 ease-in-out `}>
				<div className="h-full w-full">
					<div id={`map-${j}`} className=" h-full w-full" />
				</div>
			</div>
		</div>

	)
}