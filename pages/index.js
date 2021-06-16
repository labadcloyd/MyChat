import Head from 'next/head'
import Image from 'next/image'
import Sidebar from '../components/sidebar/sidebar'
import Chat from '../components/chat/chat'
import {getSession} from 'next-auth/client'
import {User} from '../models/usermodel'
import { useState, useContext } from 'react'
import { useRouter } from 'next/router'
import {SocketContext} from '../context/socketContext';

export default function Home(props) {
  const router = useRouter()
  const {session, userChats, username} = props
	const [currentChat, setCurrentChat] = useState(null)
	const [selectedUser, setSelectedUser] = useState()
  const [isExistingChat, setIsExistingChat] = useState(false)
  
  const socket = useContext(SocketContext);
	socket.on('connect', (socket)=>{
		console.log('connected')
	})
	/* selecting chat handler */
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
      <div>
        Search for a user to start chatting
      </div>
    </div>
  )
}

export async function getServerSideProps(context){
  /* basic authentication */
	const session = await getSession({req:context.req})
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
  /* finding the user's chat */
  const userChats = user.chats
  return{
    props:{
      session:session,
      userChats:userChats,
      username:username
    }
  }
}