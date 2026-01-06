"use client"
import {useState,useEffect,useRef} from 'react';
import ReactPlayer from 'react-player'
import axios from 'axios';
import {getFilesByFolderId} from '../../utils/ApiRoutes';
import {MdOutlineChevronRight} from 'react-icons/md';
import {HiOutlineDownload} from 'react-icons/hi';
import { FaArrowRight } from "react-icons/fa6";
import {RxCross2} from 'react-icons/rx';
import VideoFolderPlayerComponent from './VideoFolderPlayerComponent';

export default function FolderComponent({folder,project,setProject,
	setCurrentTab,setCloseHeader}) {

	const [loading,setLoading] = useState(true);
	const [allFiles,setAllFiles] = useState([]);
	const [openFolder,setOpenFolder] = useState(false);
	const videoRef = useRef(null);

	const fetchFilesInFolder = async(folder) => {
		const {data} = await axios.post(getFilesByFolderId,{folderId:folder?.folderId});
		if(data?.status){
			setAllFiles(data?.file);
			setLoading(false)
		}
	}

	function downloadKML(data, filename) {
	  const blob = new Blob([data], { type: 'application/xml' });
	  const link = document.createElement('a');
	  link.href = window.URL.createObjectURL(blob);
	  link.download = filename;
	  link.click();
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
		<tr className="bg-gray-800 group border-b-[1px] border-gray-500 hover:bg-gray-800/70">
			<td className="px-4 py-2 text-center" >
				<h1 className="text-sm font-semibold text-gray-200">{folder?.name}</h1>
			</td>
			<td className="px-4 py-2 text-center" >
				<h1 className="text-sm font-semibold text-gray-200">{folder?.folderCreatedDate}</h1>
			</td>
			<td className="px-4 py-2 text-center" >
				<h1 className="text-sm font-semibold text-gray-200">{folder?.userDetails?.name}</h1>
			</td>
			<td className="px-4 py-2 text-center ">
				<h1 className="text-sm font-semibold text-gray-200">{allFiles?.length}</h1>
			</td>
			<td className="px-4 py-2 text-center relative ">
				
				{
					loading ? 
					<span className="loader4"/>
					:
					<h1 onClick={()=>{
						setOpenFolder(true);
					}}
					className="text-sm cursor-pointer font-semibold w-full text-center text-gray-200 hover:text-blue-500 flex 
					items-center gap-1 cursor-pointer justify-center">
						Open
						<FaArrowRight className="h-4 w-4"/>
					</h1>
				}
			</td>
			<div className={`fixed top-0 ${openFolder ? 'left-0' : '-left-[100%]'} h-full z-50 transition-all duration-200 
			ease-in-out w-full bg-black/40 p-5 flex items-center justify-center`}>
				<div className="w-[800px] bg-gray-50 rounded-lg border-[1px] max-h-[90%] overflow-y-auto border-gray-300 flex flex-col">
					<div className="w-full flex items-center justify-between gap-3 px-4 py-2 border-b-[1px] border-gray-300">
						<h1 className="text-md font-semibold text-gray-900">{folder?.name}</h1>
						<div onClick={()=>{setOpenFolder(false)}} className="p-1 rounded-full 
						hover:bg-gray-200 cursor-pointer transition-all duration-200 ease-in-out">
							<RxCross2 className="h-5 w-5 text-gray-900"/>
						</div>
					</div>
					<div className="grid xl:grid-cols-3 py-3 px-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-3">
						{
							allFiles?.map((file,k)=>(
								<VideoFolderPlayerComponent file={file} k={k} key={k} ReactPlayer={ReactPlayer}
								project={project} setProject={setProject} setOpenFolder={setOpenFolder}
								setCurrentTab={setCurrentTab} setCloseHeader={setCloseHeader}
								/>
							))
						}
					</div>


				</div>
			</div>
		</tr>
	)
}