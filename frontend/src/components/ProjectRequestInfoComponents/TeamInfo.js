"use client"
import ClientCard from './ClientCard';
import {getClientById} from '../../utils/ApiRoutes';
import axios from 'axios';
import {useState,useEffect} from 'react'

// let teamMembers = [];

export default function TeamInfo({request}) {
	// body...
	const [loading,setLoading] = useState(true);
	const [teamLoaded,setTeamLoaded] = useState(false);
	const [teamMembers,setTeamMembers] = useState([]);


	const fetchMember = async(arr = [], j = 0) => {
		const {data} = await axios.post(getClientById,{
			clientId:request?.teamMembers[j]._id
		})

		if(data?.status){
			let newArr = [data?.user,...arr];
			if(j+1 < request?.teamMembers?.length){
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
		if(request && !teamLoaded){			
			// teamMembers = [];
			if(request?.teamMembers?.length > 0){
				fetchMember();
			}else{
				setLoading(false);
			}
			setTeamLoaded(true);
		}
	},[request])

	

	return (
		<main className="w-full md:px-5 px-2">
			<h1 className="text-xl text-black">
				Team members
			</h1>
			<div className="w-full h-[1px] bg-gray-300 mt-1"/>
			<div className="gap-4 mt-4 grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1">
				<ClientCard client={request?.clientDetails} j="200" />
				{
					teamMembers?.map((client,j)=>(
						<ClientCard key={j} client={client} j={j} />
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