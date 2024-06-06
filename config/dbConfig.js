const mongoose = require("mongoose")
require("dotenv").config()
const dbConnect = async ()=>{
    try {
       await mongoose.connect(
        process.env.dbLink,
    )
       
        console.log("Database Connected")

    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {dbConnect}