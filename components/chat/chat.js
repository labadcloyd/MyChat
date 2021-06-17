import { useEffect, useState } from "react"
import { v4 as uuidv4 } from 'uuid';

export default function Chat(props){
	// const {isExistingChat, selectedUser, currentChat, username, socket} = props
	
	// const uniqueID = uuidv4()
	// useEffect(()=>{
	// 	if(isExistingChat){
	// 		socket.join(uniqueID)
	// 	}
	// },[selectedUser])
	return(
		<>
			{/* <div>
				{!currentChat &&
					<div>
						<p>Search for a user to start chatting</p>
					</div>
				}
				{(!isExistingChat && currentChat) &&
					<div>
						<p>Start chatting with this user.</p>
					</div>
				}
				{currentChat &&
					<div>
						
					</div>
				}
			</div> */}
		</>
	)
}