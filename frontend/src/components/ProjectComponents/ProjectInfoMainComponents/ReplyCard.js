"use client"
import {AiOutlineLike,AiFillLike} from 'react-icons/ai';
import {useState,useEffect} from 'react'



export default function ReplyCard({reply,k,currentUser,
	convertISOStringToCustomFormat,likeReply}) {
	const [liked,setLiked] = useState(false);

	useEffect(()=>{
		if(reply?.likes?.includes(currentUser._id)){
			setLiked(true)
		}else{
			setLiked(false)
		}
	},[reply])

	return (
		<div key={k} class={`flex ${k === 0 ? 'mt-0' : 'mt-2'} flex-row md-10 md:ml-2`}>
            <img class="w-10 h-10 border-2 border-gray-300 hover:border-blue-400 cursor-pointer rounded-full" alt="avatar"
                src={reply?.image}/>
            <div class="flex-col mt-1">
                <div class="flex items-center flex-1 px-3 leading-tight"><span className="hover:underline">{reply?.name}</span>
                    <span class="ml-2 text-xs font-normal text-gray-500">{convertISOStringToCustomFormat(reply?.createAt)}</span>
                </div>
                <div class="flex-1 px-1 ml-2 text-sm font-medium leading-loose text-gray-600">{reply?.replyText}
                </div>
                <button 
                onClick={()=>{likeReply(reply?.replyId);setLiked(!liked)}}
                class="inline-flex ml-[10px] gap-1 items-center px-1 flex-column">
                    {
                    	liked ? 
                    	<AiFillLike className="h-5 w-5 text-blue-500 hover:text-blue-700"/>
                    	:
                    	<AiOutlineLike className="h-5 w-5 text-gray-500 hover:text-gray-700"/>
                    }
                    <span className="text-xs mt-1 font-normal text-gray-500">{reply?.likes?.length > 0 ? reply?.likes?.length : 0}</span>
                </button>
            </div>
        </div>

	)
}