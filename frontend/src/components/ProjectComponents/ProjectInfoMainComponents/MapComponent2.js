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

export default function MapComponent2({
	showMap,setShowMap,loadedFiles,showMarkers,setShowMarkers
}) {
	const [center, setCenter] = useState({
	    lat: loadedFiles[0]?.exif_data?.latitude || 0,
	    lng: loadedFiles[0]?.exif_data?.longitude || 0,
	  });
	const mapRef = useRef();

	function markersToKML(markers) {
	  const kml = `<?xml version="1.0" encoding="UTF-8"?>
		<kml xmlns="http://www.opengis.net/kml/2.2">
		  <Document>
		    ${markers
		      .map(
		        (marker, index) => `
		      <Placemark>
		        <name>${marker.name ? marker.name : '--'}</name>
		        <Point>
		          <coordinates>${marker?.exif_data.longitude},${marker?.exif_data.latitude}</coordinates>
		        </Point>
		        <description><![CDATA[
		          <img src="${marker.url}" width="100px" height="100px" alt="Cant load image" />
		          <br />
		          ${marker?.name ? marker?.name : '--'}
		        ]]></description>
		      </Placemark>
		    `
		      )
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

	function exportMarkersAsKML() {
	  const kmlData = markersToKML(loadedFiles);
	  downloadKML(kmlData, 'markers.kml');
	}


	useEffect(()=>{
		if(loadedFiles?.length > 0){
			const newLat = loadedFiles[0]?.exif_data?.latitude || 0;
			const newLng = loadedFiles[0]?.exif_data?.longitude || 0; 
			setCenter({ 
				lat: newLat, 
				lng: newLng
			});
			 mapRef?.current?.flyTo([newLat, newLng], mapRef?.current?.getZoom());
		}
	},[loadedFiles])

	

	return(
		<div className={`fixed z-50 h-full w-full rounded-lg overflow-hidden 
		${showMap ? 'left-0' : '-left-[100%]'} top-0 transition-all duration-200 ease-in-out
		bg-gray-300/60 p-5 flex flex-col gap-1`}>
				<MapContainer
			      center={[center.lat, center.lng]}
			      zoom={13}
			      style={{ height: "100%", width: "100%" }}
			      ref={mapRef}
			      whenCreated={(map) => (mapRef.current = map)}
			    >
			        
			         
				    <LayersControl position="topright">
					    <LayersControl.Overlay checked name="Vector Map">
					        <TileLayer
						        url={`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`}
						        attribution='Map data &copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors, <a href=&quot;https://creativecommons.org/licenses/by-sa/2.0/&quot;>CC-BY-SA</a>, Imagery &copy; <a href=&quot;https://www.mapbox.com/&quot;>Mapbox</a>'
						    />
					    </LayersControl.Overlay>

					    <LayersControl.Overlay name="Mapbox Map">
					        <TileLayer
						        url={`https://api.mapbox.com/styles/v1/mapbox/streets-v12/tiles/256/{z}/{x}/{y}@2x?access_token=sk.eyJ1IjoidGhlamFzaGFyaSIsImEiOiJjbG4wazg4c3YxMDMwMmpuemp2eDl6bzh0In0.sUZFHTO5dLZjZDdqINFOwA`}
						        attribution='Map data &copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a>&copy; <a href=&quot;https://www.mapbox.com/&quot;>Mapbox</a>'
						      />
					    </LayersControl.Overlay>

					    <LayersControl.Overlay name="Satellite Map">
					        <TileLayer
						        url={`https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}.png`}
						        attribution='&copy; <a href="Esri &mdash">GIS User Community</a> contributors'
						    />
					    </LayersControl.Overlay>
				    </LayersControl>

			        {
			        	loadedFiles?.map((file,k)=>{
			        		if(file?.exif_data?.latitude && file?.exif_data?.longitude){
			        			return (
							      <Marker key={k} position={[file?.exif_data?.latitude, file?.exif_data?.longitude]} animate={true}>
							        <Popup><img src={file?.url} height="100px" width="100px"
							        alt="" className="" />
							        <br/>
							        {file?.path ? file?.path : file?.name ? file?.name : '--'}</Popup>
							      </Marker>
			        			)
			        		}
			        	})
			        }
			        <MyComponent />
			    </MapContainer>
			    <div className="w-full px-5 py-1 gap-2 bg-white rounded-b-lg flex items-center justify-end">
			    	<div 
					onClick={()=>setShowMap(false)}
					className={`tranisition-all duration-200 ease-in-out right-5 cursor-pointer transition-all duration-200 ease-in-out 
					p-1 rounded-full rounded-lg text-gray-800 hover:text-black z-50`}>
						Close
					</div>

					<div 
					onClick={()=>exportMarkersAsKML()}
					className={`tranisition-all duration-200 ease-in-out right-5 cursor-pointer transition-all duration-200 ease-in-out hover:bg-gray-200 
					bg-gray-100 px-3 py-1 rounded-lg text-sm border-[1px] border-gray-300 text-gray-800 hover:text-black z-50 flex items-center gap-2`}>
						<BiCloudDownload className="h-5 w-5"/>
						Download as KML
					</div>
			    </div>

		</div>
	)

}