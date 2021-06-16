import Head from 'next/head'
import Image from 'next/image'
import Sidebar from '../../components/sidebar/sidebar'
import Chat from '../../components/chat/chat'
import {getSession, useSession} from 'next-auth/client'
import {User} from '../../models/usermodel'
import { useEffect, useState, useContext } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import {SocketContext} from '../../context/socketContext';

export default function Home(props) {
	const router = useRouter()
	const socketio = useContext(SocketContext);
	
	const selectedUser = router.query.queriedUsername
	const [username, setUsername] = useState()
	const [doesChatExist, setChatExists] =useState(false)
	const [userChats, setUserChats] = useState()
	const [chatID, setChatID] = useState(null)
	const [currentChat, setCurrentChat] = useState(null)
	const [isExistingChat, setIsExistingChat] = useState(doesChatExist)


	/* getting current chat */
	async function getCurrentChat(){
		const response = await axios.get('/api/getChat', {params:{queriedUsername:selectedUser, username:username}})
		const {data} = response
		console.log(data)
		setCurrentChat(data.messages)
		setChatID(data.chatID)
		socketio.emit('join-room', data.chatID)
	}
	useEffect(async()=>{
		const [ session, loading ] = await useSession()
		setUsername(session.user.name)
		await getCurrentChat()
	}, [router])

	/* selecting chat */
	async function handleSelectChat(selectedUsername){
		router.push(`/chat/${selectedUsername}`)
	}

	/* SOCKET IO */
	/* turning off listener in order to for socketio to only listen once */
	socketio.off('receive-message').on('receive-message', async(messageForm, room)=>{
		if(!isExistingChat){
			console.log(messageForm)
			setCurrentChat([messageForm]);
			setIsExistingChat(true);
			console.log(messageForm)
		}else if(isExistingChat){
			setCurrentChat((prevValue)=>{return  [...prevValue, messageForm] } );
			console.log(currentChat)
		}
	})
	return (
		<div className="chat-wrapper">
			<Head>
				<title>Chat App</title>
				<meta name="description" content="" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Sidebar username={username} handleSelectChat={handleSelectChat} userChats={userChats}/>
			<Chat chatID={chatID} isExistingChat={isExistingChat} selectedUser={selectedUser} currentChat={currentChat} username={username} socket={socketio}/>
		</div>
	)
}