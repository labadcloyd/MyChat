import { CircularProgress } from "@material-ui/core";
import { Send } from "@material-ui/icons";
import axios from "axios";
import { useEffect, useRef, useState } from "react"
import css from './chat.module.css'

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
		if(!chatDiv.current){
			await props.updateChat(messageForm)
		}
		if(chatDiv.current){
			const { scrollTop, scrollHeight, clientHeight } = chatDiv.current;
			await props.updateChat(messageForm)
			if(messageForm.sender === username){
				await chatDiv.current.scrollTo(0, chatDiv.current.scrollHeight)
			}
			if(messageForm.sender !== username){
				if((Math.floor(scrollHeight - scrollTop)) === clientHeight || (Math.floor(scrollHeight - scrollTop))<clientHeight){
					console.log('called')
					await chatDiv.current.scrollTo(0, chatDiv.current.scrollHeight)
				}
			}
		}
	})

	/* SENDING THE MESSAGE */
	async function handleMessage(event){
		event.preventDefault()
		if (!message.replace(/\s/g, '').length) {
			setMessage('')
			return
		}
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
			<div className={css.chatContainer}>
				{!currentChat &&
					<div style={{display:'flex', justifyContent:'center', alignItems:'center', padding:'20px'}}>
						<CircularProgress/>
					</div>
				}
				{currentChat &&
					<>
						<div className={css.headerUser} >
							<h1 style={{margin:'10px 0px 10px 20px'}}>
								{selectedUser}
							</h1>
						</div>
						{(currentChat.length < 1) &&
							<div>
								<p>Start chatting with this user.</p>
							</div>
						}
						{(currentChat.length > 0) &&
							<div id='scrollableDiv' className={css.chatDiv} ref={chatDiv} onScroll={()=> onScroll()} >
								<div style={{display:loadingFetchMore?'block':'none'}}>
									<div style={{display:'flex', justifyContent:'center', padding:'20px'}}>
										<CircularProgress/>
									</div>
								</div>
								{currentChat.map((chat, index)=>{
									return(
										<>
										<div key={index} style={{display:'flex', width:'100%', justifyContent:chat.sender===username?'flex-end':'flex-start'}}>
											<div className={css.chat} style={{textAlign:chat.sender===username?'right':'left', backgroundColor:chat.sender===username?'#09f':'#eff4f8', color:chat.sender===username?'#fff':'#000'}}>
												{chat.message}
											</div>
										</div>
										</>
									)
								})}
							</div>
						}
						<form className={css.sendMessageInput} onSubmit={handleMessage} >
							<input placeholder='Send a message' value={message} onChange={(e)=>{setMessage(e.target.value)}}></input>
							<button type='submit'><Send/></button>
						</form>
					</>
				}
			</div>
		</>
	)
}