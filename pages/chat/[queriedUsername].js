import Head from 'next/head'
import Image from 'next/image'
import Sidebar from '../../components/sidebar/sidebar'
import Chat from '../../components/chat/chat'
import {getSession, useSession} from 'next-auth/client'
import { useEffect, useState, useContext } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import {SocketContext} from '../../context/socketContext';

export default function Home(props) {
	const router = useRouter()
	const socketio = useContext(SocketContext);
	const [ session, loading ] = useSession()
	
	const selectedUser = router.query.queriedUsername
	const [username, setUsername] = useState()
	const [userChats, setUserChats] = useState()
	const [chatID, setChatID] = useState(null)
	const [currentChat, setCurrentChat] = useState(null)
	const [isExistingChat, setIsExistingChat] = useState(false)

	/* getting current chat */
	async function getCurrentChat(){
		const response = await axios.get('/api/getChat', {params:{queriedUsername:selectedUser, username:session.user.name}})
		const {data} = response
		console.log(data)
		setCurrentChat(data.messages)
		setChatID(data.chatID)
		socketio.emit('join-room', data.chatID)
	}
	useEffect(async()=>{
		if(!loading && session){
			setUsername(session.user.name)
			await getCurrentChat()
		}if(!loading && !session){
			router.push('/auth')
		}
	}, [loading])

	/* selecting chat */
	async function handleSelectChat(selectedUsername){
		router.push(`/chat/${selectedUsername}`)
	}

	/* SOCKET IO */
	/* turning off listener in order to for socketio to only listen once */
	socketio.off('receive-message').on('receive-message', async(messageForm, room)=>{
		if(!isExistingChat){
			setCurrentChat([messageForm]);
			setIsExistingChat(true);
		}else if(isExistingChat){
			setCurrentChat((prevValue)=>{return  [...prevValue, messageForm] } );
		}
	})

	if(loading || !username){
		return(
			<div>
				<h1>Loading...</h1>
				<h1>Loading...</h1>
				<h1>Loading...</h1>
			</div>
		)
	}
	if(!loading || username){
		return (
			<div className="chat-wrapper">
				<Head>
					<title>Chat App</title>
					<meta name="description" content="" />
					<link rel="icon" href="/favicon.ico" />
				</Head>
				<Sidebar username={username} handleSelectChat={handleSelectChat} userChats={userChats}/>
				{!currentChat && 
					<div>
						<h1>Loading...</h1>
					</div>
				}
				{currentChat &&
					<Chat chatID={chatID} isExistingChat={isExistingChat} selectedUser={selectedUser} currentChat={currentChat} username={username} socket={socketio}/>
				}
			</div>
		)
	}
}