"use client"

import {IoMdSearch,IoMdPricetags} from 'react-icons/io';
import {FiPlus} from 'react-icons/fi';
import {useState,useEffect} from 'react';


export default function GroupCard({
	group,j,selectedTags,addToSelectedTags,removeFromSelectedTags,addTagsToGroup
}) {
	const [openAddTag,setOpenAddTag] = useState(false);
	const [tagInput,setTagInput] = useState('');

	return (
		<div key={j} className="py-2 px-1 rounded-md gap-2 border-[1px] border-gray-500 flex flex-col bg-gray-900/70" >
			<div className="flex items-center w-full px-3 py-1 gap-5 justify-between">
				<p className="text-sm font-semibold text-gray-300">{group?.name}</p>
				<div className="flex items-center gap-1">
					<p className="text-xs text-gray-300" >{group?.tags?.length} tags</p>
					<div 
					onClick={()=>setOpenAddTag(!openAddTag)}
					className="p-[2px] hover:bg-gray-500/50 cursor-pointer flex items-center rounded-full transition-all 
					duration-200 ease justify-center">
						<FiPlus className="h-3 w-3 text-gray-300"/>
					</div>
				</div>
			</div>
			{
				openAddTag &&
				<form onSubmit={(e)=>e.preventDefault()} 
				className="flex items-center justify-between gap-2 px-3">
					<div className="px-2 py-1 w-full border-[1px] border-gray-600 rounded-md">
						<input type="text" placeholder="Add New" className="outline-none text-sm bg-transparent text-gray-300 
						placeholder:text-gray-500" value={tagInput} onChange={(e)=>setTagInput(e.target.value)}
						/>
					</div>
					<button 
					onClick={()=>{
						if(tagInput?.length>0){
							addTagsToGroup(group,tagInput);
							setTagInput('');
							setOpenAddTag(false);
						}
					}}
					className="text-xs text-gray-300 hover:bg-black/40 transition-all duration-200 
					ease-in-out px-3 py-2 rounded-md border-gray-500 border-[1px]">
						Add
					</button>
				</form>
			}
			{
				group?.tags?.length > 0 &&
				<div className="w-full flex items-center px-3 py-1 flex-wrap gap-2">
					{
						group?.tags?.map((tag,k)=>(
							<div key={k} onClick={()=>{
								if(selectedTags.includes(tag)){
									removeFromSelectedTags(tag)
								}else{
									addToSelectedTags(tag)
								}
							}} 
							className={`p-1 border-[1px] border-gray-600 px-2 flex items-center gap-1 rounded-full 
							transition-all duration-100 ease ${selectedTags?.includes(tag) ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-gray-600/40 hover:bg-gray-600/70 text-gray-300'}  
							text-xs cursor-pointer`}>
								<IoMdPricetags className="h-3 w-3"/>
								{tag}
							</div>
						))
					}
				</div>
			}

		</div>
	)
}