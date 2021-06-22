import axios from "axios";
import { useEffect, useRef, useState } from "react"

export default function Chat(props){
	const {isExistingChat, selectedUser, currentChat, username, socket, chatID} = props;
	const [message, setMessage] = useState();
	const botMsg = useRef();
	const chatDiv = useRef();
	
	const onScroll = async () => {
		if (chatDiv.current) {
			const { scrollTop, scrollHeight, clientHeight } = chatDiv.current;
			if(scrollTop === 0){
				const pastScroll = scrollHeight
				console.log(pastScroll)
				await props.fecthMoreChat()
				const currentScroll = (await chatDiv.current.scrollHeight-pastScroll)
				await chatDiv.current.scrollTo(0, currentScroll)
			}
		}
	};

	useEffect(()=>{
		botMsg.current.scrollIntoView()
	},[chatID])
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
			botMsg.current.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"})
		}else if(!isExistingChat){
			await socket.emit('send-message', messageForm, chatID)
			setMessage('')
			await axios.patch('/api/addUserChat', {chatID:chatID, chatPartner:selectedUser, username:username})
			botMsg.current.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"})
		}
	}
	return(
		<>
			<div style={{height:'100vh', paddingTop:'120px', boxSizing:'border-box'}}>
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
								{/* <div style={{visibility:'hidden'}} ref={topDiv}></div> */}
								{currentChat.map((chat, index)=>{
									return(
										<div key={index} style={{textAlign:chat.sender===username?'right':'left'}}>
											{chat.message}
										</div>
									)
								})}
								<div style={{visibility:'hidden'}} ref={botMsg}></div>
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