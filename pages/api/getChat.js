import {User} from '../../models/usermodel'
import {Chats} from '../../models/chatmodel'
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req,res){
	if(req.method==='GET'){
		const uniqueID = uuidv4()
		try{
			const {queriedUsername, username} = req.query
			/* 
				! this query takes too much resources 
			*/
			const currentChat = await Chats.findOne({ chatUsers: { $all: [queriedUsername, username] } })
			if(!currentChat){
				const newChat = await new Chats({chatID: uniqueID, chatUsers: [queriedUsername, username], messages:[] })
				try{
					await Chats.insertMany(newChat)
					res.status(201).json(newChat)
				}catch(err){
					console.log(err)
				}
			}
			if(currentChat){
				res.status(201).json(currentChat)
			}
		}catch(err){
			res.json(error)
		}
	}
	if(req.method==='PATCH'){
		try{

		}catch(error){
			
		}
	}
}