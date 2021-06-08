const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		min: 1,
		required:true,
	},
	password: {
		type: String,
		required: true
	},
	chats:[
		{
			chatID:String,
		}
	]
}, {
    timestamps: true
})
//it is very important to structure the model like this as Nextjs has a bug that creates the models again every render if the model is not done like this
const User = mongoose.models.User || mongoose.model('User', userSchema )

export {User}