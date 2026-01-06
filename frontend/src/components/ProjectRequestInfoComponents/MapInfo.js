'use client'
import {useEffect,useState} from 'react'	
import MainMapComponent from './MainMapComponent';
import MapInfoCard from './MapInfoCard'

export default function MapInfo({request,setRequest}) {
	// body...
	const [currentFile,setCurrentFile] = useState('');
	const [showName,setShowName] = useState(true);
	const [kmlFile,setKmlFile] = useState('');
	const [kmlFiles,setKmlFiles] = useState([]);

	useEffect(()=>{
		if(request?.kmlkmzFiles?.length > 0){
			setKmlFiles(request?.kmlkmzFiles)
		}
	},[request])

	return (
		<main className="w-full h-full overflow-hidden items-center flex">
			<div className="h-full w-[30%] bg-gray-50 border-r-[3px] border-gray-300 flex flex-col">
				<div className="flex items-center pt-4 pb-3 border-b-[1px] border-gray-300 px-3">
					<h1 className="text-lg text-black font-semibold">KML files</h1>
				</div>
				<div className="flex flex-col gap-3 py-3 px-3">
					{
						kmlFiles.map((kml,j)=>(
							<MapInfoCard key={j} kml={kml} j={j} currentFile={currentFile} setCurrentFile={setCurrentFile}
							showName={showName} setShowName={setShowName} setKmlFile={setKmlFile}/>
						))
					}



				</div>

			</div>
			<div className="w-[70%] h-full bg-black">
				<MainMapComponent kmlFile={kmlFile} />
			</div>

		</main>

	)
}