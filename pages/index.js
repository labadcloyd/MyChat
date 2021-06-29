import Head from 'next/head'
import Sidebar from '../components/sidebar/sidebar'
import { useState, useContext, useEffect } from 'react'
import { useRouter } from 'next/router'
import {SocketContext} from '../context/socketContext';
import {getSession, useSession} from 'next-auth/client'
import axios from 'axios';
import { CircularProgress } from '@material-ui/core';

export default function Home(props) {
  const router = useRouter()
  const socket = useContext(SocketContext);
	const [ session, loading ] = useSession()
  
	const [username, setUsername] = useState()
	const [userChats, setUserChats] = useState([])
	
	/* FETCHING DATA */
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
	/* Calling getUserChats function on component mount */
	useEffect(async()=>{
		if(!loading && session){
			setUsername(session.user.name)
			await getUserChats()
		}if(!loading && !session){
			router.push('/auth')
		}
	}, [loading])

	socket.on('connect', (socket)=>{
		console.log('connected')
	})

	/* RENDERING CHAT */
	if(loading || !username){
		return(
			<div className="main-loading-div">
				<CircularProgress/>
			</div>
		)
	}
	if(!loading || username){
		return (
		<div className="chat-wrapper">
			<Head>
				<title>MyChat</title>
				<meta name="description" content="" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Sidebar username={username} userChats={userChats}/>
		</div>
		)
	}
}
