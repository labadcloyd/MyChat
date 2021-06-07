import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import {User} from '../../../models/usermodel'
import {verifyPassword} from '../../../utilsServer/hash'

export default NextAuth({
  session:{
    jwt:true,
  },
  providers: [
    Providers.Credentials({
      authorize: 
        async (credential)=>{
          const user = await User.findOne({username: credential.username})
          if(!user){
            throw new Error('No user was found');
          }
          const isValid = await verifyPassword(credential.password, user.password)
          if(!isValid){
            throw new Error('Incorred password or account');
          }
          return Promise.resolve({name:user.username})
        }
    }),
    Providers.Google({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET
    }),
  ],

  // A database is optional, but required to persist accounts in a database
  database: process.env.MONGO_URI,
})