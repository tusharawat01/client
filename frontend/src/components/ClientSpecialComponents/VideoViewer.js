'use client'
import ReactPlayer from 'react-player';
import {useState,useRef} from 'react';
import {host} from '../../utils/ApiRoutes'

export default function VideoViewer({
	store
}) {
	const [error,setError] = useState('');
	const videoRef = useRef(null);
	
	if(store) return (
		<div className="w-full p-14 h-full flex items-center justify-center">
			<div className={`w-full aspect-video shadow-lg shadow-blue-500/20`}>
				{
					error ?
					<div className="w-full h-full bg-gray-800 flex items-center justify-center p-4">
						<p className="text-gray-200 text-md">
							file : {store} was not found or under processing, try again later
						</p>
					</div>
					:
					<ReactPlayer
				        url={`${host}${store}`}
				        ref={videoRef}
				        id="video"
				        onError={(error) => {setError(error)}}
				        controls className="relative z-1"
				        width="100%"
				        height="100%"
				    />
				}
			</div>
		</div>
	)
}