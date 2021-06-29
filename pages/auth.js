import AuthForm from '../components/auth/auth-form';
import Head from 'next/head'
import {getSession, useSession} from 'next-auth/client'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react';
import { CircularProgress } from '@material-ui/core';

function AuthPage() {
  const router = useRouter()
  const [ session, loading ] = useSession()

  if(loading) {
    return <>
      <div className="main-loading-div">
				<CircularProgress></CircularProgress>
			</div>
    </>
  }
  if(!loading){
    if(session){
      router.push('/')
      return <>
      <div className="main-loading-div">
        <CircularProgress/>
			</div>
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
