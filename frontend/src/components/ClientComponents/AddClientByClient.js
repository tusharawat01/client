"use client"

import Image from 'next/image'
import {IoMdClose} from 'react-icons/io';
import {AiOutlineCamera} from 'react-icons/ai';
import {BsFillTelephoneFill} from 'react-icons/bs';
import {BsFillPersonFill,BsBuildingFill} from 'react-icons/bs';
import {useState,useEffect} from 'react';
import ImageKit from "imagekit"
import {createClient,registerUserRouteByAdmin,checkForUserExist,getClients} from '../../utils/ApiRoutes';
import axios from 'axios';



export default function AddClient({addClientOpen,setAddClientOpen,
	clientIndustry,organizationName,organizationType,organizationId,loadClients}) {
	// body...
	const [clientName,setClientName] = useState('');
	const [projectName,setProjectName] = useState('');
	const [clientNumber,setClientNumber] = useState('');
	const [clientMail,setClientMail] = useState('');
	const [clientImage,setClientImage] = useState('');
	const [path,setPath] = useState('');
	const [url,setUrl] = useState('');
	const [loading,setLoading] = useState(false);
	const [password,setPassword] = useState('');

	var imagekit = new ImageKit({
	    publicKey : process.env.NEXT_PUBLIC_IMAGEKIT_ID,
	    privateKey : process.env.NEXT_PUBLIC_IMAGEKIT_PRIVATE,
	    urlEndpoint : process.env.NEXT_PUBLIC_IMAGEKIT_ENDPOINT
	});

	const pathCheck = (path) =>{
		if(path){
			if(path.split('.').includes('jpg')){
				return true;
			}else if(path.split('.').includes('jpeg')){
				return true;
			}else if(path.split('.').includes('png')){
				return true;
			}
		}
	}


	const urlSetter = (pathImage) => {
		const image_input = document.querySelector('#file1');
		if(image_input && pathCheck(pathImage)){
		const reader = new FileReader();
	
		reader.addEventListener('load',()=>{
			let uploaded_image = reader.result;
			setUrl(uploaded_image);		
		});
		reader.readAsDataURL(image_input.files[0]);
		}
	}

	const createClientNow = async(imageUrl) => {
		const data2 = await axios.post(checkForUserExist,{
			email:clientMail
		})
		if(!data2?.data?.status){
			const {data} = await axios.post(registerUserRouteByAdmin,{
				name:clientName,number:clientNumber,
				image:imageUrl,password,organizationName,organizationId,
				organizationType,clientIndustry,organizationRole:['client'],
				email:clientMail,roles:['User'],
				key:'v76LlWMwiOYsxIqfHldOxXzXDLSC1OSDvYazcjg9Pes='
			})
			if(data.status){
				setClientImage('');setClientName('');setPassword('');
				setClientNumber('');setClientMail('');setLoading(false);
				setAddClientOpen(false);
				loadClients();
				console.log(data.user);
			}else{
				alert(data?.msg);
			}
		}else{
			setLoading(false);
			alert(data2?.data?.msg)
		}


	}

	const upload = () =>{
		if(url.length > 2){
			if(pathCheck(path)){
				setLoading(true)
				// e.preventDefault();
				imagekit.upload({
			    file : url, //required
			    fileName : "thejashari",   //required
			    extensions: [
			        {
			            name: "google-auto-tagging",
			            maxTags: 5,
			            minConfidence: 95
			        }
			    ]
				}).then(response => {
				    setClientImage(response.url);
				    createClientNow(response.url);
				}).catch(error => {
				    console.log(error.message);
				});
			}else{
				console.log('Please Select an Image');
			}  
		}
	}

	const createClientFunc = async() => {
		if(clientName.length > 3 && url.length > 3 && clientMail.length > 3 && clientNumber.length > 3){
			setLoading(true);
			upload();
		}else{
			alert("Please enter all the required fields")
		}
	}

	


	return (
		<div className={`fixed flex items-center justify-center left-0
		h-full w-full bg-black/20 z-50 ${addClientOpen ? 'top-0' : '-top-[100%]'} transition-all duration-300
		ease-in-out`}>
			<div className="relative m-auto lg:w-[40%] md:w-[60%] sm:w-[80%] sm:max-h-[85%] h-full w-full sm:rounded-lg 
			overflow-y-auto	border-[1px] border-gray-200/50 bg-white flex flex-col">
				<div className={`${!loading && 'hidden' } fixed left-0 top-0 z-50 h-full w-full flex items-center justify-center bg-white/50`}>
					<span class="loader"></span>
				</div>
				<div className="flex sticky top-0 bg-white py-1 backdrop-blur-lg items-center 
				border-b-[1px] border-gray-300 gap-5 px-2">
					<div 
					onClick={()=>{
						setAddClientOpen(false);
					}}
					className="p-2 hover:bg-gray-300 cursor-pointer transition-all duration-200 ease-in-out rounded-full">
						<IoMdClose className="h-5 w-5 cursor-pointer text-black "/>
					</div>
					<h1 className="text-xl select-none text-black  font-semibold">Add client</h1>
				</div>
				<div className="h-[1px] bg-gray-300/40 w-full"/>
				<div className="flex flex-col mt-3 px-4">
					<div className="flex gap-2">
						<div className="flex p-2 flex-col gap-2">
							<h1 className="text-md font-semibold text-black">Upload avatar</h1>
							<div 
							onClick={()=>document.getElementById('file1').click()}
							className="h-[150px] w-[150px] hover:scale-105 transition-all duration-200
							ease-in-out flex items-center justify-center cursor-pointer border-dashed
							rounded-full border-[1.5px] border-sky-600 p-[2px] overflow-hidden">
								<input type="file" id="file1" accept="image/*" 
								value={path}
								onChange={(e)=>{setPath(e.target.value);urlSetter(e.target.value)}}
								hidden
								/>
								<Image src={url ? url : "https://ik.imagekit.io"}
								width="20000" height="10" object="cover" alt="" className={`rounded-full ${!url && 'hidden'}`}/>
								<AiOutlineCamera className="h-14 w-14 text-sky-500"/>
							</div>
						</div>
						<div className="flex px-3 w-full py-2 border-l-[1px] border-gray-300 flex-col gap-2">
							<h1 className="text-md font-semibold text-black">Personal details</h1>
							<div className="flex flex-col gap-1">
								<h1 className="text-sm text-gray-700 font-semibold">Mail ID</h1>
								<div className="px-3 py-2 border-[1px] border-gray-600/60 rounded-lg">
									<input type="text" 
									placeholder="Enter mail id"
									value={clientMail}
									onChange={(e)=>setClientMail(e.target.value)}
									className="outline-none bg-transparent text-sm 
									placeholder:text-gray-500 text-black"
									/>
								</div>	
							</div>
							<div className="flex flex-col gap-1">
								<h1 className="text-sm text-gray-700 font-semibold">Account password</h1>
								<div className="px-3 py-2 border-[1px] border-gray-600/60 rounded-lg">
									<input type="text" 
									placeholder="Enter password"	
									value={password}
									onChange={(e)=>setPassword(e.target.value)}								
									className="outline-none bg-transparent text-sm 
									placeholder:text-gray-500 text-black"
									/>
								</div>	
								<p className="text-[10px] font-normal text-gray-600">* Password will be hashed and assigned in user&apos;s account</p>
							</div>

						</div>

					</div>

					<div className="px-3">
						<div className="w-full flex items-center px-5 py-3 border-[1.3px] border-orange-500 
						rounded-lg mt-3 gap-5">
							<BsFillPersonFill className="text-orange-500 h-7 w-7"/>
							<input type="email"
							value={clientName}
							onChange={(e)=>setClientName(e.target.value)}
							placeholder="Enter client name" 
							className="w-full bg-transparent outline-none ring-none
							font-semibold text-lg text-black placeholder:text-gray-500 placeholder:font-normal placeholder:text-md"
							/>
						</div>
					</div>

					<div className="px-3">
						<div className="w-full flex items-center px-5 py-3 border-[1.3px] border-blue-500 
						rounded-lg mt-3 gap-5">
							<BsFillTelephoneFill className="text-blue-500 h-7 w-7"/>
							<input type="text"
							value={clientNumber}
							onChange={(e)=>setClientNumber(e.target.value)}
							placeholder="Enter client number " 
							className="w-full bg-transparent outline-none ring-none
							font-semibold text-lg text-black placeholder:text-gray-500 placeholder:font-normal placeholder:text-md"
							/>
						</div>
					</div>	


					<div className="h-[1px] w-full bg-gray-300 mt-3"/>

					<button 
					onClick={createClientFunc}
					className={`text-white py-3 mb-3 px-5 mt-3 hover:scale-[102%] transition-all 
					duration-200 ease-in-out rounded-lg bg-blue-700 `}>
						Add client
					</button>

				</div>


			</div>
		</div>


	)
}