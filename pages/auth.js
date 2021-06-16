import AuthForm from '../components/auth/auth-form';
import Head from 'next/head'
import {getSession} from 'next-auth/client'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react';

function AuthPage(props) {
  const router = useRouter()

  useEffect(async()=>{
    const currentSession = await getSession()
    if(currentSession){
      router.push('/')
    }
  },[router])
  return (
      <>
        <Head>
          <title></title>
        </Head>
        <AuthForm />
      </>
    );
}

export default AuthPage;
