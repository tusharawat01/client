"use client"
import 'leaflet-geodesy';
import {RiSearch2Line} from 'react-icons/ri';
import {AiOutlinePlusCircle} from 'react-icons/ai';
import {MdPerson} from 'react-icons/md';
import {useState,useEffect,useRef} from 'react';
import {useRouter} from 'next/navigation';
import L from "leaflet";
import { transformExtent } from 'ol/proj';

// import 'leaflet-measure'; 
// import 'leaflet-measure/dist/leaflet-measure.css';
// import "leaflet/dist/leaflet-src.js";
// import "leaflet-qgsmeasure/dist/leaflet.qgsmeasure.css"
// import "leaflet-qgsmeasure"
// import "leaflet-draw/dist/leaflet.draw-src.js"
// import "leaflet-draw/dist/leaflet.draw-src.css"
import ImageKit from 'imagekit';
import {MapContainer,TileLayer, FeatureGroup, Marker, Popup, 
	LayersControl} from 'react-leaflet';
import { WMSTileLayer } from 'react-leaflet/WMSTileLayer'
import "leaflet/dist/leaflet.css";
import { EditControl } from 'react-leaflet-draw'
import "leaflet-draw/dist/leaflet.draw.css";
import {RxDownload} from 'react-icons/rx';
import {TfiLocationPin} from 'react-icons/tfi';
import 'leaflet-geometryutil';
import {AiOutlineSave} from 'react-icons/ai';
import {useRecoilState} from 'recoil'
import {currentUserState,currentProjectState} from '../../../../../atoms/userAtom'
import axios from 'axios';
import {updateProjectSites} from '../../../../../utils/ApiRoutes';

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
	  console.log(kmlData)
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

export default function Home({params}) {
	const [searchValue,setSearchValue] = useState('');
	const [center,setCenter] = useState({lat:24.121,lng:54.121})
	const router = useRouter();
	const mapRef = useRef();
	const [mapLayers,setMapLayers] = useState([]);
	const [data,setData] = useState('');
	const [uploading,setUploading] = useState(false);
	const [currentProject,setCurrentProject] = useRecoilState(currentProjectState);

	const imagekit = new ImageKit({
	    publicKey : process.env.NEXT_PUBLIC_IMAGEKIT_ID,
	    privateKey : process.env.NEXT_PUBLIC_IMAGEKIT_PRIVATE,
	    urlEndpoint : process.env.NEXT_PUBLIC_IMAGEKIT_ENDPOINT
	});

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
	}

	const onEdit = (e) => {
		console.log(e)
	}

	const onDelete = (e) => {
		console.log(e)
	}

	const getBoundingBox = async() => {
			const store = '66770bee963361016bf4896f-Digital Terrain Model.tif';
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
		            
								mapRef.current.flyTo([extent[1],extent[0]]);
								mapRef.current.setZoom(16);

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

	const recenterMap = (e) => {

		// mapRef.current.flyTo([e.coords.y,e.coords.x]);
		getBoundingBox()
	}

	return(
		<main className="h-full w-full overflow-y-auto scrollbar scrollbar-thin scrollbar-thumb-blue-500 
		scrollbar-track-gray-800">

			<div className="w-full h-full flex items-center gap-2">
				<div className="lg:w-[25%] md:w-[35%] h-full py-3 relative bg-[#292929] px-2 bg-gray-800 flex flex-col overflow-y-auto scrollbar scrollbar-thin">
					<div className={`top-0 left-0 z-50 bg-black/60 flex items-center justify-center ${uploading ? 'absolute' : 'hidden'} 
					h-full w-full`}>
						<span className="loader1"/>
					</div>
					<div className="px-2 border-b-[1px] w-full py-2 border-gray-600">
						<img src="https://aero2astro.com/home/assets/logos/logo_white.png" alt=""
						className="w-[100px]"/>
					</div>
					<h1 className="text-lg px-2 pt-2 font-semibold text-gray-100">Manual</h1>
					<div className={`flex flex-col gap-5 ${mapLayers?.length > 0 ? 'py-3' : 'p-0'}`}>
						{
							mapLayers?.map((mapLayer,k)=>(
								<div key={k} className="w-full p-2 rounded-lg border-[1px] border-gray-700 hover:bg-gray-900
								transition-all duration-200 ease-in-out hover:border-sky-600 flex flex-col">
									<div className="px-2 pb-1 border-b-[1px] border-gray-700">
										<h1 className="text-md font-semibold text-gray-100">{mapLayer?.type}</h1>
									</div>
									<div className="flex py-2 flex-col gap-2">
										{
											['polygon','polyline','rectangle'].includes(mapLayer?.type) &&
											<div className="text-md flex flex-col gap-2 border-b-[1px] border-gray-700 pb-2">
												{
													mapLayer?.squareKm &&
													<p className="text-sm text-gray-200 px-2">
														<span className="truncate">{mapLayer?.squareKm?.toFixed(5)}</span> Sq.km
													</p>
												}
												{
													mapLayer?.area &&
													<p className="text-sm text-gray-200 px-2">
														<span className="truncate">{mapLayer?.area?.toFixed(5)}</span> Sq.meters
													</p>
												}
												{
													mapLayer?.km &&
													<p className="text-sm text-gray-200 px-2">
														{mapLayer?.km?.toFixed(5)} KM
													</p>
												}
											</div>
										}
										{
											mapLayer?.latlngs ? 
											mapLayer?.latlngs?.map((latlng,j)=>(
												<p key={j} className="text-xs text-gray-300 flex items-center gap-1 break-word">
													<TfiLocationPin className="h-6 w-6"/> Lat:-{latlng?.lat} Lng:-{latlng?.lng}
												</p>
											))
											:
											<p className="text-xs text-gray-300 flex items-center gap-1 break-word">
												<TfiLocationPin className="h-6 w-6"/> Lat:-{mapLayer.latlng?.lat} Lng:-{mapLayer.latlng?.lng}
											</p>

										}

									</div>

								</div>
							))
						}

					</div>
					<div className="w-full flex items-center gap-2">
						<div 
						onClick={()=>downloadKml(mapLayers,setData)}
						className="flex justify-center mt-2 w-full">
							<button className={`w-full py-2 flex justify-center items-center gap-1 rounded-lg bg-gray-900 border-[1px] border-gray-700 
							text-gray-200 text-sm transition-all duration-200 ease-in-out
							${mapLayers?.length > 0 ? 'hover:border-sky-500 opacity-[100%] hover:text-sky-500' : 'opacity-[50%] cursor-default'}
							`}>
								<RxDownload className="h-4 w-4"/> Export
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
					</div>
				</div>
				<div className="w-full h-screen overflow-hidden">
					<MapContainer center={[12.977496613847645,79.85122475069794]} zoom={15} ref={mapRef} className="h-full w-full" maxZoom={30} >
						
						<FeatureGroup>
							<EditControl position="topright"
							onCreated={onCreate} onDeleted={onDelete}
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

						    <LayersControl.Overlay name="Digital Terrain" key='2'>
							    <WMSTileLayer
							    	eventHandlers={{
				              tileload: recenterMap,
				            }}
							    	onAdd={() => {
							    		console.log("ran")
							    		recenterMap()
				            }}
	                  url="http://localhost:8080/geoserver/a2a/wms"
	                  params={{
	                     format:"image/png",
	                     layers:"a2a:66770bee963361016bf4896f-Digital Terrain Model.tif",
	                     transparent: true,
	                   }}
	                   maxZoom={30}
			            />
					        </LayersControl.Overlay>
					    </LayersControl>

					</MapContainer>
				</div>
			</div>

		</main>
	)
}