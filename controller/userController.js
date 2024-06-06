const userModel = require("../model/userModel")
const requestModel = require("../model/RequestModel")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

exports.signUp = async (req, res) =>{
    try{
        const {
            firstName,
            lastName,
            email,
            password,
    } = req.body
        const userExists = await userModel.findOne({email})

        if(userExists){
            return res.status(400).json({
                message: `User with email: ${userExists.email} already exists`
            })
        }

        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password, salt)

        const user = await userModel.create({
            firstName,
            lastName,
            email:email.toLowerCase(),
            password: hash,
        })
        res.status(201).json({
            message: `Welcome, ${user.firstName}. You have created an account successfully`,
            data: user
        })

    }catch(err){
        res.status(500).json({
            message: err.message 
        })
    }

}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if the provided detail is an email or phone number
        const user = await userModel.findOne({email});

        if (!user) {
            return res.status(404).json({
                message: 'User not found',
            });
        }

        // Check if the provided password is correct
        const isPasswordValid = bcrypt.compareSync(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({
                message: 'Invalid password',
            });
        }

        // Create and sign a JWT token
        const token = jwt.sign(
            {
                userId: user._id,
                email: user.email,
            },
            process.env.jwt_secret,
            { expiresIn: '1d' }
        );

        res.status(200).json({
            message: `Welcome onboard, ${user.firstName}. You have successfully logged in`,
            data: user,
            token,
        });
    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
}

exports.logOut = async (req, res) => {
    try {
        const userId = req.user.userId;

        const user = await userModel.findById(userId)

        if (!user) {
            return res.status(404).json({
                message: 'This user does not exist',
            });
        }
        let token = req.headers.authorization.split(' ')[1];

         // Create and sign a new JWT token once logged out
         const loggedOutToken = jwt.sign(
            {
                userId: user._id,
                email: user.email,
            },
            process.env.jwt_secret,
            { expiresIn:1 }
        )

        token = loggedOutToken


        res.status(200).json({
            message: 'User signed out successfully',
            user,
            token:token
        });
    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
}

exports.getUsers = async(req,res)=>{
    try{

        // get all the users in the dataBase
        const users = await userModel.find()

        if(!users || users.length === 0){
            return res.status(404).json({
                error:"no friends yet"
            })
        }

        // const details = users.map(user=>({
        //     userName:user.firstName + user.lastName,
        //     id:user._id
        // }))

        res.status(200).json({
            data:users
        })

    }catch(error){
        res.status(500).json({
            error:error.message
        })
    }
}

exports.getAllFriends = async(req,res)=>{
    try{

        // get the logged in user's id
        const {userId} = req.user
        // fetch the user from the database
        const user = await userModel.findById(userId).populate("friends")
        // console.log(user.friends)
        
        // map out thne user friends details from the friends array
        const friends = user.friends.map(friend => ({
            id: friend._id,
            profile: friend.profilePicture,
            name: friend.firstName + ' ' + friend.lastName
        }));

        res.status(200).json({
            data:friends,
            // details:user
        })

    }catch(error){
        res.status(500).json({
            error:error.message
        })
    }
}

exports.deleteAccount = async(req,res)=>{ 
    try{

        // get the user's id
        const {userId} = req.user

        // check if the user has any pending request
        // const pendingReq = await requestModel.find().where("from").equals(`${userId}`)

        // delete any pendin request
        await requestModel.deleteMany({from:userId, status:"pending"})

        // find the user and delete
        await userModel.findByIdAndDelete(userId)

        res.status(200).json({
            message:"Account Deleted"
        })

    }catch(error){
        res.status(500).json({
            error:error.message
        })
    }
}

exports.blockAndUnblockFriend = async(req,res)=>{ 
    try{

        // get the user's id 
        const {userId} = req.user
        // fetch the user from DB
        const user = await userModel.findById(userId)

        // get the friend's id 
        const friendId = req.params.id
        // fetch the user with the id
        const friend = await userModel.findById(friendId)
        // validat the fetch
        if(!friend){
            return res.status(404).json({
                error:"user not found"
            })
        }

        // block the user
        if(user.friends.includes(friendId) && !user.blockedFriends.includes(friendId)){

            user.blockedFriends.push(friendId)
            await user.save()

            return res.status(200).json({
                message:"user blocked",
                data:user
            })
        }

        // console.log(friendId)
        // console.log(user.blockedFriends)   

        // unblock the user
       const block = user.blockedFriends.filter(id=>id.toString() != friendId.toString())
    //    console.log('Blocked:', block)
    
    //   update the filtered friends
       user.blockedFriends = block;
       await user.save()    

        res.status(200).json({
            message:"user unblocked",
            data:user
        })

    }catch(error){
        res.status(500).json({
            error:error.message
        })
    }
}