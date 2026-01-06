"use client"
import {useState,useEffect} from 'react'
import exifr from 'exifr'

export default function MapComponent({mapRef,MapContainer,LayersControl,TileLayer,
	markersData,setMarkersData,Marker,Popup,MyComponent,data,setCurrentImage,currentImage}) {
	
	useEffect(()=>{
		const fetchDetails = async() => {
			var allData = []
			for(let i = 0; i<data.length; i++){
				let {latitude, longitude} = data[i]?.exif_data;
				allData = [...allData,{
					latitude,longitude,url:data[i].url,name:data[i]?.name
				}]
				if(i === 0){
					mapRef?.current?.flyTo([latitude, longitude])
				}
			}
			setMarkersData(allData)
		}
		fetchDetails();
	},[data])

	return (
		<MapContainer
	      center={[18.941842351894458, 73.0256777078700]}
	      zoom={13}
	      maxZoom={22}
	      style={{ height: "100%", width: "100%", zIndex:'0' }}
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
			        	maxZoom={22}							        
				    />
			    </LayersControl.Overlay>
		    </LayersControl>

		    <LayersControl.Overlay name="Google Map">
		        <TileLayer
			        url={`https://mt3.google.com/vt/lyrs=y&x={x}&y={y}&z={z}`}
			        attribution=''
			        maxZoom={22}
			      />
		    </LayersControl.Overlay>
		    {
		    	markersData?.map((dat,k)=>(
		    		<Marker key={k} position={[dat?.latitude, dat?.longitude]} animate={true}>
			        <Popup><img onClick={()=>setCurrentImage(dat)} src={dat?.url} height="100px"
			        alt="" className="border-[2px] transition-all duration-200 ease-in-out rounded-sm hover:border-blue-500 cursor-pointer" />
			        <br/>
			        {dat?.name ? dat?.name : '--'}</Popup>
			      </Marker>
		    	))	
		    }
	        
	        <MyComponent />
	    </MapContainer>
	)
}