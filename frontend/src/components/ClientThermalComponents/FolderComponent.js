"use client"
import {useState,useEffect} from 'react';
import axios from 'axios';
import {getFilesByFolderId} from '../../utils/ApiRoutes';
import {MdOutlineChevronRight} from 'react-icons/md';
import {HiOutlineDownload} from 'react-icons/hi';

export default function FolderComponent({folder,uploadingFilesStarted,showMarkers,
	setShowMarkers,setShowMap}) {

	const [loading,setLoading] = useState(true);
	const [allFiles,setAllFiles] = useState([]);

	const fetchFilesInFolder = async(folder) => {
		console.log(folder)
		const {data} = await axios.post(getFilesByFolderId,{folderId:folder?.folderId});
		if(data?.status){
			// console.log(data)
			setAllFiles(data?.file);
			setLoading(false)
		}
	}

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
	  const kmlData = markersToKML(allFiles);
	  downloadKML(kmlData, `${folder.name}.kml`);
	}

	useEffect(()=>{
		if (folder) {
			fetchFilesInFolder(folder)
		}
	},[folder])

	function showMap(){
		setShowMarkers(allFiles);
		setShowMap(true);
	}
	

	return (
		<tr className="bg-gray-800 cursor-pointer group border-b-[1px] border-gray-500 hover:bg-gray-800/70">
			<td onClick={showMap} className="px-4 py-2 text-center" >
				<h1 className="text-sm font-semibold text-gray-200">{folder?.name}</h1>
			</td>
			<td onClick={showMap} className="px-4 py-2 text-center" >
				<h1 className="text-sm font-semibold text-gray-200">{folder?.folderCreatedDate}</h1>
			</td>
			<td onClick={showMap} className="px-4 py-2 text-center" >
				<h1 className="text-sm font-semibold text-gray-200">{folder?.userDetails?.name}</h1>
			</td>
			<td onClick={showMap} className="px-4 py-2 text-center ">
				<h1 className="text-sm font-semibold text-gray-200">{allFiles?.length}</h1>
			</td>
			<td className="px-4 py-2 text-center relative ">
				<div className="absolute right-0 top-0 bottom-0 group-hover:opacity-[100%] opacity-[0%] transition-all 
				duration-200 ease-in-out flex items-center justify-center">
					<MdOutlineChevronRight className="h-5 w-5 text-gray-300"/>
				</div>
				{
					loading ? 
					<span className="loader4"/>
					:
					<h1 
					onClick={exportMarkersAsKML}
					className="text-sm font-semibold w-full text-center text-gray-200 hover:text-blue-500 flex 
					items-center gap-1 justify-center">
						<HiOutlineDownload className="h-4 w-4"/>
						Export
					</h1>
				}
			</td>
		</tr>
	)
}