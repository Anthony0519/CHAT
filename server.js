const express = require("express")
const {dbConnect} = require("./config/dbConfig")
const cors = require("cors")
const userRouter = require("./router/userRouter")
const requestRouter = require("./router/requestRouter")

require("dotenv").config()
const port = process.env.port

const app = express()
app.use(express.json())
app.use(cors())
app.use(userRouter)
app.use(requestRouter)

dbConnect().then(()=>{
    app.listen(port,()=>{
        console.log(`server on port: ${port}`);
    })
}).catch((error)=>{
    console.log(`database connection failed: ${error.message}`)
})