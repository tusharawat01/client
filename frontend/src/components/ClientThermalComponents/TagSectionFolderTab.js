"use client"
import {useState,useEffect} from 'react';
import axios from 'axios';
import {getFilesByFolderId} from '../../utils/ApiRoutes';
import {PiImages} from 'react-icons/pi';
import {MdOutlineDateRange} from 'react-icons/md';



export default function TagSectionFolderTab({
	folder,k,selectedFolder,setSelectedFolder
}) {
	
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

	useEffect(()=>{
		if (folder) {
			fetchFilesInFolder(folder)
		}
	},[folder])


	return (
		<div 
		onClick={()=>setSelectedFolder(folder)}
		className={`rounded-lg flex justify-around items-center flex-wrap rounded-md hover:bg-gray-900/40 
		cursor-pointer p-2 gap-4 border-[1px] 
		${selectedFolder?.folderId === folder?.folderId ? 'border-sky-500 bg-gray-950' : 'border-gray-500 bg-gray-900'}`}>
			<h1 className={`text-md font-normal 
			${selectedFolder?.folderId === folder?.folderId ? 'text-blue-400' : 'text-gray-100'} `}>
				{folder?.name}
			</h1>
			<div className="flex items-center gap-1">
				<PiImages className="h-5 w-5 text-gray-400"/>
				<h1 className="text-sm font-normal text-gray-400">{allFiles?.length}</h1>
			</div>
			<div className="flex items-center gap-1">
				<MdOutlineDateRange className="h-5 w-5 text-gray-400"/>
				<h1 className="text-sm font-normal text-gray-400">{folder?.folderCreatedDate}</h1>
			</div>
		</div>
	)
}