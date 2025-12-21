const express=require("express");
const { adminAuth, userAuth } = require("./middlewares/auth");
const connectDB=require("./config/database");
const User=require("./models/user");
const app=express();

app.post("/signup",async (req,res)=>{
    //Creating a new instance of the user model
    const user=new User({
        firstName:"Parth",
        lastName:"Chauhan",
        emailId:"abc@gmail.com",
        password:"abc@123",
        gender:"male"
    }); 
    await user.save();
    res.send("User Added Successfully");
})

connectDB()
.then(()=>{
    console.log("DB CONNECTED SUCCESSFULLY")
    app.listen(3000,(req,res)=>{
        console.log("Server is started");
    });
})
.catch(err=>{console.log(err)});


