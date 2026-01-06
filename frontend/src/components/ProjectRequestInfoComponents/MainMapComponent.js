
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
let map;

let vector = new VectorLayer({
  source: new VectorSource(),
});

let view = new View({
    center: [876970.8463461736, 5859807.853963373],
    projection: 'EPSG:3857',
    controls:[],
    zoom: 10,
})
export default function MainMapComponent({kmlFile}) {
	

	const addSourceToMap = async(kmlFile) => {

		const vectorLayer = new VectorLayer({

	      source: new VectorSource({
	        url: kmlFile,
	        format: new KML(),
	      }),
	    });

	    await map.addLayer(vectorLayer);
	    // changeTheView();
	    // const extent = await vectorLayer.getSource().getExtent();
	    let kmlLoaded = false
	    vectorLayer.getSource().on("change", () => {
		  const vectorSource = vectorLayer.getSource();
		  if (vectorSource.getState() === "ready" && !kmlLoaded) {
		    const extent = vectorSource.getExtent();
		    // console.log("i am changing")
		    if (extent[0] === Infinity) {
		      console.log("Extent is invalid. KML data might not be loaded correctly.");
		    } else {
		    	kmlLoaded = true
				map.getView().fit(extent, { padding: [50, 50, 50, 50], zoom:0, duration: 1500 });
		    }
		  }
		});
	}

	useEffect(()=>{
		if(kmlFile){
			addSourceToMap(kmlFile)
		}
	},[kmlFile])

	useEffect(()=>{
		const raster = new TileLayer({
		  source: new XYZ({
		    url: 'https://api.maptiler.com/tiles/satellite-v2/{z}/{x}/{y}.jpg?key=yCsqOwmerwTFcuIuugTQ',
		    maxZoom: 20,
		  }),
		});
		

		map = new Map({
		  layers: [raster, vector],
		  target: document.getElementById(`map`),
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
		
		// setTimeout(()=>{changeTheView()},500)	

	},[])

	const changeTheView = async() => {
		view.animate({zoom: 5,duration:1000}, {duration:3000,zoom:0,center: vector.getSource().getFeatures()[1].getGeometry().getCoordinates()});
	}

	return (
		<main className="h-full w-full">
			<div id="map" className="h-full w-full"/>
		</main>

	)
}