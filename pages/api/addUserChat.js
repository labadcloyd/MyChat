import {User} from '../../models/usermodel'

export default async function handler(req, res){
	if(req.method ==='PATCH'){
		const {chatID, chatPartner, username} = req.body
		try{
			await User.findOneAndUpdate({username:username},{ 
				$push: { 
					"chats": {
						$each:[{chatID: chatID, chatPartner:chatPartner}],
						$position:0
					}
				}
			})
			await User.findOneAndUpdate({username:chatPartner},{ 
				$push: { 
					"chats": {
						$each:[{chatID: chatID, chatPartner:username}],
						$position:0
					}
				}
			})
			return res.status(201)
		}catch(err){
			return res.json(err)
		}
		
	}
}