const {Schema,model} = require("mongoose")

const requestSchema = new Schema({
    from:{
        type:Schema.Types.ObjectId,
        ref:"users"
    },
    to:{
        type:Schema.Types.ObjectId,
        ref:"users"
    },
    status:{
        type:String,
        Enum:["pending","Accepted"],
        default:"pending"
    },
})

const friendReqModel = model("friendRequest",requestSchema)

module.exports = friendReqModel
