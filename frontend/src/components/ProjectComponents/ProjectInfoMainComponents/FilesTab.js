"use client"

import {useState,useEffect} from 'react';
import UploadDataComponent from './UploadDataComponent';
import ImageKit from 'imagekit';
import {RxCross2} from 'react-icons/rx';
import {createFolder,updateFilesInFolder,updateFolders,getFoldersById,
	createFile,getFilesByFolderId,getVideoFoldersById,createVideoFolder,
	uploadVideo} from '../../../utils/ApiRoutes';
import {currentUserState} from '../../../atoms/userAtom';
import {useRecoilState} from 'recoil';
import FolderComponent from './FolderComponent';
import VideoFolderComponent from './VideoFolderComponent';
import axios from 'axios';
import {IoMdSearch} from 'react-icons/io';
import MapComponent2 from './MapComponent2';
import {TbChevronDown} from 'react-icons/tb';
import {BiImages} from 'react-icons/bi';
import {MdOutlineVideoLibrary} from 'react-icons/md';

let tempData = [];
export default function FilesTab({project,setProject,setCurrentTab}) {
	const rawData = [];
	const [openUploadTab,setOpenUploadTab] = useState(false);
	const [loading,setLoading] = useState(false);
	const [loadedFiles,setLoadedFiles] = useState([]);
	const [askConfirm,setAskConfirm] = useState(false);
	const [creatingFolder,setCreatingFolder] = useState(false);
	const [currentUser,setCurrentUser] = useRecoilState(currentUserState);
	const [uploadedFolderData,setUploadedFolderData] = useState([]);
	const [currentFolders,setCurrentFolders] = useState([]);
	const [currentVideoFolders,setCurrentVideoFolders] = useState([]);	
	const [searchValue,setSearchValue] = useState('');
	const [searchResults,setSearchResults] = useState([]);
	const [filesUploading,setFilesUploading] = useState(false);
	const [uploadingFileName,setUploadingFileName] = useState('');
	const [uploadingFilesStarted,setUploadingFilesStarted] = useState(false);
	const [uploadingFileNumber,setUploadingFileNumber] = useState(0);
	const [uploadPercentage,setUploadPercentage] = useState(0);
	const [showUploadingData,setShowUploadingData] = useState(false);
	const [showMap,setShowMap] = useState(false);
	const [showMarkers,setShowMarkers] = useState([]);
	const [clearLoadedFiles,setClearLoadedFiles] = useState(false);
	const [showFolderStatus,setShowFolderStatus] = useState('');
	const [currentFileTab,setCurrentFileTab] = useState('image');
	const [videoSearchValue,setVideoSearchValue] = useState('');
	const [videoSearchResults,setVideoSearchResults] = useState([]);
	const [uploadProgress,setUploadProgress] = useState(0);
	const [uploadStatus,setUploadStatus] = useState('');
	const imagekit = new ImageKit({
	    publicKey : process.env.NEXT_PUBLIC_IMAGEKIT_ID,
	    privateKey : process.env.NEXT_PUBLIC_IMAGEKIT_PRIVATE,
	    urlEndpoint : process.env.NEXT_PUBLIC_IMAGEKIT_ENDPOINT
	});

	function generateRandomId(length = 8) {
	  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	  let randomId = '';

	  for (let i = 0; i < length; i++) {
	    const randomIndex = Math.floor(Math.random() * characters.length);
	    randomId += characters.charAt(randomIndex);
	  }

	  return randomId;
	}

	const getCurrentDate = () => {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      return `${day}-${month}-${year}`;
    };

    const loadFileWithFolderId = (folderId) => {
    	return new Promise((resolve) => {		    
    		let loadedFilesInFolderId = {};
		    for(let i = 0;i < loadedFiles?.length; i++){
	    		loadedFilesInFolderId[loadedFiles[i]?.file?.name] = folderId;
	    		if(i+1 === loadedFiles?.length){
	    			resolve(loadedFilesInFolderId)
	    		}
	    	}
		});
    }

    const uploadWithoutFolderName = async() => {
		const currdate = await getCurrentDate();
		const number = project?.folders?.length > 0 ? project?.folders?.length + 1 : '0';
		const folderName = `FlightData-${number}`;
		const folderId = await generateRandomId(10);
		loadFileWithFolderId(folderId).then(async(loadedFilesInFolderId)=>{
			if(currentFileTab === 'image'){
				const {data} = await axios.post(createFolder,{
					name:folderName,
					folderCreatedDate:currdate,
					projectId:project?._id,
					folderId,
					userDetails:{
						name:currentUser?.name,
						_id:currentUser?._id,
						image:currentUser?.image
					}
				})
				if(data?.status){
					const foldersData = [data?.folder];
					foldersCreated(foldersData,loadedFilesInFolderId);
				}else{
					alert("Something went wrong! could not create space for files!")
				}
			}else{
				const {data} = await axios.post(createVideoFolder,{
					name:folderName,
					folderCreatedDate:currdate,
					projectId:project?._id,
					folderId,
					userDetails:{
						name:currentUser?.name,
						_id:currentUser?._id,
						image:currentUser?.image
					}
				})
				if(data?.status){
					const foldersData = [data?.folder];
					foldersCreated(foldersData,loadedFilesInFolderId);
				}else{
					alert("Something went wrong! could not create space for files!")
				}
			}
			

		}) 
		// const loadedFilesInFolderId = await loadFileWithFolderId(folderId);
    }

    const foldersCreated = async(foldersCreatedData,loadedFilesInFolderId) => {
    	const foldersId = foldersCreatedData?.map(folderData=>folderData?.folderId);
    	if(project?.folders){
	    	const folders = [...project?.folders,...foldersId];
    		const {data} = await axios.post(`${updateFolders}?industry=${project?.industry}`,{folders,id:project?._id});
    		if(data?.status){
    			setProject(data?.project);
    			startUploadingFiles(data?.project,loadedFilesInFolderId);
				setCreatingFolder(false);
				setAskConfirm(false);
				setFilesUploading(true);
    		}
    	}
    }

    const uploadWithFolderNames = async(folderNames,i,loadedFilesInFolderId) => {
    	const currdate = await getCurrentDate();
		const {data} = await axios.post(createFolder,{
			name:folderNames[i].folderName,
			folderCreatedDate:currdate,
			projectId:project?._id,
			folderId:folderNames[i].folderId,
			userDetails:{
				name:currentUser?.name,
				_id:currentUser?._id,
				image:currentUser?.image
			}
		})
		if(data?.status){
			tempData = [...tempData,data?.folder];
			if(i + 1 === folderNames?.length) {
				setUploadedFolderData(tempData)
				const foldersData = tempData;
				foldersCreated(foldersData,loadedFilesInFolderId);
				tempData = [];
			}else{
				uploadWithFolderNames(folderNames,i+1,loadedFilesInFolderId)
			}
		}else{
			alert("Something went wrong! could not create space for files!")
		}
    }

	const startUploading = async() => {
		let folderNames = [];
		let loadedFilesInFolderId = {};
		setCreatingFolder(true);
		if(loadedFiles[0]?.file?.path){
			let folderId = ''; 
			for(let i = 0;i<loadedFiles?.length;i++){
				if(!(folderNames.find(folder=>folder.folderName === loadedFiles[i]?.file?.path?.split('/')[1]))) {
					
					folderId = await generateRandomId(10); 
					folderNames = [...folderNames,{
						folderName:loadedFiles[i]?.file?.path?.split('/')[1],
						folderId
					}];
					loadedFilesInFolderId[loadedFiles[i].file.path] = folderId;
				}else{
					loadedFilesInFolderId[loadedFiles[i].file.path] = folderId;
				}
				if(i+1 === loadedFiles?.length){
					uploadWithFolderNames(folderNames,0,loadedFilesInFolderId);
				}
			}
		}else{
			uploadWithoutFolderName()
		}
	}

	const fetchFolderAndSetStatus = async(folderId) => {
		const {data} = await axios.post(getFoldersById,{
			id:folderId
		})
		if(data.status){
			setShowFolderStatus(data?.folder[0]?.name);
		}
	}

	const uploadImage = async(loadedFiles,i,loadedFilesInFolderId,currproject) => {
		setUploadingFileName(loadedFiles[i].file?.name);
		setUploadingFileNumber(i+1);
		fetchFolderAndSetStatus(loadedFiles[i]?.file?.path ? loadedFilesInFolderId[loadedFiles[i]?.file?.path] : loadedFilesInFolderId[loadedFiles[i]?.file?.name])
		if(currentFileTab === 'image'){
			imagekit.upload({
		    file : loadedFiles[i].base64, //required
		    fileName : loadedFiles[i]?.file?.name,   //required
		    extensions: [
		        {
		            name: "google-auto-tagging",
		            maxTags: 5,
		            minConfidence: 95
		        }
		    ]
			}).then(response => {
				uploadFileToDB(response.url,loadedFiles[i],loadedFilesInFolderId);
				if(i+1 === loadedFiles?.length){
					fetchFolders(currproject?.folders);
					setLoadedFiles([]);
					setClearLoadedFiles(true);
					setUploadingFilesStarted(false);
				}else{
					uploadImage(loadedFiles,i+1,loadedFilesInFolderId,currproject);
				}
			}).catch(error => {
			    console.log(error.message);
			});

		}else{
			const formData = new FormData();
	        formData.append('video', loadedFiles[i]?.file);

			try {
				const xhr = new XMLHttpRequest();
				const uniqueId = await generateRandomId(10);
				const backendUrl = `${uploadVideo}?filename=${loadedFiles[i]?.file?.name}&projectId=${project?._id}&tag=${uniqueId}`;
				xhr.open('POST', backendUrl, true);
	
				xhr.upload.onprogress = (event) => {
					if (event.lengthComputable) {
						const percentComplete = Math.round((event.loaded / event.total) * 100);
						setUploadProgress(percentComplete);
					}
				};
	
				xhr.onload = () => {
					if (xhr.status >= 200 && xhr.status < 300) {
						const url = xhr.responseText;
						uploadFileToDB(url,loadedFiles[i],loadedFilesInFolderId);
						if(i+1 === loadedFiles?.length){
							fetchFolders(currproject?.folders);
							setLoadedFiles([]);
							setClearLoadedFiles(true);
							setUploadingFilesStarted(false);

						}else{
							uploadImage(loadedFiles,i+1,loadedFilesInFolderId,currproject);
						}
					} else {
						alert(`Failed to upload file: ${xhr.responseText}`);
					}
				};
	
				xhr.onerror = () => {
					setUploadStatus('An error occurred while uploading the file.');
				};
	
				xhr.send(formData);
			} catch (error) {
				setUploadStatus('An error occurred while uploading the file.');
			}
		}
	}

	const startUploadingFiles = async(currproject,loadedFilesInFolderId) => {
		setUploadingFilesStarted(true);
		setOpenUploadTab(false);
		uploadImage(loadedFiles,0,loadedFilesInFolderId,currproject);
	}

	const fetchFolders = async(foldersId) => {
		const {data} = await axios.post(getFoldersById,{
			id:foldersId
		})
		if(data.status){
			setCurrentFolders(data?.folder);
		}
	}

	const fetchVideoFolders = async(foldersId) => {
		const {data} = await axios.post(getVideoFoldersById,{
			id:foldersId
		})
		if(data.status){
			setCurrentVideoFolders(data?.folder);
		}
	}

	useEffect(()=>{
		if(project?.folders?.length > 0){
			if(currentFileTab === 'image'){
				fetchFolders(project?.folders);
			}else{
				fetchVideoFolders(project?.folders);
			}

		}
	},[project])

	useEffect(()=>{
		if(project){
			if(currentFileTab === 'image'){
				fetchFolders(project?.folders);
			}else{
				fetchVideoFolders(project?.folders);
			}
		}
		if(loadedFiles?.length > 0){
			setLoadedFiles([]);
		}
	},[currentFileTab])

	useEffect(()=>{
		if (searchValue) {
			const searchFolder = async(val) => {
				const result = currentFolders?.filter((folder) => 
			        folder?.name?.toLowerCase()?.includes(val) ||
			        folder?.userDetails?.name?.toLowerCase()?.includes(val) ||
			        folder?.folderCreatedDate?.toLowerCase()?.includes(val)
			      );
				setSearchResults(result)
			}
			searchFolder(searchValue);
		}else{
			setSearchResults([])
		}
	},[searchValue])

	const uploadFileToDB = async(url,loadedFile,loadedFilesInFolderId) => {

		const folderId = loadedFile?.file?.path ? loadedFilesInFolderId[loadedFile?.file?.path] : loadedFilesInFolderId[loadedFile?.file?.name];
		const tempdata = {
			url,
			name:loadedFile?.file?.name,
			fileDat:loadedFile.file,
			exif_data:loadedFile.exif_data,
			folderId
		}
		const {data} = await axios.post(createFile,tempdata);
		if(data?.status){
			console.log("ok")
		}
	}

	useEffect(()=>{
		if(uploadingFileNumber){
			const percent = Math.round((uploadingFileNumber / loadedFiles?.length) * 100);
			setUploadPercentage(percent)
		}
	},[uploadingFileNumber])

	
	return(
		<div className="w-full">
				
			<div className={`${openUploadTab ? 'w-full h-full md:p-10 p-1' : 'h-[0%] w-[0%] overflow-hidden'} fixed inset-0 
			bg-gray-200/50 flex items-center justify-center transition-all duration-200
			ease-in-out z-50`}>
				<div className="bg-gray-50 rounded-md border-[1px] border-gray-300 
				h-full w-full flex flex-col overflow-y-auto relative">
					<div className="w-full absolute top-0 flex items-end bg-white/80 overflow-x-scroll scrollbar-none">
						<div 
						className="flex flex-col transition-all 
						duration-200 ease-in-out w-full">
							<div className="md:px-5 flex items-center gap-5 justify-between sm:px-4 px-2 py-2">
								<h1 className="sm:text-lg text-md whitespace-nowrap font-semibold text-gray-900 flex items-center gap-2">
									<div 
									onClick={()=>setOpenUploadTab(false)}
									className="p-1 hover:bg-gray-200 rounded-full transition-all duration-200 ease-in-out cursor-pointer">
										<RxCross2 className="h-5 w-5 text-gray-700"/>
									</div>
									Upload data
								</h1>
								{
									(loadedFiles.length > 0 && !loading && !uploadingFilesStarted) && 
									<div className="flex items-center gap-3">
									<h1 
									onClick={()=>{if(loadedFiles.length > 0 && !loading && !uploadingFilesStarted) setClearLoadedFiles(true)}}
									className="sm:text-md text-sm whitespace-nowrap px-4 py-[5px] rounded-lg 
									font-semibold text-gray-800 hover:bg-gray-100 cursor-pointer">Clear</h1>
									<h1 
									onClick={()=>{if(loadedFiles.length > 0 && !loading && !uploadingFilesStarted) setAskConfirm(true)}}
									className="sm:text-md text-sm whitespace-nowrap px-4 py-[5px] rounded-lg 
									font-semibold text-white bg-blue-500 hover:bg-blue-600 cursor-pointer">Confirm</h1>
									</div>
								}
							</div>
							<div className={`w-full h-[2px] transition-all duration-200 
							ease-in-out bg-blue-500`}/>
						</div> 
					</div>

					<UploadDataComponent loadedFiles={loadedFiles} setLoadedFiles={setLoadedFiles}
					loading={loading} setLoading={setLoading} clearLoadedFiles={clearLoadedFiles}
					setClearLoadedFiles={setClearLoadedFiles} currentFileTab={currentFileTab}
					/>
				</div>
			</div>

			<div className={`${askConfirm ? 'h-full w-full' : 'h-[0%] w-[0%]'} m-auto bottom-0 left-0 right-0 top-0 overflow-hidden fixed z-50 
			bg-gray-200/70 flex items-center justify-center transition-all duration-200 ease-in-out`}>
				<div className="bg-white rounded-lg border-[1px] border-gray-300 md:w-[60%] w-[95%] flex flex-col">
					<div className="w-full px-2 flex items-center gap-1 py-2">
						<div 
						onClick={()=>setAskConfirm(false)}
						className="rounded-full p-1 flex items-center hover:bg-gray-100 cursor-pointer justify-center">
							<RxCross2 className="h-5 w-5 text-gray-700"/>
						</div>
						<h1 className="text-md font-semibold text-gray-900">Upload Confirmation</h1>
					</div>
					<div className="w-full h-[1px] bg-gray-300"/>
					<div className="flex flex-col gap-2 px-4 py-2">
						<h1 className="text-md font-semibold text-gray-800">Upload {loadedFiles?.length} files into the project - {project?.name}</h1>
						<div className="flex items-center gap-2 justify-end">
							<button 
							onClick={()=>setAskConfirm(false)}
							className="text-black px-4 py-2 rounded-lg hover:bg-gray-200/70 
							transition-all duration-200 ease-in-out">Cancel</button>
							<button 
							onClick={startUploading}
							className={`px-4 ${creatingFolder ? 'py-[6px]' : 'py-2'} rounded-lg hover:bg-blue-600 bg-blue-500 text-white 
							transition-all duration-200 ease-in-out`}>{creatingFolder ? <span className="loader1"/> : 'Confirm'}</button>
						</div>
					</div>
				</div>
			</div>

			<div className={`flex fixed flex-col bg-white z-50 rounded-lg border-[1px] border-gray-300 
			${uploadingFilesStarted ? '' : 'h-[0%] w-[0%] overflow-hidden'} right-0 bottom-0`}>
				<div className="flex flex-col px-4 py-2 border-b-[1px] border-gray-200 ">
					<div className="w-full  justify-between flex items-center ">
						<h1 className="text-md font-semibold leading-none text-blue-600">Uploading to {showFolderStatus}</h1>
						<div 
						onClick={()=>setShowUploadingData(!showUploadingData)}
						className="p-1 rounded-full hover:bg-gray-100 cursor-pointer flex items-center justify-center">
							<TbChevronDown className={`h-5 w-5 ${showUploadingData ? 'rotate-0' : 'rotate-180'} transition-all duration-200
							ease-in-out text-gray-800`}/>
						</div>
					</div>
					<h1 className="text-xs font-semibold leading-none mt-1 text-gray-500">Dont refresh or change the tab while upload in progress</h1>
				</div>
				<div className={`w-full flex flex-col ${showUploadingData ? 'h-auto px-4 py-2' : 'h-0 overflow-hidden'} transition-all 
				duration-200 ease-in-out`}>
					<h1 className="text-md font-semibold text-gray-800 flex items-center justify-between gap-5">
						<span>Uploading <span className="text-blue-500">{uploadingFileName}</span> ({uploadingFileNumber}/{loadedFiles?.length})</span>
						<span>{uploadPercentage}%</span>
					</h1>
					<div className="flex pb-1 items-center w-full mt-3">
						<div className="rounded-full h-2 bg-gray-200 w-full overflow-hidden">
							<div
							style={{
								width:`${uploadPercentage}%`
							}}
							className={`h-full bg-gradient-to-r from-purple-500 to-pink-600 
							rounded-full`}/>
						</div>
					</div>
				</div>
			</div>

			<div className="w-full flex sm:flex-row flex-col items-center gap-5 justify-between">
				<h1 className="text-lg font-semibold text-black px-2">Raw data files are uploaded here</h1>
				{
					currentUser?.roles?.includes("pilot") || currentUser?.roles?.includes("processingTeam")  &&
					<button 
					onClick={()=>setOpenUploadTab(true)}
					className="px-5 py-1 bg-blue-500 text-white flex items-center gap-2 rounded-lg border-[1px] border-gray-200">
						Upload
					</button>
				}
			</div>
			<div className="h-[1px] w-[98%] mx-auto my-3 bg-[#EBE8FF]"/>
			{
				project?.folders?.length > 0 ? 
				(
					currentFolders?.length > 0 || currentVideoFolders?.length > 0 ?
					<>
						<div className="w-full flex sm:flex-row flex-col items-center gap-5 justify-between pb-3">
							<div className="flex items-center rounded-lg overflow-hidden ">
								<div 
								onClick={()=>setCurrentFileTab('image')}
								className={`p-1 ${currentFileTab === 'image' ? 'text-gray-100 bg-blue-500' : 'text-gray-700 hover:bg-gray-100/80'} cursor-pointer transition-all 
								duration-200 ease-in-out border-[1px] rounded-l-lg border-gray-300`}>
									<BiImages className="h-5 w-5"/>
								</div>
								<div 
								onClick={()=>setCurrentFileTab('video')}
								className={`p-1 ${currentFileTab === 'video' ? 'text-gray-100 bg-blue-500' : 'text-gray-700 hover:bg-gray-100/80'} cursor-pointer transition-all 
								duration-200 ease-in-out border-[1px] border-l-[0px] rounded-r-lg border-gray-300`}>
									<MdOutlineVideoLibrary className="h-5 w-5"/>
								</div>
							</div>	

							<div className="flex items-center w-[350px] gap-1 p-1 px-2 rounded-lg border-[1px] border-gray-300 hover:border-sky-500 focus-within:border-sky-500">
								<IoMdSearch className="h-[18px] w-[18px] text-gray-800 peer-focus:text-blue-500 "/>
								<input type="text" className="text-sm w-full peer text-gray-800 bg-transparent outline-none placeholder:text-gray-500"
								value={searchValue} onChange={(e)=>setSearchValue(e.target.value)}
								placeholder="Search by name, date, username" disabled={loading}
								/>
							</div>
						</div>
						<div className="w-full overflow-hidden">
							<div className="w-full overflow-y-auto">
								{
									currentFileTab === 'image' ?
									<table className="w-full border-[1px] border-gray-300" >
										<thead>
											<tr className="bg-gray-100 border-b-[1px] border-gray-300 hover:bg-gray-200" >
												<td className="px-4 py-2 text-gray-900 text-center" >
													Folder Name
												</td>
												<td className="px-4 py-2 text-gray-900 text-center">
													Upload Date
												</td>
												<td className="px-4 py-2 text-gray-900 text-center">
													Uploaded By
												</td>
												<td className="px-4 py-2 text-gray-900 text-center">
													Number of files
												</td>
												<td className="px-4 py-2 text-gray-900 text-center">
													Download
												</td>
											</tr>
										</thead>
										<tbody>
											{
												!searchValue ?
												currentFolders?.map((folder,k)=>(
													<FolderComponent folder={folder} key={k} k={k} uploadingFilesStarted={uploadingFilesStarted} 
													showMarkers={showMarkers} setShowMarkers={setShowMarkers} setShowMap={setShowMap}
													project={project}
													/>
												))
												:
												searchResults?.map((folder,k)=>(
													<FolderComponent folder={folder} key={k} k={k} uploadingFilesStarted={uploadingFilesStarted} 
													showMarkers={showMarkers} setShowMarkers={setShowMarkers} setShowMap={setShowMap}
													project={project}
													/>
												))
											}
										</tbody>
									</table>
									:
									<table className="w-full border-[1px] border-gray-300" >
										<thead>
											<tr className="bg-gray-100 border-b-[1px] border-gray-300 hover:bg-gray-200" >
												<td className="px-4 py-2 text-gray-900 text-center" >
													Folder Name
												</td>
												<td className="px-4 py-2 text-gray-900 text-center">
													Upload Date
												</td>
												<td className="px-4 py-2 text-gray-900 text-center">
													Uploaded By
												</td>
												<td className="px-4 py-2 text-gray-900 text-center">
													Number of files
												</td>
												<td className="px-4 py-2 text-gray-900 text-center">
													View
												</td>
											</tr>
										</thead>
										<tbody>
											{
												!videoSearchValue ?
												currentVideoFolders?.map((folder,k)=>(
													<VideoFolderComponent folder={folder} key={k} k={k} 
													project={project} setProject={setProject} 
													setCurrentTab={setCurrentTab}
													/>
												))
												:
												videoSearchResults?.map((folder,k)=>(
													<VideoFolderComponent folder={folder} key={k} k={k} 
													project={project} setProject={setProject} 
													setCurrentTab={setCurrentTab}
													/>
												))
											}
										</tbody>
									</table>
								}
								
							</div>
						</div>
					</>
					:
					<div className="w-full px-5 py-3 flex-col flex items-center justify-center">
						<img src="https://ik.imagekit.io/d3kzbpbila/thejashari_uflabwVd8" alt=""
						className="h-[200px]"/>
						<h1 className="text-gray-600 text-md font-normal">Loading...</h1>
					</div>
				)
				:
				<div className="w-full px-5 py-3 flex-col flex items-center justify-center">
					<img src="https://ik.imagekit.io/d3kzbpbila/thejashari_uflabwVd8" alt=""
					className="h-[200px]"/>
					<h1 className="text-gray-600 text-md font-normal">No raw data are currently uploaded. <span 
					onClick={()=>setOpenUploadTab(true)}
					className="text-blue-500 hover:text-blue-600 cursor-pointer">Upload</span> </h1>
				</div>
			}
			<MapComponent2 
			showMap={showMap} setShowMap={setShowMap} loadedFiles={showMarkers}
			showMarkers={showMarkers} setShowMarkers={setShowMarkers}
			/>
		</div>
	)
}