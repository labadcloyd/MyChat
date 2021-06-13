import '../styles/globals.css'
import Layout from '../components/layout/layout'
import { Provider } from 'next-auth/client';
import Head from 'next/head'
import {io, SocketContext} from '../context/socketContext'

function MyApp({ Component, pageProps }) {
  return (
    <Provider session={pageProps.session}>
      <SocketContext.Provider value={io}>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <link rel="icon" type="ico" sizes="32x32" href="/images/favicon.ico" />
        </Head>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </SocketContext.Provider>
    </Provider>
  )
}

export default MyApp
