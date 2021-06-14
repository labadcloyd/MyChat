import axios from "axios";
import { useEffect, useState } from "react"

export default function Chat(props){
	const {isExistingChat, selectedUser, currentChat, username, socket, chatID} = props
	const [message, setMessage] = useState()

	async function handleMessage(event){
		event.preventDefault()
		const messageForm = {
			message: message,
			sender: username,
			receiver: selectedUser
		}
		if(isExistingChat){
			await socket.emit('send-message', messageForm, chatID)
			setMessage('')
		}else if(!isExistingChat){
			await socket.emit('send-message', messageForm, chatID)
			setMessage('')
		}
	}
	return(
		<>
			<div>
				{!currentChat &&
					<div>Loading...</div>
				}
				{currentChat &&
					<div>
						<div>
							<h1>
								{selectedUser}
							</h1>
						</div>
						{(currentChat.messages.length < 1) &&
							<div>
								<p>Start chatting with this user.</p>
							</div>
						}
						<div style={{display:'flex', flexDirection:'column', backgroundColor:'#efefef'}}>
							Messages
							{currentChat.messages.map((chat)=>{
								<div style={{justifyContent:chat.sender===username?'flex-start':'flex-end'}}>
									{chat.message}
								</div>
							})}
						</div>
						<form onSubmit={handleMessage}>
							<input placeholder='Send a message' value={message} onChange={(e)=>{setMessage(e.target.value)}}></input>
							<button type='submit'>Send</button>
						</form>
					</div>
				}
			</div>
		</>
	)
}