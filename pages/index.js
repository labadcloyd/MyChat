import Head from 'next/head'
import Image from 'next/image'
import Sidebar from '../components/sidebar/sidebar'
import Chat from '../components/chat/chat'
import {getSession} from 'next-auth/client'

export default function Home() {
  return (
    <div>
      <Head>
        <title>Chat App</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Sidebar/>
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
  return{
    props:{
      session:session
    }
  }
}