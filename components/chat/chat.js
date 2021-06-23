import axios from "axios";
import { useEffect, useRef, useState } from "react"

export default function Chat(props){
	const {isExistingChat, selectedUser, currentChat, username, socket, chatID, loadingFetchMore} = props;
	const [message, setMessage] = useState();
	const chatDiv = useRef();
	
	useEffect(async()=>{
		if(chatDiv.current){
			await chatDiv.current.scrollTo(0, chatDiv.current.scrollHeight)
		}
	},[chatID])

	/*
	 ! THIS IS MY OWN IMPLEMENTATION OF INFINITE SCROLLING FOR CHAT APPS
	*/
	const onScroll = async () => {
		if (chatDiv.current) {
			/* returning if its already fetching */
			if(loadingFetchMore){
				return
			}
			const { scrollTop, scrollHeight, clientHeight } = chatDiv.current;
			if(scrollTop === 0){
				const pastScroll = scrollHeight
				await props.fecthMoreChat()
				/*
				 * Here we get the old scroll height first, save it then update the component and get the new scroll height
				 * then subtract the new scroll height with the old scroll height and use the number to set scroll
				*/
				const currentScroll = (await chatDiv.current.scrollHeight-pastScroll)
				/*
				 * The ``scrollTo()`` function takes (x,y) parameters respectively.
				 * The Y axis starts from the top to the bottom. so ``scrollTo(0,0)`` will scroll to the very top
				*/
				await chatDiv.current.scrollTo(0, currentScroll)
			}
		}
	};

	/* SOCKET IO */
	/* turning off listener in order to for socketio to only listen once */
	socket.off('receive-message').on('receive-message', async(messageForm, room)=>{
		await props.updateChat(messageForm)
	})

	/* SENDING THE MESSAGE */
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
			await axios.patch('/api/addUserChat', {chatID:chatID, chatPartner:selectedUser, username:username})
		}
	}
	return(
		<>
			<div style={{height:'100vh', padding:'120px 0px 20px 0px', boxSizing:'border-box'}}>
				{!currentChat &&
					<div>Loading...</div>
				}
				{currentChat &&
					<>
						<div style={{position:"fixed", top:'60px', width:'100%', backgroundColor:'#fff'}}>
							<h1 style={{margin:'10px'}}>
								{selectedUser}
							</h1>
						</div>
						{(currentChat.length < 1) &&
							<div>
								<p>Start chatting with this user.</p>
							</div>
						}
						{(currentChat.length > 0) &&
							<div id='scrollableDiv' ref={chatDiv} onScroll={()=> onScroll()} style={{height:'100%', padding:'20px', display:'flex', flexDirection:'column', backgroundColor:'#efefef', overflowY:'scroll'}}>
								<div style={{display:loadingFetchMore?'block':'none'}}>Loading...</div>
								{currentChat.map((chat, index)=>{
									return(
										<div key={index} style={{textAlign:chat.sender===username?'right':'left'}}>
											{chat.message}
										</div>
									)
								})}
							</div>
						}
						<form onSubmit={handleMessage} style={{position:'fixed', bottom:'0'}}>
							<input placeholder='Send a message' value={message} onChange={(e)=>{setMessage(e.target.value)}}></input>
							<button type='submit'>Send</button>
						</form>
					</>
				}
			</div>
		</>
	)
}