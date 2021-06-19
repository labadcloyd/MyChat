import {User} from '../../models/usermodel'
import {Chats} from '../../models/chatmodel'
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req,res){
	if(req.method==='GET'){
		try{
			const {userQuery, username} = req.query
			/* Querying for a user that isn't equal to the current user and only getting the username*/
			const userChatDetails = await User.find({username: {$regex:userQuery, $ne:username}}, {username:1} )
			res.status(201).json(userChatDetails) 
		}catch(error){
			res.json(error)
		}
	}
}