const mongoose = require("mongoose")
require("dotenv").config()

const DB = process.env.dbLink

mongoose.connect(DB).then(()=>{
    console.log("DATABASE CONNECTED");
}).catch((err)=>{
    console.log(err.message);
})

// const dbConnect = async ()=>{
//     try {
//        await mongoose.connect(
//         process.env.dbLink,
//     )
       
//         console.log("Database Connected")

//     } catch (error) {
//         console.log(error.message);
//     }
// }

// module.exports = {dbConnect}