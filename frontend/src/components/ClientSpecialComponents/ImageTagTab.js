"use client"
import {IoMdSearch} from 'react-icons/io';
import GroupCard from './GroupCard'
import TableRow from './TableRow';
import {useState,useEffect} from 'react';
import {getFoldersById} from '../../utils/ApiRoutes';
import TagSectionFolderTab from './TagSectionFolderTab';
import axios from 'axios';
import {getFilesByFolderId,updateFileTags,createTagGroup,
	updateGroupsInProject,getTagGroups,updateTagsInGroup} from '../../utils/ApiRoutes'
import {BsUpload} from 'react-icons/bs';
import {RxCross2} from 'react-icons/rx';
import {currentUserState} from '../../atoms/userAtom';
import {useRecoilState} from 'recoil';

export default function ImageTagTab({
	currentProject,
	setCurrentProject,
	currentTab,
	setCurrentTab
}) {
	const folders = [
	{
		name:"folder1"
	}
	]
	
	const [currentTableTab,setCurrentTableTab] = useState('all');
	const [currentFolders,setCurrentFolders] = useState([]);
	const [selectedImages,setSelectedImages] = useState([]);
	const [selectedFolder,setSelectedFolder] = useState('');
	const [searchResults,setSearchResults] = useState([]);
	const [searchValue,setSearchValue] = useState(''); 
	const [loading,setLoading] = useState(false);
	const [data,setData] = useState([]);
	const [selectedTags,setSelectedTags] = useState([]);
	const [creatingGroup,setCreatingGroup] = useState(false);
	const [addGroupShow,setAddGroupShow] = useState(false);
	const [groupName,setGroupName] = useState('');
	const [groups,setGroups] = useState([]);
	const [currentUser,setCurrentUser] = useRecoilState(currentUserState);

	const fetchFolders = async(foldersId) => {
		const {data} = await axios.post(getFoldersById,{
			id:foldersId
		})
		if(data.status){
			setCurrentFolders(data?.folder);
		}
	}
	console.log(currentProject)

	const removeFromSelected = (dat) => {
		const idx = selectedImages.findIndex((data)=>{
			return data._id === dat._id
		})
		if(idx > -1){
			let limages = [...selectedImages]
			limages.splice(idx,1)
			setSelectedImages(limages)
		}
	}

	const addToSelected = (dat) => {
		let simages = [...selectedImages,dat]
		setSelectedImages(simages)
	}

	useEffect(()=>{
		fetchFolders(currentProject?.folders)
	},[])

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
	},[searchValue]);

	const fetchFilesInFolder = async(folder) => {
		// console.log(folder)
		const {data} = await axios.post(getFilesByFolderId,{folderId:folder?.folderId});
		if(data?.status){
			// console.log(data)
			setData(data?.file);
			setLoading(false);
		}
	}

	const addToSelectedTags = (tag) => {
		const tempSelectedTags = [...selectedTags,tag];
		setSelectedTags(tempSelectedTags);
	}

	const removeFromSelectedTags = (tag) => {
		const idx = selectedTags.findIndex((ttag)=>{
			if(ttag === tag){
				return true
			}
			return false
		})
		if(idx > -1){
			let tempSelectedTags = [...selectedTags];
			tempSelectedTags.splice(idx,1);
			setSelectedTags(tempSelectedTags);
		}
	}

	const updateSelectedImages = async(i,tempImages) => {
		// console.log(i);
		const {data} = await axios.post(updateFileTags,{
			id:tempImages[i]._id,
			tags:tempImages[i].tags
		})
		if(data.status){
			console.log(data);
		}
		fetchFilesInFolder(selectedFolder)
		if(i+1 === tempImages?.length){
		
		}else{
			updateSelectedImages(i+1,tempImages)
		}
	}

	const assignTags = () => {
		let tempImages = [...selectedImages];
		for(let i = 0; i < selectedImages?.length; i++){
			let tempTags = [...selectedImages[i].tags,...selectedTags];
			tempTags = [...new Set(tempTags)]
			let tempImage = {
				...selectedImages[i],
				tags:tempTags
			};
			tempImages[i] = tempImage
			tempImages[i] = tempImage

			if(i + 1 === selectedImages?.length){
				setSelectedImages(tempImages)
				updateSelectedImages(0,tempImages);
			}
		}
	}

	const removeTags = () => {
		let tempImages = [...selectedImages];
		for (let i = 0;i < selectedImages?.length; i++){
			let tempTags = selectedImages[i].tags;
			tempTags = tempTags.filter(function(item) {
			    return !selectedTags.includes(item)
			})
			let tempImage = {
				...selectedImages[i],
				tags:tempTags
			}
			tempImages[i] = tempImage

			if(i + 1 === selectedImages?.length){
				setSelectedImages(tempImages)
				updateSelectedImages(0,tempImages);
			}
		}
	}

	const fetchTagGroups = async() => {
		const {data} = await axios.post(getTagGroups,{
			groups:currentProject?.groups
		})
		if(data.status){
			setGroups(data?.tagGroup)
		}
	}

	const updateGroupsInProjectFunc = async(tagGroup) => {
		
		let tempgroups = currentProject?.groups ? [...currentProject?.groups,tagGroup?._id] :  [tagGroup?._id];
		
		console.log(tempgroups)
		const {data} = await axios.post(updateGroupsInProject,{
			groups:tempgroups,
			id:currentProject?._id
		})
		console.log(data);
		if(data.status){
			setCreatingGroup(false);
			setAddGroupShow(false);
			setGroupName('');
			setCurrentProject(data?.project);
		}else{
			alert("Something went wrong!")
		}
	}

	const createTagGroupFunc = async() => {
		setCreatingGroup(true);
		const {data} = await axios.post(createTagGroup,{
			name:groupName,
			projectId:currentProject._id,
			createdUser:currentUser?._id
		})
		if(data.status){
			updateGroupsInProjectFunc(data?.tagGroup)
		}
	}

	const addTagsToGroup = async(group,tagInput) => {
		const tags = [...group.tags,tagInput];
		const {data} = await axios.post(updateTagsInGroup,{
			id:group?._id,
			tags:tags
		})
		if(data.status){
			fetchTagGroups();
		}else{
			alert(`Cant add tag - ${tagInput} to group - ${group?.name}`);
		}
	}

	useEffect(()=>{
		setLoading(true);
		fetchFilesInFolder(selectedFolder)
	},[selectedFolder]);

	useEffect(()=>{
		fetchTagGroups()
	},[currentProject])

	return(
		<div className="w-full overflow-auto h-full pt-[70px]">
			<div className={`fixed top-0 flex items-center justify-center left-0 ${addGroupShow ? 'h-full w-full' : 'h-0 w-0' } overflow-hidden bg-black/60
			transition-all duration-200 ease-in-out`}>
				<div className="relative rounded-lg w-[300px] overflow-hidden border-[1px] border-gray-300 bg-gray-900">
					{
						creatingGroup && 
						<div className="absolute top-0 flex items-start justify-center bg-black/40 left-0 h-full w-full">
							<span className="loader7"/>
						</div>
					}
					<div className="px-5 py-2 flex items-center border-b-[1px] border-gray-600 justify-between">
						<h1 className="text-md font-normal text-gray-200">Add Group</h1>
						<div 
						onClick={()=>{setAddGroupShow(false);setGroupName('')}}
						className="rounded-full cursor-pointer hover:bg-gray-800/80 flex items-center justify-center p-1">
							<RxCross2 className="h-5 w-5 text-gray-300"/>
						</div>
					</div>
					<div className="px-3 flex flex-col py-3">
						<div className="rounded-lg px-3 py-1 bg-gray-800/70 border-[1px] border-gray-600 focus-within:border-sky-500">
							<input type="text" className="bg-transparent outline-none w-full text-md text-gray-200"
							placeholder="Enter Group Name" value={groupName} onChange={(e)=>{
								setGroupName(e.target.value)
							}} />
						</div>
					</div>
					<div className="px-3 pt-1 pb-2 flex items-center justify-end">
						<button onClick={()=>{
							if(groupName.length > 0){
								createTagGroupFunc()
							}
						}} className="px-4 py-1 bg-green-600 rounded-md text-white">Confirm</button>
					</div>
				</div>
			</div>
			<div className="w-full flex items-start gap-5 px-5">
				<div className="w-[30%] flex flex-col p-3 rounded-lg">
					<div className="w-full px-3 py-2 rounded-md border-[1px] border-gray-600 bg-gray-900/50 overflow-hidden flex items-center gap-2">
						<IoMdSearch className="h-4 w-4 text-gray-300"/>
						<input type="text" className="bg-transparent outline-none w-full text-gray-100 placeholder:text-gray-400 text-sm"
						placeholder="Search Tags"/>
					</div>
					<p className="text-[11px] text-gray-400 py-3 px-1" >
						Select your tags below and either single select, polygon select or position select which images you would like to assign them to. Once you have made your selection click assign.
					</p>
					<div className="h-[220px] gap-3 w-full flex flex-col overflow-y-auto scrollbar-none">
						{
							groups?.map((group,j)=>(
								<GroupCard group={group} j={j} key={j} selectedTags={selectedTags}
								addToSelectedTags={addToSelectedTags} removeFromSelectedTags={removeFromSelectedTags}
								addTagsToGroup={addTagsToGroup}
								/>
							))
						}
						<button 
						onClick={()=>setAddGroupShow(!addGroupShow)}
						className="w-full py-2 rounded-lg text-blue-500 border-[1px] bg-black/20 border-gray-600 text-sm hover:bg-blue-800/20 font-semibold">
							Add Group
						</button>

					</div>
					<div className="w-full flex items-center justify-end gap-2 px-1 py-2">
						<button onClick={()=>{
							if(selectedImages?.length > 0 && selectedImages?.length > 0){
								removeTags()
							}
						}} className={`px-4 py-2 rounded-md text-red-500 text-xs bg-gray-700/60 hover:bg-gray-700/90
						${selectedTags?.length > 0 && selectedImages.length > 0 ? 'opacity-[100%]' : 'opacity-[70%]'} transition-all duration-200 ease-in-out`}>
							Remove
						</button>
						<button onClick={()=>{
							if(selectedImages?.length > 0 && selectedImages?.length > 0){
								assignTags()
							}
						}} className={`px-4 py-2 rounded-md text-green-500 text-xs bg-gray-700/60 hover:bg-gray-700/90 
						${selectedTags?.length > 0 && selectedImages.length > 0 ? 'opacity-[100%]' : 'opacity-[70%]'} transition-all duration-200 ease-in-out`}>
							Assign
						</button>
					</div>

				</div>

				<div className="w-[30%] flex flex-col p-3 rounded-lg">
					<div className="w-full px-3 py-2 rounded-md border-[1px] border-gray-600 bg-gray-900/50 overflow-hidden flex items-center gap-2">
						<IoMdSearch className="h-4 w-4 text-gray-300"/>
						<input type="text" className="bg-transparent outline-none w-full text-gray-100 placeholder:text-gray-400 text-sm"
						placeholder="Search by name and date" value={searchValue} 
						onChange={(e)=>setSearchValue(e.target.value)} />
					</div>
					<p className="text-[14px] text-gray-400 py-3 px-1" >
						Select the folder to filter the files.
					</p>
					<div className="h-[290px] bg-gray-800/50 p-2 rounded-lg border-[1px] flex flex-col 
					gap-3 border-gray-700 overflow-y-auto scrollbar-none scrollbar-thin">
						{
							searchValue ?
							searchResults.map((folder,k)=>(
								<TagSectionFolderTab folder={folder} key={k} k={k}
								selectedFolder={selectedFolder} setSelectedFolder={setSelectedFolder}
								/>
							))
							:
							currentFolders?.map((folder,k)=>(
								<TagSectionFolderTab folder={folder} key={k} k={k}
								selectedFolder={selectedFolder} setSelectedFolder={setSelectedFolder}
								/>
							))
						}
						<button 
						onClick={()=>setCurrentTab('upload')}
						className="w-full flex items-center bg-gray-900 hover:bg-black/60 hover:border-blue-600 hover:text-sky-400
						justify-center gap-2 px-5 text-sm py-2 rounded-md border-[1px] border-gray-500 text-gray-400">
							<BsUpload className="h-4 w-4"/>
							Upload 
						</button>
						
					</div>

				</div>

			</div>
			<div className="w-full px-8 pb-5 flex flex-col">
				<div className="flex items-center">
					<button onClick={()=>setCurrentTableTab('all')} className={`hover:bg-gray-800/60 text-xs border-b-[2px] px-3 py-2 ${currentTableTab === 'all' ? 'border-blue-500 text-blue-500':'border-transparent text-gray-300'}`}>
						All Images
					</button>
					<button onClick={()=>setCurrentTableTab('selected')} className={`hover:bg-gray-800/60 text-xs flex items-center gap-1 border-b-[2px] px-3 py-2 ${currentTableTab === 'selected' ? 'border-blue-500 text-blue-500':'border-transparent text-gray-300'}`}>
						Selected Images 
						{
							selectedImages?.length > 0 &&
							<div className="block">
								<div className="p-1 rounded-full aspect-square flex items-center justify-center 
								h-[18px] w-[18px] bg-blue-600 text-white text-xs">
									{selectedImages?.length}
								</div>
							</div>
						}
					</button>
				</div>
				
	            <div class="overflow-x-auto mt-4 relative shadow-md sm:rounded-lg">
		            <table class="w-full text-sm text-left text-gray-200">
		                <thead class="text-xs text-gray-700 uppercase bg-gray-800 text-gray-400">
			                <tr>
			                    <th class="py-3 pl-6">Thumbnail</th>
			                    <th class="py-3">Name</th>
			                    <th class="py-3 px-6">Date Taken</th>
			                    <th class="py-3 px-2">Date Uploaded</th>
			                    <th class="py-3 px-2">Severities</th>
			                    <th class="py-3 px-6 w-[230px]">Tags</th>
			                	<th class="px-2 m-0"></th>
			                </tr>
		                </thead>
		                <tbody>
		                {
		                	currentTableTab === 'all' ?
		                	data?.map((dat,k)=>(
		                		<TableRow dat={dat} k={k} key={k} selectedImages={selectedImages}
		                		removeFromSelected={removeFromSelected} selectedFolder={selectedFolder}
								addToSelected={addToSelected} currentTableTab={currentTableTab}
		                		/>
		                	))
		                	:
		                	selectedImages?.map((dat,k)=>(
								<TableRow dat={dat} k={k} key={k} selectedImages={selectedImages}
		                		removeFromSelected={removeFromSelected} selectedFolder={selectedFolder}
								addToSelected={addToSelected} currentTableTab={currentTableTab}
		                		/>
		                	))
		                }
		                
		                <tr class="bg-gray-900">
		                    <td class="py-4 px-6">Ethan Davis</td>
		                    <td class="py-4 px-6">64738290</td>
		                    <td class="py-4 px-6">$865.00</td>
		                    <td class="py-4 px-6">No</td>
		                </tr>
		                </tbody>
		            </table>
	            </div>
				    


			</div>

		</div>
	)
}