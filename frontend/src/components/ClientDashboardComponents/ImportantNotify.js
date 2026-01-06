import {AiFillMessage,AiOutlinePlus} from 'react-icons/ai';
import {MdNotifications} from 'react-icons/md'; 
import {PiCalendarBlankFill} from 'react-icons/pi';


export default function ImportantNotify() {
	// body...


	return(
		<main className="w-full mt-5 md:px-8 px-4" >
			<div className="w-full px-5 py-3 grid lg:grid-cols-4 grid-cols-2 
			gap-3 bg-white rounded-xl shadow-xl shadow-gray-200/50">
				<div className="rounded-lg p-4 gap-3 bg-yellow-100/60 flex cursor-pointer hover:scale-[103%] transition-all duration-200 ease-in-out ">
					<div className="flex items-center justify-center">
						<div className="m-auto rounded-full bg-gradient-to-b p-2 from-yellow-500 
						via-yellow-400 to-yellow-200">
							<MdNotifications className="h-4 w-4 text-white"/>
						</div>
					</div>
					<div className="flex flex-col gap-1">
						<h1 className="text-[15px] leading-none font-semibold text-black">Notification</h1>
						<p className="text-xs leading-sm font- text-yellow-700 ">1 unread notification</p>	
					</div>
				</div>
				<div className="rounded-lg p-4 gap-3 bg-green-100/60 flex cursor-pointer hover:scale-[103%] transition-all duration-200 ease-in-out">
					<div className="flex items-center justify-center">
						<div className="m-auto rounded-full bg-gradient-to-b p-2 from-green-500 
						via-green-400 to-green-200">
							<AiFillMessage className="h-4 w-4 text-white"/>
						</div>
					</div>
					<div className="flex flex-col gap-1">
						<h1 className="text-[15px] leading-none font-semibold text-black">Message</h1>
						<p className="text-xs leading-sm font- text-green-700 ">5 unread message</p>	
					</div>
				</div>

				<div className="rounded-lg p-4 gap-3 bg-indigo-100/60 flex cursor-pointer hover:scale-[103%] transition-all duration-200 ease-in-out">
					<div className="flex items-center justify-center">
						<div className="m-auto rounded-full bg-gradient-to-b p-2 from-indigo-500 
						via-indigo-400 to-indigo-200">
							<PiCalendarBlankFill className="h-4 w-4 text-white"/>
						</div>
					</div>
					<div className="flex flex-col gap-1">
						<h1 className="text-[15px] leading-none font-semibold text-black">Calendar</h1>
						<p className="text-xs leading-sm font- text-indigo-700 ">No new tasks</p>	
					</div>
				</div>
				<div className="rounded-lg p-4 gap-3 bg-blue-700 flex cursor-pointer 
				items-center hover:scale-[103%] transition-all duration-200 ease-in-out">
					<div className="flex items-center justify-center">
						<div className="m-auto rounded-full bg-white p-2">
							<AiOutlinePlus className="h-4 w-4 text-blue-700"/>
						</div>
					</div>
					<div className="">
						<h1 className="text-md leading-none font-bold text-white">Create New Site</h1>
					</div>
				</div>

			</div>

		</main>
	)
}