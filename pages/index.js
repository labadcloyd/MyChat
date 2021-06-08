import Head from 'next/head'
import Image from 'next/image'
import Sidebar from '../components/sidebar/sidebar'
import Chat from '../components/chat/chat'
import {getSession} from 'next-auth/client'
import {User} from '../models/usermodel'

export default function Home(props) {
  const {session, userData, username} = props

  return (
    <div>
      <Head>
        <title>Chat App</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Sidebar userData={userData}/>
      <Chat/>
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
  const userData = user.chats
  return{
    props:{
      session:session,
      userData:userData,
      username:username
    }
  }
}