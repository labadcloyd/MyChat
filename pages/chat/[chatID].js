import Head from 'next/head'
import Image from 'next/image'
import Sidebar from '../components/sidebar/sidebar'
import Chat from '../components/chat/chat'
import {getSession} from 'next-auth/client'
import {User} from '../../models/usermodel'
import {Chats} from '../../models/chatmodel'

export default function Chat(props) {
	const {session, username, userChats, queriedChat} = props


	return (
		<div>
		<Head>
			<title>Chat App</title>
			<meta name="description" content="" />
			<link rel="icon" href="/favicon.ico" />
		</Head>
		<Sidebar userChats={userChats}/>
		<Chat queriedChat={queriedChat}/>
		</div>
	)
}

export async function getServerSideProps(context){
	const session = await getSession({req:context.req})
	const chatID = context.params.chatID;
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
	const username = session.user.name
	const user = await User.findOne({username:username})
	if(!user){
		return {
			notFound: true
		}
	}
	const queriedChat = await Chats.findOne({_id:chatID})
	if(!queriedChat){
		return{
			props:{
				session:session,
				userChats:userChats,
				username:username,
				queriedChat: null
			}
		}
	}
	const userChats = user.chats
	return{
		props:{
			session:session,
			userChats:userChats,
			username:username,
			queriedChat: queriedChat
		}
	}
}