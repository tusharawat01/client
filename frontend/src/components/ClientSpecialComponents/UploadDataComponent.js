"use client"
import {useState,useEffect} from 'react';
import {AiOutlineCloudUpload} from 'react-icons/ai';
import { useDropzone } from 'react-dropzone';
import FileCard from './FileCard';
import exifr from 'exifr';
import {MdLocationPin} from 'react-icons/md';
import {AiOutlinePlusCircle} from 'react-icons/ai';
import {PiFiles} from 'react-icons/pi';
import {IoMdSearch,IoMdTime} from 'react-icons/io';
import {RxCross2} from 'react-icons/rx'
import dynamic from 'next/dynamic';
import {BsDownload} from 'react-icons/bs';

const MapComponent2 = dynamic(
  () => import('./MapComponent2'),
  {
    ssr: false,
    loading: () => (<div>loading...</div>),
  }
);


var loadedFilesData = [];
let intervalId = '';

export default function UploadDataComponent({
	loadedFiles,setLoadedFiles,loading,setLoading,clearLoadedFiles,
	setClearLoadedFiles,currentFileTab
}) {
	
	const [path,setPath] = useState('');
	const [loadingTime,setLoadingTime] = useState(0);
	const [searchValue,setSearchValue] = useState('');
	const [showMap,setShowMap] = useState(false);
	const [searchLoadedValue,setSearchLoadedValue] = useState([]);
	const [videoLoading,setVideoLoading] = useState(false);

	function markersToKML(markers) {
	  const kml = `<?xml version="1.0" encoding="UTF-8"?>
		<kml xmlns="http://www.opengis.net/kml/2.2">
		  <Document>
		    ${markers
		      .map(
		        (marker, index) => `
		      <Placemark>
		        <name>${marker.file.path ? marker.file.path : marker.file.name ? marker.file.name : '--'}</name>
		        <Point>
		          <coordinates>${marker.exif_data.longitude},${marker.exif_data.latitude}</coordinates>
		        </Point>
		        <description><![CDATA[
		          ${marker.file.path ? marker.file.path : marker.file.name ? marker.file.name : '--'}
		        ]]></description>
		      </Placemark>
		    `
		      )
		      .join('')}
		  </Document>
		</kml>`;

	  return kml;
	}

	useEffect(()=>{
		if(loadedFiles?.length < 1){
			setVideoLoading(false);
		}
	},[loadedFiles])

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
		if(clearLoadedFiles){
			loadedFilesData = [];
			setLoadingTime(0);
			setPath('');
			setLoadedFiles([]);
			setClearLoadedFiles(false);
		}
	},[clearLoadedFiles])

	function createChunk(videoId, start, chunkEnd, file, chunkCounter, chunkSize){
		chunkCounter++;
		const filename = 'video-001';
		console.log("created chunk: ", chunkCounter);
		chunkEnd = Math.min(start + chunkSize , file.size );
		const chunk = file.slice(start, chunkEnd);
		console.log("i created a chunk of video, chunk :-" + chunk + ' ' + start + "-" + chunkEnd + "minus 1	");
		const chunkForm = new FormData();
		if(videoId.length >0){
			chunkForm.append('videoId', videoId);
			console.log("added videoId");	
			
		}
		chunkForm.append('file', chunk, filename);

		
		console.log(chunkForm, start, chunkEnd);
	}

	const readVideoFile = async(file) => {
		var chunkCounter = 0;
	  const chunkSize = 6000000;  
	  var videoId = "3819";
	  var playerUrl = "";
	  var numberofChunks = Math.ceil(file.size/chunkSize);
	  console.log(numberofChunks);
		var start = 0; 
		var chunkEnd = start + chunkSize;
		const chunks = await createChunk(videoId, start, chunkEnd, file, chunkCounter, chunkSize);
		return chunks;
	}

	const readFileAndGetData = async(file,index,files) => {
		const reader = new FileReader();
		if(currentFileTab !== 'image' && loadedFiles?.length < 1){
			setVideoLoading(true);
		}else{
			setVideoLoading(false);
		}
		reader.addEventListener('load',async()=>{
			const uploaded_image = await reader.result;
			const exif_data = await exifr.parse(file)

			const filedata = {
				base64:uploaded_image,
				file,
				exif_data
			}
			loadedFilesData = [...loadedFilesData,filedata];
			setLoadedFiles(loadedFilesData);
			// const exif_data = await exifr.parse(uploaded_image)
			if((index + 1) <= files.length){
				readFileAndGetData(files[index],index+1,files);
			}else{
				setLoading(false);
			}
		});
		if(currentFileTab === 'image'){
			if(file.type.includes('image')){
				reader.readAsDataURL(file);
			}else if((index + 1) === files?.length){
				setLoading(false);
			}
		}else{
			if(file.type.includes('video')){
				// reader.readAsDataURL(file);
				const filedata = {
					base64:'',
					file,
					exif_data:{}
				}
				loadedFilesData = [...loadedFilesData,filedata];
				setLoadedFiles(loadedFilesData);
				// const exif_data = await exifr.parse(uploaded_image)
				if((index + 1) <= files.length){
					readFileAndGetData(files[index],index+1,files);
				}else{
					setLoading(false);
				}
			}else if((index + 1) === files?.length){
				setLoading(false);
			}
		}
	}

	const onDrop = (acceptedFiles) => {
		setLoading(true)
		readFileAndGetData(acceptedFiles[0],1,acceptedFiles);
	    // const exif_data = await readFileAndGetData(acceptedFiles[i]);
	    
	  };

	const { getRootProps, getInputProps } = useDropzone({
	    multiple: true,
	    directory: true,
	    onDrop,
	  });

	const urlSetter = (e) => {
		const file_input = document.getElementById('uploadfileInput');
		const acceptedFiles = file_input.files;
		setLoading(true)
		readFileAndGetData(acceptedFiles[0],1,acceptedFiles);
	}

	const urlSetter2 = (e) => {
		const file_input = document.getElementById('uploadfolderInput');
		const acceptedFiles = file_input.files;
		setLoading(true)
		readFileAndGetData(acceptedFiles[0],1,acceptedFiles);
	}

	useEffect(()=>{
		if(loading){
			intervalId = setInterval(()=>{
				setLoadingTime((prevLoadingTime) => prevLoadingTime + 1);
			},1000)
		}else{
			if(intervalId){
				clearInterval(intervalId)
			}
		}

		 return () => {
		    if (intervalId) {
		      clearInterval(intervalId);
		    }
		  };
	},[loading])


	useEffect(()=>{
		if (searchValue.length > 0) {
			const searchFile = async(val) => {
				const result = loadedFiles?.filter((file) => 
			        file?.file?.name?.toLowerCase().includes(val) ||
			        file?.exif_data?.latitude?.toString().includes(val) ||
			        file?.exif_data?.longitude?.toString().includes(val) ||
			        file?.exif_data?.GPSAltitude?.toString().includes(val)
			      );
				setSearchLoadedValue(result)
			}
			searchFile(searchValue);
		}else{
			setSearchLoadedValue([])
		}
	},[searchValue])

	return (
		<div className={`flex flex-col mt-14 relative ${loadedFiles.length > 0 ? 'w-full' : 'md:w-[60%] w-full'} mx-auto`}>
			{
				loadedFiles?.length > 0 && currentFileTab === 'image' &&
				<MapComponent2 showMap={showMap} setShowMap={setShowMap} loadedFiles={loadedFiles}

				/>
			}
			{
				loadedFiles?.length > 0 ?
				<div className="flex flex-col gap-3 px-5 py-3 overflow-hidden">
					<h1 className="flex items-center md:flex-row flex-col gap-5 justify-between font-semibold leading-none text-gray-400">
						<input
			        type="file"
			        id="uploadfileInput"
			        name="fileInput"
			        multiple="true"
			        hidden
			        onChange={(e)=>{
			        	setPath(e.target.value);
			        	urlSetter()
			        }}
			      />
						<span className="flex items-center gap-1 text-gray-200">
							LOADED FILES
							
						</span>
						<div className="flex items-center gap-3">
							<div className="flex items-center gap-1 group cursor-pointer">
								<AiOutlinePlusCircle 
								className={`h-5 w-5 text-gray-400 ${loading ? 'cursor-not-allowed' : 'cursor-pointer group-hover:text-blue-500'}`}/>
								<p 
								onClick={()=>{if(!loading) document.getElementById('uploadfileInput').click()}}
								className={`${!loading ? 'group-hover:text-blue-500' : 'text-gray-300 cursor-not-allowed'}`}>Add Files</p>
							</div>
							{
								currentFileTab === 'image' &&
								<>
									<div 
									onClick={()=>{setShowMap(true)}}
									className="flex items-center gap-1 hover:text-blue-500 cursor-pointer">
										<MdLocationPin className="h-5 w-5"/> {loading ? <span className="loader8"/> : 'Map view'}
									</div>
									<div 
									onClick={exportMarkersAsKML}
									className="flex items-center gap-1 hover:text-blue-500 cursor-pointer">
										<BsDownload className="h-5 w-5"/> {loading ? <span className="loader8"/> : 'Export as KML'}
									</div>
								</>
							}
						</div>
					</h1>
					<div className={`w-full ${loading ? '' : 'h-[1px] bg-gray-300'}`}>
						{loading && <span className="loader7"/>}
					</div>
					<div className="w-full flex items-center sm:flex-row flex-col gap-5 justify-between">
						<h1 className="text-gray-300 flex items-center text-sm gap-1">
							<PiFiles className="h-5 w-5"/> {loadedFiles?.length} Files
							<IoMdTime className="h-5 w-5 ml-3"/> {loadingTime} Seconds
						</h1>
						<div className="flex items-center w-[250px] gap-1 p-1 px-2 rounded-lg border-[1px] border-gray-300 hover:border-sky-500 focus-within:border-sky-500">
							<IoMdSearch className="h-[18px] w-[18px] text-gray-200 peer-focus:text-blue-500 "/>
							<input type="text" className="text-sm w-full peer text-gray-300 bg-transparent outline-none placeholder:text-gray-500"
							value={searchValue} onChange={(e)=>setSearchValue(e.target.value)}
							placeholder="Search by name, lat, long, alt" disabled={loading}
							/>
						</div>
					</div>
					<div className="overflow-x-auto w-full border-[1px] border-gray-700 rounded-lg">
						<table className="table-fixed rounded-lg sm:w-full ">
							<thead className="rounded-t-lg" >
						      <tr className="bg-gray-800 hover:bg-gray-800/70 text-gray-200 text-black px-5 py-3 border-b-[1px] border-gray-700">
						        <th className="text-sm px-5 py-3">Name</th>
						        {
											currentFileTab === 'image' ?
											<>
												<th className="text-sm px-5 py-3">Lattitude</th>
												<th className="text-sm px-5 py-3">Longitude</th>
												<th className="text-sm px-5 py-3">Altitude</th>
											</>
											:
											<th className="text-sm px-5 py-3">Size (mb)</th>
										}
						      </tr>
						    </thead>
						    <tbody>
							{
								!searchValue ?
								loadedFiles.map((file,k)=>(
									<FileCard file={file} key={k} k={k}
									/>
								))
								:
								searchLoadedValue.map((file,k)=>(
									<FileCard file={file} key={k} k={k}
									/>
								))
							}
							</tbody>
						</table>
					</div>
				</div>
				:
				<div className="flex flex-col gap-3 px-5 py-3">
					<h1 className={`font-semibold leading-none ${videoLoading && 'animate-pulse'} 
					text-gray-200`}>
						{currentFileTab === 'image' ? 'IMAGES' : videoLoading ? 'LOADING VIDEOS...' : 'VIDEO' }
					</h1>
					<div className="w-full bg-gray-700 h-[1px]"/>
					<div className="flex items-center gap-5">
				      <input
				        type="file"
				        id="uploadfileInput"
				        name="fileInput"
				        multiple="true"
				        hidden
				        onChange={(e)=>{
				        	setPath(e.target.value);
				        	urlSetter()
				        }}
				      />
				    <button 
						onClick={()=>document.getElementById('uploadfileInput').click()}
						className="w-[50%] hover:bg-blue-600 transition-all duration-100 
						ease-in-out rounded-md border-[1px] border-gray-300 
						bg-blue-500 text-white px-5 py-1">
							Upload Files
						</button>
						<input
			        type="file"
			        id="uploadfolderInput"
			        name="fileInput"
			        multiple="true"
			        webkitdirectory="true"
							directory="true" 
			        hidden
			        onChange={(e)=>{
			        	setPath(e.target.value);
			        	urlSetter2()
			        }}
			      />
						<button 
						onClick={()=>document.getElementById('uploadfolderInput').click()}
						className="w-[50%] hover:bg-blue-600 transition-all duration-100 
						ease-in-out rounded-md border-[1px] border-gray-300 
						bg-blue-500 text-white px-5 py-1">
							Upload Folder
						</button>
					</div>

					
					<div className="flex flex-col w-full p-5">
						 <div {...getRootProps()} className="border-[2px] flex flex-col items-center justify-center 
						 rounded-lg border-dashed border-sky-400 hover:border-blue-500 p-5 pt-2 text-center">
					      <input {...getInputProps()} />
					      <AiOutlineCloudUpload className="h-[110px]  w-[110px] text-blue-600 hover:text-blue-500"/>
					      <p className="text-gray-200" >Drag &apos;n&apos; drop some files and folders here</p>
					    </div>
					</div>

				</div>

			}

		</div>
	)
}