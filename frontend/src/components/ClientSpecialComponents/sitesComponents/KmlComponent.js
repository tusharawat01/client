"use client"

import ReactLeafletKml from 'react-leaflet-kml';
import {useState,useEffect,useRef} from 'react';


export default function KmlComponent({url}) {
	const [kml,setKml] = useState('');
	const kmlRef = useRef();

	useEffect(()=>{
		fetch(url)
        .then((response)=> response.text())
        .then((kmlText)=>{
            const parser = new DOMParser();
            var doc = parser.parseFromString(kmlText,'text/xml');
            setKml(doc);
        })
	},[url])

	return(
		<>
			{kml && <ReactLeafletKml ref={kmlRef} kml={kml}/>}
		</>
	) 
	
}