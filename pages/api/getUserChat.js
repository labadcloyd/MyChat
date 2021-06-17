import {User} from '../../models/usermodel'

export default async function handler(req,res){
	if(req.method==='GET'){
		try{
			const {userQuery, username} = req.query
			const userChatDetails = await User.find({username: {$regex:userQuery, $ne:username}}, {username:1} )
			console.log(userChatDetails)
			res.status(201).json(userChatDetails) 
		}catch(error){
			res.json(error)
		}
	}
}