import AuthForm from '../components/auth/auth-form';
import Head from 'next/head'
import {getSession, useSession} from 'next-auth/client'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react';

function AuthPage() {
  const router = useRouter()
  const [ session, loading ] = useSession()
  if(loading) {
    return <>
      <h1>Loading...</h1>
    </>
  }
  if(!loading){
    /* 
    ! somehow router.push won't work without returning a component first 
    * since in this case routerpush happens before any component mounts
    */
    if(session){
      router.push('/')
      return <>
        <h1>Loading...</h1>
      </>
    }
    if(!session){
      return (
          <>
            <Head>
              <title></title>
            </Head>
            <AuthForm />
          </>
      );
    }
  }
}

export default AuthPage;
