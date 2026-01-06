import { LiaIndustrySolid } from "react-icons/lia";
import { IoLocationOutline } from "react-icons/io5";
import {TbMapPin2} from 'react-icons/tb';
import { GiDuration } from "react-icons/gi";
import { MdOutlineGroupWork, MdOutlineDateRange } from "react-icons/md";

export default function ProjectRequestCard({
	request
}) {
	

	return(
		<div className="border-[1px] hover:bg-gray-900 transition-all duration-200 ease-in-out 
		border-gray-700 hover:border-gray-500 flex flex-col rounded-lg" >
			<div className="flex items-center justify-between border-b-[1px] px-4 py-2 border-gray-700/70 gap-2">
				<h1 className="text-md font-semibold text-gray-100">
					{request?.name}
				</h1>
				<div className="rounded-full hover:bg-gray-800/60 transition-all duration-200 
				ease-in-out">
					{/*Reserved for delete button*/}
				</div>
			</div>

			<div className="flex flex-col gap-1 px-3 py-2">
				

				<h1 className="flex items-center text-md text-white gap-1">
					<MdOutlineGroupWork className="h-4 w-4"/>
					{request?.type}
				</h1>

				<h1 className="flex items-center text-md text-white gap-1">
					<LiaIndustrySolid className="h-4 w-4"/>
					{request?.industry}
				</h1>

				<h1 className="flex items-center text-md text-white gap-1">
					<MdOutlineDateRange className="h-4 w-4 text-gray-300"/>
					{request?.updatedAt?.split("T")?.[0]}
				</h1>

				<h1 className="flex items-center text-md text-white gap-1">
					<GiDuration className="h-4 w-4"/>
					{request?.startDate} - {request?.deadline}
				</h1>

				<h1 className="flex items-center text-md text-white gap-1">
					<IoLocationOutline className="h-4 w-4"/>
					{request?.projectLocation || request?.projectArea}
				</h1>

				<h1 className="flex items-center text-sm text-white gap-1">
					<TbMapPin2 className="h-4 w-4"/>
					{parseFloat(request?.coordinates?.latitude).toFixed(5)}, {parseFloat(request?.coordinates?.longitude).toFixed(5)}
				</h1>

				<div className="flex md:flex-row flex-col gap-2 justify-around py-1">
					<div className="flex flex-col gap-1 items-center">
						<h1 className='text-sm text-gray-200'>Attachments</h1>
						<p className="text-md font-mono text-gray-300">{request?.attachments?.length}</p>
					</div>
					<div className="flex flex-col gap-1 items-center">
						<h1 className='text-sm text-gray-200'>KML / KMZ</h1>
						<p className="text-md font-mono text-gray-300">{request?.kmlkmzFiles?.length}</p>
					</div>
				</div>	

				<h1 className="flex items-center text-sm text-gray-400 mt-1 gap-1">
					{request?.scope}
				</h1>

				<div className="flex flex-col gap-2 mt-2 py-1">
					<div className="w-full flex items-center justify-between">
					<h1 className="leading-none text-sm font-mono text-gray-200">
						Request Status
					</h1>
					<h1 className="leading-none text-sm font-mono text-gray-200">
						{request?.status}
					</h1>
					</div>

					<div className="w-full h-2 overflow-hidden rounded-full bg-gray-700">
						<div style={{
							width:`${request?.status?.toLowerCase() === 'under review' ? '20' : request?.status?.toLowerCase() === 'feasability study' ? '45' : request?.status?.toLowerCase() === 'client discussion' ? '75' : '90'}%`
						}}
						className="h-full bg-gradient-to-r from-purple-500 to-pink-600"/>
					</div>

				</div>

			</div>


		</div>
	)
}