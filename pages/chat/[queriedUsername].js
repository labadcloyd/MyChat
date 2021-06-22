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
	const [userChats, setUserChats] = useState([])
	const [chatID, setChatID] = useState(null)
	const [currentChat, setCurrentChat] = useState(null)
	const [isExistingChat, setIsExistingChat] = useState(false)

	/* Fecthing Data */
	/* Getting user's chats */
	async function getUserChats(){
		const response = await axios.get('/api/getUserChats', {params:{username:session.user.name}})
		if(response.data.chats.length === 0){
			setUserChats(null)
		}
		if(response.data.chats.length > 0){
			setUserChats(response.data.chats)
		}
	}
	/* Getting current chat */
	async function getCurrentChat(){
		const response = await axios.get('/api/getChat', {params:{queriedUsername:selectedUser, username:session.user.name}})
		const {data} = response
		setCurrentChat(data.messages)
		setChatID(data.chatID)
		if(data.messages.length>0){
			setIsExistingChat(true)
		}
		socketio.emit('join-room', data.chatID)
	}
	useEffect(async()=>{
		if(!loading && session){
			setUsername(session.user.name)
			await getCurrentChat()
			await getUserChats()
		}if(!loading && !session){
			router.push('/auth')
		}
	}, [loading])

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

	/* FECTHING MORE CHAT IF IT REACHES TOP */
	async function fecthMoreChat(){
		console.log(currentChat)
		const dataChat = [{message: "asd asd asd asd asd", receiver: "cloyd123", sender: "labadcloyd", _id: "60f96b9045fc3c06bc3640cf"},{message: "asd asd asd asd asd", receiver: "cloyd123", sender: "labadcloyd", _id: "60f96b9045fc3c06bc3640cf"},{message: "asd asd asd asd asd", receiver: "cloyd123", sender: "labadcloyd", _id: "60f96b9045fc3c06bc3640cf"},{message: "asd asd asd asd asd", receiver: "cloyd123", sender: "labadcloyd", _id: "60f96b9045fc3c06bc3640cf"},{message: "asd asd asd asd asd", receiver: "cloyd123", sender: "labadcloyd", _id: "60f96b9045fc3c06bc3640cf"},{message: "asd asd asd asd asd", receiver: "cloyd123", sender: "labadcloyd", _id: "60f96b9045fc3c06bc3640cf"},{message: "asd asd asd asd asd", receiver: "cloyd123", sender: "labadcloyd", _id: "60f96b9045fc3c06bc3640cf"},{message: "asd asd asd asd asd", receiver: "cloyd123", sender: "labadcloyd", _id: "60f96b9045fc3c06bc3640cf"},{message: "asd asd asd asd asd", receiver: "cloyd123", sender: "labadcloyd", _id: "60f96b9045fc3c06bc3640cf"}]
		setCurrentChat((prevValue)=>{
			return [...dataChat, ...prevValue]
		}) 
	}
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
				{!currentChat && 
					<div>
						<h1>Loading...</h1>
					</div>
				}
				{currentChat &&
					<>
						<Sidebar username={username} userChats={userChats}/>
						<Chat fecthMoreChat={fecthMoreChat} chatID={chatID} isExistingChat={isExistingChat} selectedUser={selectedUser} currentChat={currentChat} username={username} socket={socketio}/>
					</>
				}
			</div>
		)
	}
}