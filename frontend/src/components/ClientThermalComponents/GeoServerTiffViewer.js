"use client"
import {useState,useEffect,useRef} from 'react'
import TileWMS from 'ol/source/TileWMS.js';
import Map from 'ol/Map.js';
import OSM from 'ol/source/OSM.js';
import View from 'ol/View.js';
import 'ol/ol.css';
import {Image as ImageLayer, Tile} from 'ol/layer.js';
import { transformExtent } from 'ol/proj';
import { get as getProjection } from 'ol/proj';
import proj4 from 'proj4';
import { register } from 'ol/proj/proj4';
import {MapContainer,TileLayer, FeatureGroup, Marker, Popup, 
	LayersControl, useMapEvents, Circle, SVGOverlay, Tooltip, Polygon,
	Polyline, Rectangle, CircleMarker, LayerGroup } from 'react-leaflet';
import { WMSTileLayer } from 'react-leaflet/WMSTileLayer'
import "leaflet/dist/leaflet.css";
import { EditControl } from 'react-leaflet-draw'
import 'leaflet-geometryutil';
import {AiOutlineSave} from 'react-icons/ai';
import 'leaflet-geodesy';
import "leaflet-draw/dist/leaflet.draw.css";
import L from "leaflet";
import {RxDownload,RxCross2} from 'react-icons/rx';
import ImageKit from 'imagekit';
import axios from 'axios';
import {updateMapLayersInProject} from '../../utils/ApiRoutes';
import {TfiLocationPin} from 'react-icons/tfi';
import SavedMapLayerCard from './SavedMapLayerCard';
import { FaArrowRight } from "react-icons/fa6";

let map = '';
proj4.defs("EPSG:4326", "+proj=longlat +datum=WGS84 +no_defs");
register(proj4);

let mapLayersVar = [];

const downloadKml = (mapLayers,setData) => {
	function markersToKML(markers) {
	  const kml = `<?xml version="1.0" encoding="UTF-8"?>
	    <kml xmlns="http://www.opengis.net/kml/2.2">
	      <Document>
	        ${markers
	          .map((marker, index) => {
	            if (marker.type === 'marker') {
	              return `
	                <Placemark>
	                  <name>${marker.id}</name>
	                  <Point>
	                    <coordinates>${marker.latlng.lng},${marker.latlng.lat}</coordinates>
	                  </Point>
	                  <description><![CDATA[
	                    ${marker.type}-${marker.id}
	                  ]]></description>
	                </Placemark>`;
	            } else if(marker.type === 'circlemarker'){
					return `
		                <Placemark>
		                  <name>${marker.id}</name>
		                  <Point>
		                    <coordinates>${marker.latlng.lng},${marker.latlng.lat}</coordinates>
		                  </Point>
		                  <description><![CDATA[
		                    ${marker.type}-${marker.id}
		                  ]]></description>
		                </Placemark>`;
	            } else if (marker.type === 'polygon') {
	              return `
	              	<Style id="blueTransparentPolygonStyle">
					  <LineStyle>
					    <color>80ff0000</color>
					    <width>3</width>
					  </LineStyle>
					  <PolyStyle>
					    <color>40ff0000</color>
					  </PolyStyle>
					</Style>
	                <Placemark>
	                  <name>${marker.id}</name>
	                  <styleUrl>#blueTransparentPolygonStyle</styleUrl>
	                  <Polygon>
	                    <outerBoundaryIs>
	                      <LinearRing>
	                        <coordinates>
	                          ${marker.latlngs.map(coord => `${coord.lng},${coord.lat}`).join(' ')}
	                        </coordinates>
	                      </LinearRing>
	                    </outerBoundaryIs>
	                  </Polygon>
	                  <description><![CDATA[
	                    ${marker.type}-${marker.id}
	                  ]]></description>
	                </Placemark>`;
	            } else if (marker.type === 'polyline') {

	              return `
	              	<Style id="brightBoldLineStyle">
					  <LineStyle>
					    <color>ff0000ff</color> 
					    <width>5</width> 
					  </LineStyle>
					</Style>
	                <Placemark>
	                  <name>${marker.id}</name>
	                  <styleUrl>#brightBoldLineStyle</styleUrl>
	                  <LineString>
	                    <coordinates>
	                      ${marker.latlngs.map(coord => `${coord.lng},${coord.lat}`).join(' ')}
	                    </coordinates>
	                  </LineString>
	                  <description><![CDATA[
	                    ${marker.type}-${marker.id}
	                  ]]></description>
	                </Placemark>`;
	            } else if (marker.type === 'rectangle') {
	            
	              return `
	             	<Style id="brightBoldRectangleStyle">
					  <PolyStyle>
					    <color>30ff0000</color>
					  </PolyStyle>
					  <LineStyle>
					    <color>80ff0000</color> 
					    <width>3</width>
					  </LineStyle> 
					</Style>
	                <Placemark>
	                  <name>${marker.id}</name>
	                  <styleUrl>#brightBoldRectangleStyle</styleUrl>
	                  <Polygon>
	                    <outerBoundaryIs>
                          <LinearRing>
                            <coordinates>
                            	${marker.latlngs.map(coord => `${coord.lng},${coord.lat}`).join(' ')}
	                        </coordinates>
					      </LinearRing>
					    </outerBoundaryIs>
	                  </Polygon>
	                  <description><![CDATA[
	                    ${marker.type}-${marker.id}
	                  ]]></description>
	                </Placemark>`;
	            }
	          })
	          .join('')}
	      </Document>
	    </kml>`;

	  return kml;
	}

	function downloadKML(data, filename) {
	  const blob = new Blob([data], { type: 'application/xml' });
	  const link = document.createElement('a');
	  link.href = window.URL.createObjectURL(blob);
	  link.download = filename;
	  link.click();
	}

	function exportMarkersAsKML(mapLayers,setData) {
	  const kmlData = markersToKML(mapLayers);
	  setData(kmlData);
	  downloadKML(kmlData, 'markers.kml');
	}

	exportMarkersAsKML(mapLayers,setData);

}
const save = (mapLayers,setUploading,router,
	currentProject,setCurrentProject) => {
	
	const imagekit = new ImageKit({
	    publicKey : process.env.NEXT_PUBLIC_IMAGEKIT_ID,
	    privateKey : process.env.NEXT_PUBLIC_IMAGEKIT_PRIVATE,
	    urlEndpoint : process.env.NEXT_PUBLIC_IMAGEKIT_ENDPOINT
	});
	// const [] = useRecoilState(currentProjectState)

	function markersToKML(markers) {
	  const kml = `<?xml version="1.0" encoding="UTF-8"?>
	    <kml xmlns="http://www.opengis.net/kml/2.2">
	      <Document>
	        ${markers
	          .map((marker, index) => {
	            if (marker.type === 'marker') {
	              return `
	                <Placemark>
	                  <name>${marker.id}</name>
	                  <Point>
	                    <coordinates>${marker.latlng.lng},${marker.latlng.lat}</coordinates>
	                  </Point>
	                  <description><![CDATA[
	                    ${marker.type}-${marker.id}
	                  ]]></description>
	                </Placemark>`;
	            } else if(marker.type === 'circlemarker'){
					return `
		                <Placemark>
		                  <name>${marker.id}</name>
		                  <Point>
		                    <coordinates>${marker.latlng.lng},${marker.latlng.lat}</coordinates>
		                  </Point>
		                  <description><![CDATA[
		                    ${marker.type}-${marker.id}
		                  ]]></description>
		                </Placemark>`;
	            } else if (marker.type === 'polygon') {
	              return `
	              	<Style id="blueTransparentPolygonStyle">
					  <LineStyle>
					    <color>80ff0000</color>
					    <width>3</width>
					  </LineStyle>
					  <PolyStyle>
					    <color>40ff0000</color>
					  </PolyStyle>
					</Style>
	                <Placemark>
	                  <name>${marker.id}</name>
	                  <styleUrl>#blueTransparentPolygonStyle</styleUrl>
	                  <Polygon>
	                    <outerBoundaryIs>
	                      <LinearRing>
	                        <coordinates>
	                          ${marker.latlngs.map(coord => `${coord.lng},${coord.lat}`).join(' ')}
	                        </coordinates>
	                      </LinearRing>
	                    </outerBoundaryIs>
	                  </Polygon>
	                  <description><![CDATA[
	                    ${marker.type}-${marker.id}
	                  ]]></description>
	                </Placemark>`;
	            } else if (marker.type === 'polyline') {

	              return `
	              	<Style id="brightBoldLineStyle">
					  <LineStyle>
					    <color>ff0000ff</color> 
					    <width>5</width> 
					  </LineStyle>
					</Style>
	                <Placemark>
	                  <name>${marker.id}</name>
	                  <styleUrl>#brightBoldLineStyle</styleUrl>
	                  <LineString>
	                    <coordinates>
	                      ${marker.latlngs.map(coord => `${coord.lng},${coord.lat}`).join(' ')}
	                    </coordinates>
	                  </LineString>
	                  <description><![CDATA[
	                    ${marker.type}-${marker.id}
	                  ]]></description>
	                </Placemark>`;
	            } else if (marker.type === 'rectangle') {
	            
	              return `
	             	<Style id="brightBoldRectangleStyle">
					  <PolyStyle>
					    <color>30ff0000</color>
					  </PolyStyle>
					  <LineStyle>
					    <color>80ff0000</color> 
					    <width>3</width>
					  </LineStyle> 
					</Style>
	                <Placemark>
	                  <name>${marker.id}</name>
	                  <styleUrl>#brightBoldRectangleStyle</styleUrl>
	                  <Polygon>
	                    <outerBoundaryIs>
                          <LinearRing>
                            <coordinates>
                            	${marker.latlngs.map(coord => `${coord.lng},${coord.lat}`).join(' ')}
	                        </coordinates>
					      </LinearRing>
					    </outerBoundaryIs>
	                  </Polygon>
	                  <description><![CDATA[
	                    ${marker.type}-${marker.id}
	                  ]]></description>
	                </Placemark>`;
	            }
	          })
	          .join('')}
	      </Document>
	    </kml>`;

	  return kml;
	}

	const updateProjectSitesFunc = async(kml,siteData,router,currentProject,setCurrentProject) => {
		const sites = {
			...currentProject?.siteData
		}
		sites[kml] = siteData;
		const {data} = await axios.post(`${updateProjectSites}?industry=${currentProject?.industry}`,{
			id:currentProject?._id,
			kmlkmzFiles:[kml,...currentProject?.kmlkmzFiles],
			siteData:sites
		})
		if(data?.status){
			setCurrentProject(data?.project);
			router.back();
			setUploading(false)
		}
	}

	const uploadImage = (url,setUploading,mapLayers,router,currentProject,setCurrentProject) => {
		setUploading(true);
		imagekit.upload({
	    file : url, //required
	    folder:"KML",
	    fileName : `site`,
		}).then(response => {
			updateProjectSitesFunc(response.url,mapLayers,router,currentProject,setCurrentProject);
		}).catch(error => {
			console.log(error);
			setUploading(false)
		});
	}

	function convertAndSave(mapLayers,setUploading,router,currentProject,setCurrentProject){
		const kmlData = markersToKML(mapLayers);
		const base64KML = btoa(unescape(encodeURIComponent(kmlData)));
		uploadImage(base64KML,setUploading,mapLayers,router,currentProject,setCurrentProject)
	}

	convertAndSave(mapLayers,setUploading,router,currentProject,setCurrentProject)
}

export default function GeoServerTiffViewer({store,mapBasedDeliverables,selectedDate,project,setProject}) {
	const mapRef = useRef(null);
	const [mapLayers,setMapLayers] = useState([]);
	const [savedMapLayers,setSavedMapLayers] = useState([]);
	const [data,setData] = useState('')
	const [deleteLayersId,setDeleteLayersId] = useState([]);
	const [openAnnotationDetailsEnterTab,setOpenAnnotationDetailsEnterTab] = useState(false);
	const [issueName,setIssueName] = useState('');
	const [issueType,setIssueType] = useState('');
	const [issueRemarks,setIssueRemarks] = useState('');
	const [showIssueDetails,setShowIssueDetails] = useState('');
	const [currentOpenIssueIndex,setCurrentOpenIssueIndex] = useState(-1);
	const drawControlRef = useRef(null);
	const featureGroupRef = useRef(null);
	const savedfeatureGroupRef = useRef(null);
	const [deleting,setDeleting] = useState(false);
	const [openSidebar,setOpenSidebar] = useState(true);
	
	const clearAllAnnotations = () => {
    if (featureGroupRef.current) {
    	featureGroupRef.current.clearLayers();
    }
  };

  useEffect(()=>{
  	if(savedfeatureGroupRef.current){
	  	savedfeatureGroupRef.current.on('click',function(e) {
			  console.log('clicked on polygon');
			  L.DomEvent.stopPropagation(e);
			});	
  	}
  },[savedfeatureGroupRef.current])

	const MapEvents = () => {
    const map = useMapEvents({
      overlayadd: (event) => {
      	if(event?.layer?.options?.layers){
	      	let url = event.layer.options.layers.split(":");
	      	url.shift();
	      	const selectedStore = url.join(':'); 
	        getBoundingBox2(selectedStore)      		
      	}
      },
    });
    return null;
  };

	const getBoundingBox = async() => {
			if(!store) return null
	    const url = `http://localhost:8080/geoserver/rest/workspaces/a2a/coveragestores/${store}/coverages/${store}.json`;

	    try {
	        const response = await fetch(url, {
	            headers: {
	                'Authorization': 'Basic ' + btoa('admin:geoserver'),
	            }
	        });

	        if (response.ok) {
	            const data = await response.json();
	            const bbox = data.coverage.latLonBoundingBox;
	            if (bbox) {
		            const extent = [
		                bbox.minx,
		                bbox.miny,
		                bbox.maxx,
		                bbox.maxy,
		            ].map(coord => parseFloat(coord));
		            console.log(extent)

								mapRef.current.flyTo([extent[1],extent[0]]);
								// mapRef.current.setZoom(16);

		            // const transformedExtent = transformExtent(extent, 'EPSG:4326', 'EPSG:3857');

		            // map.getView().fit(transformedExtent, {
		            //     size: map.getSize(),
		            //     maxZoom: 18,
		            // });
		        }
	        } else {
	            console.error('Failed to retrieve bounding box:', response.statusText);
	            return null;
	        }
	    } catch (error) {
	        console.error('Error fetching bounding box:', error);
	        return null;
	    }
	};

	const getBoundingBox2 = async(selectedStore) => {
			if(!selectedStore) return null
	    const url = `http://localhost:8080/geoserver/rest/workspaces/a2a/coveragestores/${selectedStore}/coverages/${selectedStore}.json`;

	    try {
	        const response = await fetch(url, {
	            headers: {
	                'Authorization': 'Basic ' + btoa('admin:geoserver'),
	            }
	        });

	        if (response.ok) {
	            const data = await response.json();
	            const bbox = data.coverage.latLonBoundingBox;
	            if (bbox) {
		            const extent = [
		                bbox.minx,
		                bbox.miny,
		                bbox.maxx,
		                bbox.maxy,
		            ].map(coord => parseFloat(coord));

								mapRef.current.flyTo([extent[1],extent[0]]);
								// mapRef.current.setZoom(16);

		            // const transformedExtent = transformExtent(extent, 'EPSG:4326', 'EPSG:3857');

		            // map.getView().fit(transformedExtent, {
		            //     size: map.getSize(),
		            //     maxZoom: 18,
		            // });
		        }
	        } else {
	            console.error('Failed to retrieve bounding box:', response.statusText);
	            return null;
	        }
	    } catch (error) {
	        console.error('Error fetching bounding box:', error);
	        return null;
	    }
	};

  useEffect(()=>{
    // const layers = [
    //   new Tile({
    //     source: new OSM(),
    //   }),
    //   new Tile({
    //     source: new TileWMS({
    //       attribution:"@geoserver",
    //       url: 'http://localhost:8080/geoserver/a2a/wms',
    //       params: {
    //         'LAYERS':`a2a:${store}`
    //       },
    //     }),
    //   }),
    // ];
    // map = new Map({
    //   layers: layers,
    //   target: 'map',
    //   view: new View({
    //   	projection: 'EPSG:3857',
    //     center: [-10997148, 4569099],
    //     zoom: 5,
    //   }),
    // });

    if(store){
    	getBoundingBox();
    }


    // return () => map.setTarget(null);
  },[store])

  const handleLayerClick = (layerType, layer) => {
    console.log(`${layerType} clicked`);
    if (layerType === 'Circle' || layerType === 'Polygon') {
      console.log('Bounds:', layer.getBounds());
    }
  };
        
   const onCreate = (e) => {
		console.log(e);
		const {layerType,layer} = e;
		if(layerType === 'polygon'){
			const {_leaflet_id} = layer;

			setMapLayers(layers=>[...layers,{
				id:_leaflet_id,
				type:layerType,
				latlngs:layer.getLatLngs()[0],
				geoJson:layer?.toGeoJSON(),
				area:L.GeometryUtil.geodesicArea(layer.getLatLngs()[0]),
				squareKm:(L.GeometryUtil.geodesicArea(layer.getLatLngs()[0]))/1000000
			}])
		}else if(layerType === 'polyline'){
			const {_leaflet_id} = layer;

			setMapLayers(layers=>[...layers,{
				id:_leaflet_id,
				type:layerType,
				latlngs:layer.getLatLngs(),
				geoJson:layer?.toGeoJSON(),
				km:(L.GeometryUtil.length(layer)) / 1000
			}])
		}else if(layerType === 'rectangle'){
			const {_leaflet_id} = layer;

			setMapLayers(layers=>[...layers,{
				id:_leaflet_id,
				type:layerType,
				bounds:layer.getBounds(),
				latlngs:layer.getLatLngs()[0],
				geoJson:layer?.toGeoJSON(),
				area:L.GeometryUtil.geodesicArea(layer.getLatLngs()[0]),
				squareKm:(L.GeometryUtil.geodesicArea(layer.getLatLngs()[0]))/1000000
			}])
		}else if(layerType === 'circlemarker' || layerType === 'circle'){
			const {_leaflet_id} = layer;

			setMapLayers(layers=>[...layers,{
				id:_leaflet_id,
				type:layerType,
				radius:layer?.getRadius(),
				latlng:layer.getLatLng(),
				geoJson:layer?.toGeoJSON()
			}])
		}else if(layerType === 'marker'){
			const {_leaflet_id} = layer;
			setMapLayers(layers=>[...layers,{
				id:_leaflet_id,
				type:layerType,
				latlng:layer.getLatLng(),
				geoJson:layer?.toGeoJSON()				
			}])
		}
		setOpenAnnotationDetailsEnterTab(true);
	}

	const saveTheAnnotationDetails = () => {
		if(issueName && issueType && issueRemarks){
			let mapLayersTemp = [...mapLayers];
			let lastAnnotation = mapLayersTemp[mapLayers.length - 1];
			const editedAnnotation = {
				...lastAnnotation,
				issueName,issueType,issueRemarks
			}
			mapLayersTemp.splice(mapLayers.length - 1, 1, editedAnnotation);
			setMapLayers(mapLayersTemp);
			setOpenAnnotationDetailsEnterTab(false);
		}
	}

	const onEdit = (e) => {
		console.log(e)
	};

	console.log(savedMapLayers)

	const deleteLayers = (removedLayersId) => {
		let mapLayersTemp = [...mapLayers];
		for (let i = 0; i < removedLayersId?.length; i++){
			const idx = mapLayersTemp?.findIndex((map)=>{
				if(Number(map.id) === Number(removedLayersId[i])) return true
				return false
			})
			if(idx > -1){
				mapLayersTemp?.splice(idx,1);
			}
			if(i+1 >= removedLayersId?.length){
				setMapLayers(mapLayersTemp);
				setDeleteLayersId([])
			}
		}
	}

	useEffect(()=>{
		if(deleteLayersId?.length > 0) deleteLayers(deleteLayersId);
	},[deleteLayersId])

	const onDelete = (e,mapLayersdum) => {
		const {layerType,layers} = e;
		const removedLayersId = Object.keys(layers._layers);
		setDeleteLayersId(removedLayersId);
	}

	useEffect(()=>{
		if(mapLayers?.length > 0){
			mapLayersVar = [...mapLayers];
		}
	},[mapLayers])

	const saveMapLayers = async() => {
		let OldMapLayers = [...project?.mapLayers,...mapLayers]; 
		const {data} = await axios.post(`${updateMapLayersInProject}?industry=${project?.industry}`,{
			mapLayers:OldMapLayers,
			id:project?._id
		});
		if(data?.status){
			setProject(data?.project);
			setMapLayers([]);
			setSavedMapLayers(data?.project?.mapLayers);
			clearAllAnnotations()
		}
	};

	const deleteSavedLayer = async() => {
		let savedLayers = [...savedMapLayers];
		if(currentOpenIssueIndex > -1){
			savedLayers?.splice(currentOpenIssueIndex,1);
			const {data} = await axios.post(`${updateMapLayersInProject}?industry=${project?.industry}`,{
				mapLayers:savedLayers,
				id:project?._id
			});
			if(data?.status){
				setProject(data?.project);
				setSavedMapLayers(data?.project?.mapLayers);
				setShowIssueDetails('');
				setCurrentOpenIssueIndex(-1);
				setDeleting(false);
			}
		}
	}

	const handleFeatureClick = (shape,k) => {
    console.log('Clicked feature details:', shape);
    // You can pass `shape` to another function here if needed
  };

	useEffect(()=>{
		if(project?.mapLayers){
			setSavedMapLayers(project?.mapLayers);
		}
	},[project])

return (
  <div className="h-full w-full flex z-0 relative">
  	
  		<div className={`absolute ${openSidebar	? '-top-[100%]' : savedMapLayers?.length > 0 && 'top-2'} 
  		left-0 right-0 mx-auto flex items-center transition-all duration-200 ease-in-out justify-center`}>
	  		<button onClick={()=>{setOpenSidebar(true)}} 
	  		className="rounded-xl border-[1px] bg-blue-600/30 hover:bg-blue-500 
	  		z-50 cursor-pointer border-gray-300 px-4 py-2 transition-all duration-200 ease-in-out">
	  			<p className="text-white text-xs">Open Issues Tab</p>
	  		</button>
  		</div>
  	
 	{/*{
 	 		store &&
 		      <div id="map" style={{
 		        height:'100%',
 		        width:"100%"
 		      }} className="map"></div>
 	 	}*/}
  	
 		{/*<div className="w-full flex items-center gap-2">
 					<div 
 					onClick={()=>downloadKml(mapLayers,setData)}
 					className="flex justify-center mt-2 w-full">
 						<button className={`w-full py-2 flex justify-center items-center gap-1 rounded-lg bg-gray-900 border-[1px] border-gray-700 
 						text-gray-200 text-sm transition-all duration-200 ease-in-out
 						${mapLayers?.length > 0 ? 'hover:border-sky-500 opacity-[100%] hover:text-sky-500' : 'opacity-[50%] cursor-default'}
 						`}>
 							 Export
 						</button>
 					</div>
 					<div 
 					onClick={()=>save(mapLayers,setUploading,router,currentProject,setCurrentProject)}
 					className="flex justify-center mt-2 w-full">
 						<button className={`w-full py-2 flex justify-center items-center gap-1 rounded-lg bg-gray-900 border-[1px] border-gray-700 
 						text-gray-200 text-sm transition-all duration-200 ease-in-out
 						${mapLayers?.length > 0 ? 'hover:border-sky-500 opacity-[100%] hover:text-sky-500' : 'opacity-[50%] cursor-default'}
 						`}>
 							<AiOutlineSave className="h-4 w-4"/> Save Site
 						</button>
 					</div>
 				</div>*/}
 		<div className={` ${savedMapLayers?.length > 0 && openSidebar ? 'w-[75%]' : 'w-[100%]'} h-full transition-all duration-200 ease-in-out z-10 overflow-hidden relative`}>
 			{
  		savedMapLayers?.length > 0 &&
		 		<div className="absolute top-[90px] 
		 		left-3 z-50  ">
		 			
		 			<div className="flex" >
		 			<div 
 					onClick={()=>downloadKml([...savedMapLayers,...mapLayers],setData)}
		 			className="p-2 group bg-white border-b-[1px] border-[1px] border-gray-400  cursor-pointer flex gap-2 border-b-gray-400 hover:bg-gray-100">
		 				<RxDownload className="h-[17px] w-[17px]"/>
		 				<p className="text-xs hidden group-hover:block text-gray-700">KML</p>
		 			</div>
		 			</div>
		 			{
		 				mapLayers?.length > 0 &&
			 			<div className="flex">
			 			<div onClick={()=>saveMapLayers()} 
			 			className="p-2 group bg-white border-[1px] border-gray-400  cursor-pointer flex gap-2 hover:bg-gray-100">
			 				<AiOutlineSave className="h-[17px] w-[17px]"/>
		 					<p className="text-xs hidden group-hover:block 
		 					text-gray-700">Save to project</p>
			 			</div>
			 			</div>
		 			}
		 		</div>
	  	}
	  	{
	  		showIssueDetails &&
	  		<div className="absolute z-50 h-full w-full bg-black/40 p-2 flex items-center justify-center top-0 left-0">
	  			<div className="flex flex-col rounded-lg w-[350px] max-h-[90%] bg-white overflow-y-auto">
	  				<div className="bg-black px-4 py-2 border-b-[1px] border-gray-300 
	  				shadow-md shadow-gray-400 flex items-center gap-4 justify-between">
	  					<h1 className="text-lg font-semibold text-gray-200">Issue details</h1>
	  					<div onClick={()=>{
		  					setShowIssueDetails('');
		  					setCurrentOpenIssueIndex(-1);
		  				}} className="p-1 rounded-full hover:bg-gray-800/60 cursor-pointer">
	  						<RxCross2 className="h-5 w-5 text-gray-200"/>
	  					</div>
	  				</div>
	  				<div className="flex flex-col gap-3 p-3">
	  					<div className="flex flex-col gap-1">
		  					<p className="text-sm font-semibold text-gray-800">Issue Name</p>
		  					<div className="p-1 rounded-lg border-[1px] border-gray-300 w-full bg-gray-100">
		  						<input type="text" placeholder="Enter issue name" value={showIssueDetails?.issueName}
		  						disabled
		  						className="bg-transparent outline-none text-black w-full"
		  						/>
		  					</div>
	  					</div>
	  					<div className="flex flex-col gap-1">
		  					<p className="text-sm font-semibold text-gray-800">Issue Type</p>
		  					<div className="p-1 rounded-lg border-[1px] border-gray-300 w-full bg-gray-100">
		  						<input type="text" placeholder="Enter issue type"  value={showIssueDetails?.issueType}
		  						disabled
		  						className="bg-transparent outline-none text-black w-full"
		  						/>
		  					</div>
		  				</div>
	  					<div className="flex flex-col gap-1">
		  					<p className="text-sm font-semibold text-gray-800">Remarks</p>
		  					<div className="p-1 rounded-lg border-[1px] border-gray-300 w-full bg-gray-100">
		  						<textarea placeholder="Enter remarks"  value={showIssueDetails?.issueRemarks}
		  						disabled
		  						className="bg-transparent outline-none h-[60px] resize-none text-black w-full"
		  						/>
		  					</div>
		  				</div>
		  				<div className="flex gap-3 w-full">
			  				<button onClick={()=>{
			  					if(!deleting){
				  					setDeleting(true);
				  					deleteSavedLayer()
			  					}
			  				}} className="text-gray-100 bg-red-500 hover:bg-red-600 rounded-lg w-full px-4 py-1 mx-auto">
			  					Delete
			  				</button>
			  				<button onClick={()=>{
			  					setShowIssueDetails('');
			  					setCurrentOpenIssueIndex(-1);
			  				}} className="text-gray-100 bg-blue-600 hover:bg-blue-500 rounded-lg w-full px-4 py-1 mx-auto">
			  					Close
			  				</button>
		  				</div>

	  				</div>

	  			</div>
	  		</div>
	  	}
	  	{
	  		openAnnotationDetailsEnterTab &&
	  		<div className="absolute z-50 h-full w-full bg-black/40 p-2 flex items-center justify-center top-0 left-0">
	  			<div className="flex flex-col rounded-lg w-[350px] max-h-[90%] bg-white overflow-y-auto">
	  				<div className="bg-black px-4 py-2 border-b-[1px] border-gray-300 shadow-md shadow-gray-400">
	  					<h1 className="text-lg font-semibold text-gray-200">Enter the issue details</h1>
	  				</div>
	  				<div className="flex flex-col gap-3 p-3">
	  					<div className="flex flex-col gap-1">
		  					<p className="text-sm font-semibold text-gray-800">Issue Name</p>
		  					<div className="p-1 rounded-lg border-[1px] border-gray-300 w-full bg-gray-100">
		  						<input type="text" placeholder="Enter issue name" value={issueName}
		  						onChange={(e)=>setIssueName(e.target.value)}
		  						className="bg-transparent outline-none text-black w-full"
		  						/>
		  					</div>
	  					</div>
	  					<div className="flex flex-col gap-1">
		  					<p className="text-sm font-semibold text-gray-800">Issue Type</p>
		  					<div className="p-1 rounded-lg border-[1px] border-gray-300 w-full bg-gray-100">
		  						<input type="text" placeholder="Enter issue type"  value={issueType}
		  						onChange={(e)=>setIssueType(e.target.value)}
		  						className="bg-transparent outline-none text-black w-full"
		  						/>
		  					</div>
		  				</div>
	  					<div className="flex flex-col gap-1">
		  					<p className="text-sm font-semibold text-gray-800">Remarks</p>
		  					<div className="p-1 rounded-lg border-[1px] border-gray-300 w-full bg-gray-100">
		  						<textarea placeholder="Enter remarks"  value={issueRemarks}
		  						onChange={(e)=>setIssueRemarks(e.target.value)}
		  						className="bg-transparent outline-none h-[60px] resize-none text-black w-full"
		  						/>
		  					</div>
		  				</div>
		  				<button onClick={saveTheAnnotationDetails} className="text-gray-100 bg-black rounded-lg w-full px-4 py-1 mx-auto">
		  					Save
		  				</button>

	  				</div>

	  			</div>
	  		</div>
	  	}
			<MapContainer center={[12.977496613847645,79.85122475069794]} zoom={15} ref={mapRef} className="h-full z-10 w-full" maxZoom={30} >
			 	<MapEvents />

			 	<FeatureGroup ref={featureGroupRef}>
					<EditControl position="topright"
					ref={drawControlRef}
					onCreated={onCreate} onDeleted={(e)=>{onDelete(e,mapLayers)}}
					onEdited={onEdit} draw={{
						circle:false,
						polygon:{
							showLength:true,
							nautic:true,
							drawError: {
                  color: '#e1e100', // Color the shape will turn when intersects
                  message: '<strong>Error!<strong> you can\'t draw that!' // Message that will show when intersect
              },
						}
					}}
					/>
					
				</FeatureGroup>
				
				<FeatureGroup ref={savedfeatureGroupRef} >
					
					{mapLayers?.map((shape) => (
            <div key={shape?.id}>
              {shape.type === 'rectangle' || shape.type === 'polygon' || shape.type === 'polyline' ? (
					      <SVGOverlay attributes={{ stroke: 'transparent' }} bounds={shape?.latlngs}>
					        <text
					          x="50%"
					          y="50%"
					          stroke="black"
					          fill="black"
					          fontSize="16"
					          fontWeight="normal"
					          alignmentBaseline="middle"
					          textAnchor="middle"
					        >
					          {shape?.issueName}
					        </text>
					      </SVGOverlay>
					    ) : shape.type === 'circlemarker' || shape.type === 'marker' ? (
					      <SVGOverlay attributes={{ stroke: 'transparent' }} bounds={[Object.values(shape?.latlng)]}>
					        <text
					          x="50%"
					          y="50%"
					          stroke="black"
					          fill="black"
					          fontSize="16"
					          fontWeight="normal"
					          alignmentBaseline="middle"
					          textAnchor="middle"
					        >
					          {shape?.issueName}
					        </text>
					      </SVGOverlay>
					    ) : null}
            </div>
          ))}
				</FeatureGroup>

				{
					savedMapLayers?.length > 0 &&
					<LayersControl>
							{
								savedMapLayers?.map((shape,k)=>{
									if (shape.type === 'polygon') {
				            return (
										<LayersControl.Overlay key={k} checked name={shape?.issueName}>
				              <Polygon
				              	eventHandlers={{
											    click: (e) => {
											    	setShowIssueDetails(shape);
											    	setCurrentOpenIssueIndex(k);
											    },
											  }}
				                key={shape.id}
				                positions={shape.latlngs.map(latlng => [latlng.lat, latlng.lng])}
				                color="blue"
				                onClick={()=>{console.log(shape)}}
				              >
				                <Tooltip>{shape.issueName}</Tooltip>
				              </Polygon>
										</LayersControl.Overlay>
				            );
				          } else if (shape.type === 'polyline') {
				            // Assuming you have a Polyline component defined
				            return (
										<LayersControl.Overlay key={k} checked name={shape?.issueName}>
				            	<LayerGroup>

					              <Polyline
					              	eventHandlers={{
												    click: (e) => {
												    	setShowIssueDetails(shape);
												    	setCurrentOpenIssueIndex(k);
												    },
												  }}
					                key={shape.id}
					                positions={shape.latlngs.map(latlng => [latlng.lat, latlng.lng])}
				                	onClick={()=>{handleFeatureClick(shape,k)}}
					                color="red"
					              />
					              <SVGOverlay attributes={{ stroke: 'transparent' }} bounds={shape?.latlngs}>
									        <text
									          x="50%"
									          y="50%"
									          stroke="black"
									          fill="black"
									          fontSize="13"
									          fontWeight="normal"
									          alignmentBaseline="middle"
									          textAnchor="middle"
									        >
									          {shape?.issueName}
									        </text>
									      </SVGOverlay>

				            	</LayerGroup>
										</LayersControl.Overlay>
				            );
				          } else if (shape.type === 'rectangle') {
				            return (
										<LayersControl.Overlay key={k} checked name={shape?.issueName}>
				              <Rectangle
				              	eventHandlers={{
											    click: (e) => {
											    	setShowIssueDetails(shape);
											    	setCurrentOpenIssueIndex(k);
											    },
											  }}
				                key={shape.id}
				                bounds={[
				                  [shape.bounds._southWest.lat, shape.bounds._southWest.lng],
				                  [shape.bounds._northEast.lat, shape.bounds._northEast.lng]
				                ]}
				                onClick={()=>{handleFeatureClick(shape,k)}}
				                color="green"
				              >
				                <Tooltip>{shape.issueName}</Tooltip>
				              </Rectangle>
										</LayersControl.Overlay>
				            );
				          } else if (shape.type === 'marker') {
				            return (
										<LayersControl.Overlay key={k} checked name={shape?.issueName}>
				              <Marker
				              	eventHandlers={{
											    click: (e) => {
											    	setShowIssueDetails(shape);
											    	setCurrentOpenIssueIndex(k);
											    },
											  }}
				                key={shape.id}
				                position={[shape.latlng.lat, shape.latlng.lng]}
				                onClick={()=>{handleFeatureClick(shape,k)}}
				              >
				                <Tooltip>{shape.issueName}</Tooltip>
				              </Marker>
										</LayersControl.Overlay>
				            );
				          } else if (shape.type === 'circlemarker') {
				            return (
										<LayersControl.Overlay key={k} checked name={shape?.issueName}>
				              <CircleMarker
				              	eventHandlers={{
											    click: (e) => {
											    	setShowIssueDetails(shape);
											    	setCurrentOpenIssueIndex(k);
											    },
											  }}
				                key={shape.id}
				                center={[shape.latlng.lat, shape.latlng.lng]}
				                radius={shape.radius}
				                color="purple"
				                onClick={()=>{handleFeatureClick(shape,k)}}
				              >
				                <Tooltip>{shape.issueName}</Tooltip>
				              </CircleMarker>
										</LayersControl.Overlay>
				            );
				          } 
								})
							}
					</LayersControl>
				}

				<LayersControl position="bottomleft">
				    <LayersControl.Overlay checked name="Vector Map">
				        <TileLayer
					        url={`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`}
					        attribution='Map data &copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors, <a href=&quot;https://creativecommons.org/licenses/by-sa/2.0/&quot;>CC-BY-SA</a>, Imagery &copy; <a href=&quot;https://www.mapbox.com/&quot;>Mapbox</a>'
					        maxZoom={20}
					    />
				    </LayersControl.Overlay>

				    <LayersControl.Overlay name="Mapbox Map">
				        <TileLayer
					        url={`https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}@2x.jpg90?access_token=pk.eyJ1IjoidGhlamFzaGFyaSIsImEiOiJjbGViNGxneGIxNXk4M3FtZXN2bmlybnZ2In0.xH_17wx1jpV5Kfw7ntyAbQ`}
					        attribution='Map data &copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a>&copy; <a href=&quot;https://www.mapbox.com/&quot;>Mapbox</a>'
					        maxZoom={20}
					     	
					      />
				    </LayersControl.Overlay>

				    <LayersControl.Overlay name="Satellite Map">
				        <TileLayer
					        url={`https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}.png`}
					        attribution='&copy; <a href="Esri &mdash">GIS User Community</a> contributors'
					        maxZoom={20}
					    />
				    </LayersControl.Overlay>

				   

				    {
				    	mapBasedDeliverables?.map((deliverable,k)=>{
				    		if(deliverable?.date === selectedDate) 
				    			return (
					    		<LayersControl.Overlay name={`${deliverable?.store?.split("-")[1]}`} key={k}>
								    <WMSTileLayer
								    	
			                url="http://localhost:8080/geoserver/a2a/wms"
			                params={{
			                   format:"image/png",
			                   layers:`a2a:${deliverable?.store}`,
			                   transparent: true,
			                 }}
			                 maxZoom={30}
				            />
						      </LayersControl.Overlay>
					    		)
					    	})
				    }

				    {
				    	store &&
					    <LayersControl.Overlay checked name={`${store?.split("-")[1]}`} key='2'>
						    <WMSTileLayer
						    	
	                url="http://localhost:8080/geoserver/a2a/wms"
	                params={{
	                   format:"image/png",
	                   layers:`a2a:${store}`,
	                   transparent: true,
	                 }}
	                 maxZoom={30}
		            />
				      </LayersControl.Overlay>
				    }

			    </LayersControl>

			</MapContainer>
		</div>
 		<div className={` ${savedMapLayers?.length > 0 && openSidebar ? 'w-[25%] overflow-y-auto   scrollbar scrollbar-thin px-2 py-3' : 'w-[0%] px-0 py-0 overflow-hidden'} 
 		h-full transition-all duration-200 ease-in-out relative   
 		flex flex-col bg-black`}>
		
			<div className="flex items-center gap-2 pb-2">
				<div onClick={()=>{setOpenSidebar(false)}} className="hover:bg-gray-800/70 cursor-pointer p-1 rounded-full">
					<FaArrowRight className="h-4 w-4 text-white cursor-pointer" />
				</div>
				<h1 className="text-md font-semibold text-gray-200 ">Marked Issues</h1>
			</div>
			<div className={`flex flex-col gap-3 ${mapLayers?.length > 0 ? 'py-3' : 'p-0'}`}>
				{
					savedMapLayers?.map((mapLayer,k)=>(
						<SavedMapLayerCard mapLayer={mapLayer} k={k} key={k} 
						TfiLocationPin={TfiLocationPin} setShowIssueDetails={setShowIssueDetails}
						setCurrentOpenIssueIndex={setCurrentOpenIssueIndex}
						/>
					))
				}

			</div>
			<div className="w-full flex flex-col mt-2 items-center gap-1">
				<div 
				onClick={()=>downloadKml([...savedMapLayers,...mapLayers],setData)}
				className="flex justify-center mt-2 w-full">
					<button className={`w-full py-2 flex justify-center items-center gap-1 rounded-lg bg-gray-900 border-[1px] border-gray-700 
					text-gray-200 text-sm transition-all duration-200 ease-in-out
					${savedMapLayers?.length > 0 ? 'hover:border-sky-500 opacity-[100%] hover:text-sky-500' : 'opacity-[50%] cursor-default'}
					`}>
						<RxDownload className="h-4 w-4"/> Export KML
					</button>
				</div>
				<div 
				className="flex justify-center mt-2 w-full">
					<button className={`w-full py-2 flex justify-center items-center gap-1 rounded-lg bg-gray-900 border-[1px] border-gray-700 
					text-gray-200 text-sm transition-all duration-200 ease-in-out
					${savedMapLayers?.length > 0 ? 'hover:border-sky-500 opacity-[100%] hover:text-sky-500' : 'opacity-[50%] cursor-default'}
					`}>
						<AiOutlineSave className="h-4 w-4"/> Generate Report
					</button>
				</div>
			</div>
		</div>

  </div>
        

)
} 