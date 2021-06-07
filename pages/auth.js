import AuthForm from '../components/auth/auth-form';
import Head from 'next/head'
import {getSession} from 'next-auth/client'

function AuthPage(props) {

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

export async function getServerSideProps(context){
	const session = await getSession({req:context.req})

	if(session){
		return{
      props:{
        session:session
      },
			redirect:{
				destination: '/'
			}
		}
	}
  return{
    props:{
      fakeProps:'fake props'
    }
  }
}