const mongoose = require("mongoose");
require("dotenv").config();

exports.connect = ()=>{
    mongoose.connect(process.env.MONGODB_URL).then(()=>{
        console.log("db is connected successfully");
    }).catch((error)=>{
        console.log(error);
        console.log("error in connecting mongodb" , error);
        process.exit(1);
    })
}
