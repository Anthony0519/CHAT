const {Schema,model} = require("mongoose")

const date = new Date().toLocaleString('en-NG', {timeZone: 'Africa/Lagos', ...{weekday:'short', day: '2-digit', month: 'short', year:'numeric', }})
const time = new Date().toLocaleString('en-NG', { timeZone: 'Africa/Lagos', ...{ hour: '2-digit', minute: '2-digit', hourCycle: 'h23' } })

const [hour,minute] = time.split(':')
const status = hour >= 12 ? "PM" : "AM"
const newTime = `${hour}:${minute} ${status}`
const joinedAt = `${date} ${newTime}`

const userSchema = new Schema({
    firstName:{
        type:String,
        required:true,
    },
    lastName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    profilePicture:{
        type:String,
    },
    friends:[{
        type:Schema.Types.ObjectId,
        ref:"users"
    }],
    blockedFriends:[{
        type:Schema.Types.ObjectId,
        ref:"users"
    }],
    dateJoined:{
        type:String,
        default:joinedAt
    },
})

const userModel = model("users",userSchema)

module.exports = userModel