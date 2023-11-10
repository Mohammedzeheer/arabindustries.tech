const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {type: String,  required: [true, "Username Required"],unique: true},
    email :{type: String, required:true}, 
    password: {type: String, required: [true, "Password Required"]}, 
    image:    {type: String}
})

module.exports = mongoose.model('Users', userSchema)