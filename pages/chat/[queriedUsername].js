import Head from 'next/head'
import Image from 'next/image'
import Sidebar from '../../components/sidebar/sidebar'
import Chat from '../../components/chat/chat'
import {getSession} from 'next-auth/client'
import {User} from '../../models/usermodel'
import {Chats} from '../../models/chatmodel'
import io from 'socket.io-client'
import { useState } from 'react'
import { useRouter } from 'next/router'

export default function Home(props) {
	const router = useRouter()
	const {session, userChats, username, queriedChat, selectedUser, doesChatExist} = props
	const [currentChat, setCurrentChat] = useState(queriedChat)
	const [isExistingChat, setIsExistingChat] = useState(doesChatExist)
	
	const socket = io();
	socket.on('connect', (socket)=>{
		console.log('connected')
	})
	/* selecting chat */
	async function handleSelectChat(selectedUsername){
		router.push(`/chat/${selectedUsername}`)
	}
	return (
		<div className="chat-wrapper">
			<Head>
				<title>Chat App</title>
				<meta name="description" content="" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Sidebar username={username} handleSelectChat={handleSelectChat} userChats={userChats}/>
			<Chat isExistingChat={isExistingChat} selectedUser={selectedUser} currentChat={currentChat} username={username} socket={socket}/>
		</div>
	)
}

export async function getServerSideProps(context){
	/* basic authentication */
	const session = await getSession({req:context.req})
	const queriedUsername = context.params.queriedUsername;
	if(!session){
		return{
			props:{
				session:session
			},
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
	const queriedChat = await userChats.find((chat)=>{return chat.chatPartner === queriedUsername})
	if(!queriedChat){
		return{
			props:{
				session:session,
				userChats:userChats,
				username:username,
				queriedChat: null,
				selectedUser: queriedUsername,
				doesChatExist: false,
			}
		}
	}
	const currentChat = await Chats.findOne({_id:queriedChat.chatID})
	return{
		props:{
			session:session,
			userChats:userChats,
			username:username,
			queriedChat: currentChat,
			selectedUser: queriedUsername,
			doesChatExist: true,
		}
	}
}