"use client"

import {useState,useEffect} from 'react';

export default function FileCard({file,k}) {
	const [loading,setLoading] = useState(true);
	const [exifData,setExifData] = useState('');

	useEffect(()=>{
		if(file){
			console.log(file)
			setLoading(false);
		}
	},[file])

	return (
		<tr className="hover:bg-gray-800/40 border-b-[1px] border-gray-700 transition-all duration-200 ease-in-out">
			{
				loading ? 
				<>
				<td className="bg-gray-900 px-5 py-4 text-center">
					<p className="text-sm font-medium text-gray-700">{file?.file?.name}</p>
				</td>
				<td className="bg-gray-900 px-5 py-4">
					<span className="loader4"/>
				</td>
				<td className="bg-gray-900 px-5 py-4">
					<span className="loader4"/>
				</td>
				<td className="bg-gray-900 px-5 py-4">
					<span className="loader4"/>
				</td>
				</>
				:
				<>
				<td className="px-5 py-4 text-center">
					<p className="sm:text-sm text-xs font-medium text-gray-200">{file?.file?.path ? file?.file?.path : file?.file?.name ? file?.file?.name : '--'}</p>
				</td>
				<td className="px-5 py-4 text-center">
					<p className="sm:text-sm text-xs font-medium text-gray-200">{file?.exif_data?.latitude ? file?.exif_data?.latitude : '--'}</p>
				</td>
				<td className="px-5 py-4 text-center">
					<p className="sm:text-sm text-xs font-medium text-gray-200">{file?.exif_data?.longitude ? file?.exif_data?.longitude : '--'}</p>
				</td>
				<td className="px-5 py-4 text-center">
					<p className="sm:text-sm text-xs font-medium text-gray-200">{file?.exif_data?.GPSAltitude ? file?.exif_data?.GPSAltitude : '--'}</p>
				</td>
				</>
			}

		</tr>	
	)
}