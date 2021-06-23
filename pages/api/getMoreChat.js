
export default async function handler(req, res){
	if(req.method === 'GET'){
		const {currentChatLength} = req.query
		const dataChat = [{message: "asd asd asd asd asd", receiver: "cloyd123", sender: "labadcloyd", _id: "60f96b9045fc3c06bc3640cf"},{message: "asd asd asd asd asd", receiver: "cloyd123", sender: "labadcloyd", _id: "60f96b9045fc3c06bc3640cf"},{message: "asd asd asd asd asd", receiver: "cloyd123", sender: "labadcloyd", _id: "60f96b9045fc3c06bc3640cf"},{message: "asd asd asd asd asd", receiver: "cloyd123", sender: "labadcloyd", _id: "60f96b9045fc3c06bc3640cf"},{message: "asd asd asd asd asd", receiver: "cloyd123", sender: "labadcloyd", _id: "60f96b9045fc3c06bc3640cf"},{message: "asd asd asd asd asd", receiver: "cloyd123", sender: "labadcloyd", _id: "60f96b9045fc3c06bc3640cf"},{message: "asd asd asd asd asd", receiver: "cloyd123", sender: "labadcloyd", _id: "60f96b9045fc3c06bc3640cf"},{message: "asd asd asd asd asd", receiver: "cloyd123", sender: "labadcloyd", _id: "60f96b9045fc3c06bc3640cf"},{message: "asd asd asd asd asd", receiver: "cloyd123", sender: "labadcloyd", _id: "60f96b9045fc3c06bc3640cf"}]
		setTimeout(()=>{
			res.status(201).json(dataChat)
		},2000)
	}
}