"use client"

import {useState,useEffect} from 'react';
import {IoMdPricetags} from 'react-icons/io';
import Image from "next/image";

export default function TableRow({
	dat,k,removeFromSelected,addToSelected,selectedImages,currentTableTab,selectedFolder
}) {
	const [selected,setSelected] = useState(false);

	useEffect(()=>{
		const idx = selectedImages?.findIndex((image)=>{
			if(image._id === dat?._id){
				return true
			}
			return false
		})
		if(idx > -1){
			setSelected(true)
		}else{
			setSelected(false);
		}
	},[selectedImages,currentTableTab,selectedFolder,dat])

	return (
		<tr onClick={()=>{
			const idx = selectedImages?.findIndex((image)=>{
				if(image._id === dat?._id){
					return true
				}
				return false
			})
			if(idx > -1){
				removeFromSelected(dat);
			}else{
				addToSelected(dat);
			}
		}} key={k}
		class="cursor-pointer border-b bg-gray-900 border-gray-700 hover:bg-gray-800/60 ">
	        <td class="py-3 pl-6">
	        	<Image loading='lazy' height={58} width={80}  src={dat?.url} alt="" 
	        	className="object-cover rounded-lg h-12"/>
	        </td>
	        <td class="py-4 truncate text-xs truncate">{dat?.name}</td>
	        <td class="py-4 px-6">{dat?.exif_data?.CreateDate?.split('T')?.[0]}</td>
	        <td class="py-4 px-2">{dat?.createdAt?.split('T')?.[0]}</td>
	        <td class="py-4 px-2">{dat?.serverities ? dat?.serverities : '--' }</td>
	        <td class="py-4 px-6">
		       	<div className="flex gap-[6px] flex-wrap">
			        {
			        	dat?.tags?.length > 0 ? 
			        	dat?.tags?.map((tag,k)=>(
			        		<div key={k} className="border-[1px] w-auto cursor-pointer ease transition-all duration-100 gap-1 border-gray-400 rounded-full 
			        		flex items-center px-2 py-1 bg-gray-600/40 hover:bg-gray-600/70 text-gray-400 hover:border-gray-400 hover:text-gray-200">
			        			<IoMdPricetags className="h-3 w-3"/>
			        			<span className="text-xs truncate">{tag}</span>
			        		</div>
			        	))
			        	:
			        	'--' 
			        }
		       	</div>
	        </td>
	        <td class="px-2 m-0">
	        	<div class="flex items-center">
				    <input id="checked-checkbox" checked={selected} type="checkbox" value="" className="rounded-md w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 
				    dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
				</div>
	        </td>
	    </tr>
	)
}