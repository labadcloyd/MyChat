import {Chats} from '../../models/chatmodel'

export default async function handler(req, res){
	if(req.method === 'GET'){
		const {currentChatLength, chatID } = req.query

		/* 
		!	I'M NOT SURE IF CONSTANTLY QUERYING THE CHAT DOCUMENT WOULD BE EFFICIENT
		*/
		const data = await Chats.find({chatID:chatID})
		const chats = data[0].messages
		if(chats.length === currentChatLength){
			return res.status(201).json({hasReachedTop:true})
		}
		/* Using negative numbers to get the elements starting from the bottom */
		const slicedChats = chats.slice(((currentChatLength * -1)-20), (currentChatLength * -1))
		return res.status(201).json(slicedChats)

		/* OLD QUERY */
		// /*
		// 	! There is a bug when using $slice and entering numbers for amount of objects to skip and amount of object to return.
		// 	! The numbeer of objects to be returned needs to be added to the number of objects to skip.
		// 	* the $slice method takes two parameters, the number of objects to skip, and the number of objects to be returned.
		// */
		// const chatLength = ((currentChatLength * -1)-20)
		// console.log(chatLength)
		// const chatData = await Chats.find({chatID: chatID}, { messages: { $slice: [ chatLength, 20 ] } })
		// res.status(201).json(chatData[0].messages)
	}
}