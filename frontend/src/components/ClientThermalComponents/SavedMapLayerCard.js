'use client'

import {useState} from 'react';
import { VscListSelection } from "react-icons/vsc";

export default function SavedMapLayerCard({
	mapLayer,
	k,
	TfiLocationPin,
	setShowIssueDetails,
	setCurrentOpenIssueIndex
}) {
	const [moreDetails,setMoreDetails] = useState(false);	

	return(
		<div key={k} className="w-full p-2 rounded-lg border-[1px] border-gray-700 hover:bg-gray-900
		transition-all duration-200 bg-gray-800 ease-in-out hover:border-sky-600 flex flex-col">
			<div className="px-2 pb-1 border-b-[1px] border-gray-700 flex items-center justify-between gap-2">
				<h1 className="text-md font-semibold text-gray-100">{mapLayer?.issueName}</h1>
				<div onClick={()=>{
			    	setShowIssueDetails(mapLayer);
			    	setCurrentOpenIssueIndex(k);
				}} className="p-1 rounded-lg text-gray-200 cursor-pointer hover:text-gray-100 ">
					<VscListSelection className="h-4 w-4"/>
				</div>
			</div>
			{
				moreDetails &&
				<>

					<div className="text-md flex flex-col gap-2 py-2 pb-0">
						<p className="text-sm text-gray-200 px-2">
							Issue Type : {mapLayer?.issueType}
						</p>
					</div>
					<div className="flex py-2 pb-0 flex-col gap-2">
						{
							['polygon','polyline','rectangle'].includes(mapLayer?.type) &&
							<div className="text-md flex flex-col gap-2 border-b-[1px] border-gray-700 pb-2">
								{
									mapLayer?.squareKm &&
									<p className="text-sm text-gray-200 px-2">
										<span className="truncate">{mapLayer?.squareKm?.toFixed(5)}</span> Sq.km
									</p>
								}
								{
									mapLayer?.area &&
									<p className="text-sm text-gray-200 px-2">
										<span className="truncate">{mapLayer?.area?.toFixed(5)}</span> Sq.meters
									</p>
								}
								{
									mapLayer?.km &&
									<p className="text-sm text-gray-200 px-2">
										{mapLayer?.km?.toFixed(5)} KM
									</p>
								}
							</div>
						}
						{
							moreDetails && mapLayer?.latlngs ? 
							mapLayer?.latlngs?.map((latlng,j)=>(
								<p key={j} className="text-xs text-gray-300 flex items-center gap-1 break-word">
									<TfiLocationPin className="h-6 w-6"/> Lat:-{latlng?.lat} Lng:-{latlng?.lng}
								</p>
							))
							:
							moreDetails &&
							<p className="text-xs text-gray-300 flex items-center gap-1 break-word">
								<TfiLocationPin className="h-6 w-6"/> Lat:-{mapLayer.latlng?.lat} Lng:-{mapLayer.latlng?.lng}
							</p>

						}

					</div>
				</>
			}
			<h1 onClick={()=>setMoreDetails(!moreDetails)} 
			className="text-blue-600 cursor-pointer pt-2 px-1 m-0 text-xs">{moreDetails ? 'Less' : 'More'} Details...</h1>

		</div>
	)
}