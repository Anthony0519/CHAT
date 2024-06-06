const express = require("express")
const {dbConnect} = require("./config/dbConfig")
const mongoose = require("mongoose")
const cors = require("cors")
const userRouter = require("./router/userRouter")
const requestRouter = require("./router/requestRouter")
const socket = require("socket.io")

require("dotenv").config()
const port = process.env.port

const app = express()
app.use(express.json())
app.use(cors())
app.use("/api/chat",userRouter)
app.use("/api/chat",requestRouter)

dbConnect().then().catch((error)=>{
    console.log(`database connection failed: ${error.message}`)
})

const server = app.listen(port,()=>{
    console.log(`server on port: ${port}`);
})

const io = socket(server,{
    cors:{
        origin:"*",
        credentials:true,
    }
})

const db = mongoose.connection;

db.on("open",()=>{
    const monitorRequest = db.collection("friendRequest").watch()
    monitorRequest.on("change", (change)=>{
        if(change.operationType === "insert"){
            const userDetails = {
                id: change.fullDocument._id,
                name: `${change.fullDocument.firstName} ${change.fullDocument.lastName}`,
                profile: change.fullDocument.profilePicture
            }
            io.emit("newRequest", userDetails)
            console.log(userDetails)
        }
    })
    const monitorMessage = db.collection("messages").watch()
    monitorMessage.on("change", (change)=>{
        if(change.operationType === "insert"){
            const messageDetails = {
                sender:change.fullDocument.from,
                message:change.fullDocument.text,
                receiver:change.fullDocument.to
            }
            io.emit("new-message", messageDetails)
        }
    })
})

io.on("connection",(socket)=>{
    console.log("connected ", socket.id)
    socket.on("disconnect", ()=>{
        console.log("Disconnected")
    })
})