import {User} from '../../models/usermodel'

export default async function handler(req, res){
	if(req.method ==='PATCH'){
		const {chatID, chatPartner, username} = req.body
		try{
			await User.findOneAndUpdate({username:username},{ $push: { "chats": {chatID: chatID, chatPartner:chatPartner} } })
			await User.findOneAndUpdate({username:chatPartner},{ $push: { "chats": {chatID: chatID, chatPartner:username} } })
			res.status(201)
		}catch(err){
			res.json(err)
		}
		
	}
}