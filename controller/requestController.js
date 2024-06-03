const userModel = require("../model/userModel")
const requestModel = require("../model/RequestModel")

exports.addFriends = async(req,res)=>{
    try{
        
        // get the sender's id
        const senderId = req.user.userId
        // get the user's id
        const receiverId = req.params.id

        // find the sender
        const sender = await userModel.findById(senderId)
        // get the receiver
        const receiver = await userModel.findById(receiverId)

        // check if user's are already friends
        if(sender.friends.includes(receiverId) && receiver.friends.includes(senderId)){
            return res.status(400).json({
                error:"you are friends already"
            })
        }

        // check if request is already sent 
        const request = await requestModel.findOne({$and:[{from:senderId},{to:receiverId}]})
        if(request){
            return res.status(400).json({
                error:"request sent already"
            })
        }

        // create the request
         const sendRequest = await requestModel.create({
            from:senderId,
            to:receiverId
        })

        // throw a success message
        res.status(200).json({
            message:"Request sent",
            data:sendRequest
        })

    }catch(error){
        res.status(500).json({
            error:error.message
        })
    }
}

exports.acceptRequest = async (req,res)=>{
    try{
        
        // get the request id
        const requestId = req.params.id

        // find the request 
        const request = await requestModel.findById(requestId)
        // validate the request
        if(!request){
            return res.status(404).json({
                error:"This request is invalid or might have been deleted"
            })
        }

        // extract the users associated to the request
        const sender = await userModel.findById(request.from)
        const receiver = await userModel.findById(request.to)

         // check if user's are already friends
         if(sender.friends.includes(receiver._id) && receiver.friends.includes(sender._id)){
            return res.status(400).json({
                error:"you are friends already"
            })
        }

        // update the request status
        request.status = "Accepted"
        await request.save()

        // add both id's to their friends list array
        sender.friends.push(receiver._id)
        await sender.save()
        receiver.friends.push(sender._id)
        await receiver.save()

        // show success message
        res.status(200).json({
            message:"You are now friends"
        })

    }catch(error){
        res.status(500).json({
            error:error.message
        })
    }
}

exports.getAllRequest = async(req,res)=>{
    try{

        // get all the users in the dataBase
        const requests = await requestModel.find()

        if(!requests || requests.length === 0){
            return res.status(404).json({
                error:"no friends yet"
            })
        }

        res.status(200).json({
            data:requests
        })

    }catch(error){
        res.status(500).json({
            error:error.message
        })
    }
}

exports.getAllUsersRequest = async(req,res)=>{
    try{

        const {userId} = req.user
        // get all the users in the dataBase
        const requests = await requestModel.find().where('to').equals(`${userId}`)

        if(!requests || requests.length === 0){
            return res.status(404).json({
                error:"no friends request yet"
            })
        }

        res.status(200).json({
            data:requests
        })

    }catch(error){
        res.status(500).json({
            error:error.message
        })
    }
}

exports.declineRequest = async(req,res)=>{
    try{

        // get thne request id
        const requestId = req.params.id

        // find the request and delete Request
        const deleteRequest = await requestModel.findByIdAndDelete(requestId)
        // validate if the request is deleted
        if(!deleteRequest){
            return res.status(404).json({
                error:"request not found. It might have been deleted"
            })
        }

        res.status(200).json({
            message:"Request Declined"
        })

    }catch(error){
        res.status(500).json({
            error:error.message
        })
    }
} 