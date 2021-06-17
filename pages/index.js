import Head from 'next/head'
import Image from 'next/image'
import Sidebar from '../components/sidebar/sidebar'
import Chat from '../components/chat/chat'
import {getSession} from 'next-auth/client'
import {User} from '../models/usermodel'
import io from 'socket.io-client'
import { useState } from 'react'

export default function Home(props) {
  const {session, userChats, username} = props
	const [currentChat, setCurrentChat] = useState(null)
	const [selectedUser, setSelectedUser] = useState()
  const [isExistingChat, setIsExistingChat] = useState(false)
  
  const socket = io();
	socket.on('connect', (socket)=>{
		console.log('connected')
	})

	/* filtering for the selected chat */
	async function filterChat(selectedUsername){
		await userChats.filter((chat)=>{
			return chat.chatPartner === selectedUsername
		})
	}
	/* selecting chat */
	async function handleSelectChat(selectedUsername){
		const foundChat = await filterChat(selectedUsername)
    setSelectedUser(selectedUsername)
		if(foundChat){
      setIsExistingChat(true)
			setCurrentChat(foundChat)
		}
		if(!foundChat){
      setIsExistingChat(false)
		}
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
	const session = await getSession({req:context.req})
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
  const userChats = user.chats
  return{
    props:{
      session:session,
      userChats:userChats,
      username:username
    }
  }
}