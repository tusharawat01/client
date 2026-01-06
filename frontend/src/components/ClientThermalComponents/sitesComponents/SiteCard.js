

export default function SiteCard({
	site,showProject,removeProject
}) {
	
	console.log(site);
	return (
		<div className="w-full flex items-center rounded-lg px-3 py-2 border-[1px] border-gray-600
		hover:bg-gray-900 transition-all duration-100 ease-in-out bg-gray-950
		">
			<div className="flex flex-col gap-1 w-full">
				<div className="flex items-center gap-2 justify-between">
					<div className="w-full flex flex-col gap-1">
						<h1 className="text-md font-semibold text-gray-100 leading-none">{site?.split("/")[site?.split("/")?.length - 1].replace(/_/g, ' ')}</h1>
					</div>
					<div className="p-2 flex items-center justify-center">
						<label class="container">
						  <input type="checkbox" onChange={(e)=>{
						  	if(e.target.checked){
						  		showProject(site);
						  	}else{
						  		removeProject(site);
						  	}
						  }} />
						  <div class="checkmark"></div>
						</label>
					</div>
				</div>
			</div>


		</div>
	)
}