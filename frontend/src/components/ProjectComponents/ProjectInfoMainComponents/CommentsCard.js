"use client"
import {useState,useEffect} from 'react';
import {AiOutlineLike,AiFillLike} from 'react-icons/ai';
import {RxCross1} from 'react-icons/rx';
import ReplyCard from './ReplyCard';



export default function CommentsCard({comment,j,addReply,likeComment,
	loading,currentUser,updateComment}) {

	const [openReplyBox,setOpenReplyBox] = useState(false);
	const [replyText,setReplyText] = useState('');
	const [liked,setLiked] = useState(false);

	useEffect(()=>{
		if(comment?.likes?.includes(currentUser._id)){
			setLiked(true);
		}else{
			setLiked(false);
		}
	},[comment])

	function convertISOStringToCustomFormat(isoString) {

	    const customDate = new Date(isoString);
	    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	    const month = months[customDate.getMonth()];
	    const day = customDate.getDate();
	    const hours = customDate.getHours() % 12 || 12; // Convert 24-hour to 12-hour format
	    const minutes = customDate.getMinutes();
	    const period = customDate.getHours() < 12 ? 'am' : 'pm';

	    const customDateString = `${month} ${day}, ${hours}.${minutes}${period}`;

	    return customDateString;
	}

	const likeReply = async(replyId) => {
		let replies = [...comment?.replies];
		const idx = replies.findIndex(reply=>{
			if(reply.replyId === replyId){
				return true
			}
			return false
		})
		if(idx > -1){
			let reply = replies[idx];
			if(reply?.likes?.includes(currentUser?._id)){
				let likes = [...reply?.likes]
				const idx2 = likes?.findIndex(userId=>{
					if(userId === currentUser?._id){
						return true
					}
					return false
				})
				if(idx2 > -1){
					likes.splice(idx2,1);
					const updatedReply = {
						...reply,likes
					}
					replies[idx] = updatedReply;
					updateComment(comment?.commentId,replies);
				}
			}else{
				let likes = [currentUser?._id,...reply?.likes];
				const updatedReply = {
					...reply,likes
				}
				replies[idx] = updatedReply;
				updateComment(comment?.commentId,replies);
			}
		}
	}

	return (
		<div key={j} className="w-full flex p-1 rounded-lg">
				<img src={comment?.image} 
				alt=""
				className="h-12 w-12 border-2 rounded-full hover:border-blue-400 cursor-pointer border-gray-300"/>

			<div class="flex-col mt-1 ">
                <div class="flex items-center flex-1 px-4 font-bold leading-tight"><span className="hover:underline">{comment?.name}</span>
                    <span class="ml-2 text-xs font-normal text-gray-500">{convertISOStringToCustomFormat(comment?.createAt)}</span>
                </div>
                <div class="flex-1 px-2 ml-2 mt-1 text-sm font-medium text-gray-600">{comment?.comment}
                </div>
                <button onClick={()=>setOpenReplyBox(!openReplyBox)} class="inline-flex items-center px-1 pt-2 ml-1 flex-column">
                    {
                    	openReplyBox ? 
                    	<RxCross1 className="h-5 w-5 ml-2 text-gray-600 cursor-pointer fill-current hover:text-gray-900"/>
                    	:
                    	<svg class="w-5 h-5 ml-2 text-gray-600 cursor-pointer fill-current hover:text-gray-900"
                        viewBox="0 0 95 78" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M29.58 0c1.53.064 2.88 1.47 2.879 3v11.31c19.841.769 34.384 8.902 41.247 20.464 7.212 12.15 5.505 27.83-6.384 40.273-.987 1.088-2.82 1.274-4.005.405-1.186-.868-1.559-2.67-.814-3.936 4.986-9.075 2.985-18.092-3.13-24.214-5.775-5.78-15.377-8.782-26.914-5.53V53.99c-.01 1.167-.769 2.294-1.848 2.744-1.08.45-2.416.195-3.253-.62L.85 30.119c-1.146-1.124-1.131-3.205.032-4.312L27.389.812c.703-.579 1.49-.703 2.19-.812zm-3.13 9.935L7.297 27.994l19.153 18.84v-7.342c-.002-1.244.856-2.442 2.034-2.844 14.307-4.882 27.323-1.394 35.145 6.437 3.985 3.989 6.581 9.143 7.355 14.715 2.14-6.959 1.157-13.902-2.441-19.964-5.89-9.92-19.251-17.684-39.089-17.684-1.573 0-3.004-1.429-3.004-3V9.936z"
                            fill-rule="nonzero" />
                    	</svg>
                    }
                </button>
                <button 
                onClick={()=>{likeComment(comment?.commentId);setLiked(!liked)}}
                class="inline-flex gap-1 items-center px-1 flex-column">
                    {
                    	liked ? 
                    	<AiFillLike className="h-5 w-5 text-blue-500 hover:text-blue-700"/>
                    	:
                    	<AiOutlineLike className="h-5 w-5 text-gray-500 hover:text-gray-700"/>
                    }
                    <span className="text-sm mt-1 font-normal text-gray-500">{comment?.likes?.length > 0 ? comment?.likes?.length : 0}</span>
                </button>
                {
                	openReplyBox &&
                	<div className="w-full flex items-center gap-2 px-3 py-1">
                		<div className="border-[1px] border-gray-300 py-[6px] w-full px-2 rounded-lg">
                			<input type='text' className={`w-full outline-none bg-transparent 
                			text-sm font-medium ${loading ? 'text-gray-300 animate-pulse' : 'text-gray-800'}`}
                			placeholder="Enter your reply here..."
                			value={replyText} disabled={loading}
                			onChange={(e)=>setReplyText(e.target.value)}
                			/>
                		</div>
                		<button onClick={()=>{
                			addReply(replyText,comment.commentId);
                			setOpenReplyBox(false)
                		}} className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm">Reply</button>
                	</div>
                }
                {comment?.replies?.length > 0 && <hr class="my-2 ml-2 border-gray-200"/>}
                {
                	comment?.replies?.length > 0 &&
                	
                	comment?.replies?.map((reply,k)=>(
			            <ReplyCard reply={reply} k={k} key={k} convertISOStringToCustomFormat={convertISOStringToCustomFormat}
			            currentUser={currentUser} likeReply={likeReply}
			            />
                	))
                	
                }
                
            </div>
		</div>
	)
}