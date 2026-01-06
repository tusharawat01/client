"use client"
import ClientCardMain from './ClientCardMain';
import {getClientById} from '../../utils/ApiRoutes';
import axios from 'axios';
import {useState,useEffect} from 'react'

// let teamMembers = [];

export default function TeamInfoMain({project}) {
	// body...
	const [loading,setLoading] = useState(true);
	const [teamLoaded,setTeamLoaded] = useState(false);
	const [teamMembers,setTeamMembers] = useState([]);


	const fetchMember = async(arr = [], j = 0) => {
		const {data} = await axios.post(getClientById,{
			clientId:project?.teamMembers[j]._id
		})

		if(data?.status){
			let newArr = [data?.user,...arr];
			if(j+1 < project?.teamMembers?.length){
				fetchMember(newArr,j+1);
				setLoading(false);
			}else{
				setTeamMembers(newArr);
			}
		}else{
			setLoading(false);
			alert("Something went wrong!")
		}
	}


	useEffect(()=>{
		if(project && !teamLoaded){			
			// teamMembers = [];
			if(project?.teamMembers?.length > 0){
				fetchMember();
			}else{
				setLoading(false);
			}
			setTeamLoaded(true);
		}
	},[project])

	

	return (
		<main className="w-full md:px-5 px-2">
			<h1 className="text-xl text-black">
				Team members
			</h1>
			<div className="w-full h-[1px] bg-gray-300 mt-1"/>
			<div className="gap-4 mt-4 grid xl:grid-cols-5 lg:grid-cols-4 sm:grid-cols-3 grid-cols-1">
				<ClientCardMain client={project?.clientDetails} j="200" />
				{
					teamMembers?.map((client,j)=>(
						<ClientCardMain key={j} client={client} j={j} />
					))
				}
				{
					loading &&
					<div class="flex items-center bg-white shadow-md px-3 py-10 shadow-gray-300/50 
					justify-center w-full border border-gray-200 rounded-lg bg-gray-50">
					    <span className="loader6" />
					</div>
				}
				
			</div>
		</main>

	)
}