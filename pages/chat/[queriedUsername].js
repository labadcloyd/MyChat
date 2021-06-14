import Head from 'next/head'
import Image from 'next/image'
import Sidebar from '../../components/sidebar/sidebar'
import Chat from '../../components/chat/chat'
import {getSession} from 'next-auth/client'
import {User} from '../../models/usermodel'
import { useEffect, useState, useContext } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import {SocketContext} from '../../context/socketContext';

export default function Home(props) {
	const router = useRouter()
	const socketio = useContext(SocketContext);

	const {session, username, userChats, selectedUser, doesChatExist} = props
	const [chatID, setChatID] = useState(null)
	const [currentChat, setCurrentChat] = useState(null)
	const [isExistingChat, setIsExistingChat] = useState(doesChatExist)

	/* getting current chat */
	async function getCurrentChat(){
		const response = await axios.get('/api/getChat', {params:{queriedUsername:selectedUser, username:username}})
		const {data} = response
		console.log(data)
		setCurrentChat(data)
		setChatID(data.chatID)
		socketio.emit('join-room', data.chatID)
	}
	useEffect(()=>{
		getCurrentChat()
	}, [username])

	/* selecting chat */
	async function handleSelectChat(selectedUsername){
		router.push(`/chat/${selectedUsername}`)
	}

	/* SOCKET IO */
	socketio.off('receive-message').on('receive-message', async(messageForm, room)=>{
		if(!isExistingChat){
			setCurrentChat({messages:[messageForm]});
			setIsExistingChat(true);
			console.log(messageForm)
		}else if(isExistingChat){
			setCurrentChat((prevValue)=>{return {messages: [prevValue, messageForm] } });
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

export async function getServerSideProps(context){
	/* basic authentication */
	const session = await getSession({req:context.req})
	const queriedUsername = context.params.queriedUsername;
	if(!session){
		return{
			redirect:{
				destination: '/auth'
			}
		}
	}
	/* finding the user */
	const username = session.user.name
	const user = await User.findOne({username:username})
	if(!user){
		return {
			notFound: true
		}
	}
	/* searching for the queried chat */
	const userChats = user.chats
	const existingChat = await userChats.find((chat)=>{return chat.chatPartner === queriedUsername})
	if(existingChat){
		return{
			props:{
				session:session,
				userChats:userChats,
				username:username,
				selectedUser: queriedUsername,
				doesChatExist: true,
			}
		}
	}
	if(!existingChat){
		return{
			props:{
				session:session,
				userChats:userChats,
				username:username,
				selectedUser: queriedUsername,
				doesChatExist: false,
			}
		}
	}
}