import { useEffect, useState } from "react"
import { v4 as uuidv4 } from 'uuid';

export default function Chat(props){
	const {isExistingChat, selectedUser, currentChat, username, socket} = props
	
	return(
		<>
			<div>
				{(!isExistingChat && currentChat) &&
					<div>
						<p>Start chatting with this user.</p>
					</div>
				}
				{currentChat &&
					<div>
						<div style={{display:'flex', flexDirection:'column'}}>
							{currentChat.messages.map((chat)=>{
								<div style={{justifyContent:chat.sender===username?'flex-start':'flex-end'}}>
									{chat.message}
								</div>
							})}
						</div>
						<div>
							
						</div>
					</div>
				}
			</div>
		</>
	)
}