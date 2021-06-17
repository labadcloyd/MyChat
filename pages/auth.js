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
    if(session){
      router.push('/')
      return <>
      <h1>Loading but should be redirecting</h1>
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
