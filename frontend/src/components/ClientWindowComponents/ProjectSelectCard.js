import {useRouter} from 'next/navigation';

export default function ProjectSelectCard({
	project,k,mainTab,setMainTab,currentUser
}) {
	
	const router = useRouter();

	return (
		<div className="flex flex-col items-center justify-center gap-3">
			<div 
			onClick={()=>{
				if(project?.name === 'Construction'){
					setMainTab(project?.tag)
					// router.push(`/client/${currentUser?.name}`)
				}else{
					setMainTab(project?.tag)
				}
			}}
			className="h-[170px] w-[170px] rounded-full cursor-pointer overflow-hidden
			hover:shadow-lg hover:shadow-blue-500/40">
				<img src={project?.image} alt=""
				className="h-full w-full object-cover rounded-full hover:scale-[110%] transition-all duration-200 ease-in-out"/>
			</div>
			<h1 className="text-md font-semibold text-gray-100">
				{project?.name}
			</h1>
		</div>	
	)
}