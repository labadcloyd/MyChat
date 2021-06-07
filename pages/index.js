import Head from 'next/head'
import Image from 'next/image'
import Sidebar from '../components/sidebar/sidebar'
import Chat from '../components/chat/chat'

export default function Home() {
  return (
    <div className={styles.container}>
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
  
}
