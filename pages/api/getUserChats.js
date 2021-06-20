import {User} from '../../models/usermodel'

export default async function handler(req,res){
	if(req.method === "GET"){
		const {username} = req.query
		try{
			const response = await User.findOne({username:username})
			console.log(response)
			res.status(201).json(response)
		}catch(error){
			res.json(error)
		}
	}
}