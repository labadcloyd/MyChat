const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
	chatID: String,
	chatUsers: [String],
	messages:[
		{
			message:String,
			sender:String,
			receiver:String
		}
	]
}, {
    timestamps: true
})
//it is very important to structure the model like this as Nextjs has a bug that creates the models again every render if the model is not done like this
const Chats = mongoose.models.Chats || mongoose.model('Chats', chatSchema )

module.exports = {Chats}