
import MapWithKml from './MapWithKml'

export default function SiteCard({kml,siteName,k}) {
	
	return (
		<div className="flex flex-col border-[1px] rounded-lg border-gray-700 hover:border-gray-500 hover:bg-gray-800 overflow-hidden cursor-pointer group">
			<div className="w-full overflow-hidden">
				<MapWithKml kml={kml} j={k} />
			</div>
			<div className="flex flex-col gap-1 px-4 py-2 mt-1 gap-2 transition-all duration-200 ease-in-out">
				<h1 className="text-md leading-none font-semibold text-gray-100">{siteName ? siteName : `Site ${k+1}`}</h1>
				

			</div>
		</div>
	)
}