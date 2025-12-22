const express=require("express");
const { adminAuth, userAuth } = require("./middlewares/auth");
const connectDB=require("./config/database");
const User=require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const app=express();
const bcrypt=require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt=require("jsonwebtoken");
app.use(express.json());
app.use(cookieParser());
//Create new User in DB
app.post("/signup",async (req,res)=>{
    try{
    //validation
    validateSignUpData(req);
    const {password}=req.body;
    //encrypt password
    console.log(req.body);
    const passwordHash=await bcrypt.hash(password,10);

    const user=new User({
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        emailId:req.body.emailId,
        password:passwordHash,
    });
    
        await user.save();
        
    }catch(error){
        console.log(error);
        res.status(400).send("ERROR:"+error.message);
    }
    res.send("Done");
})

//login
app.post("/login",async(req,res)=>{
    try{
        const {emailId,password}=req.body;
        const user=await User.findOne({emailId});
        if(!user){
            throw new Error("Invalid Credentials");
        }
        console.log(user);
        const isPasswordValid=await bcrypt.compare(password,user.password);
        if(isPasswordValid){
            //create a JWT TOKEN
            const token=jwt.sign({_id:user._id},"DEV@TINDER$790",{expiresIn:"1d"})
            console.log(token)
            //Add the Token into cookie
            res.cookie("token",token);
            res.send("Password is correct || Logged Successfully");
        }else{
            throw new Error("Please Enter Correct Password");
        }
    }catch(error){
        console.log("error",error.message);
        res.status(400).send("Error:"+error.message);
    }
})



app.get("/profile",userAuth,async(req,res)=>{
    try{
        const user=req.user;
        res.send("USER: "+user);
    }catch(error){
        console.log(error.message);
        res.send("Invalid Cookie");
    }
})

app.post("/sendconnectionrequest",userAuth,async(req,res)=>{
    try{
        console.log("SEND CONNECTION");
        res.send("CONNECTION REQUEST SENT BY:"+req.user.firstName);
    }catch(error){
        res.send("ERROR:"+error.message);
    }
})

connectDB()
.then(()=>{
    console.log("DB CONNECTED SUCCESSFULLY")
    app.listen(3000,(req,res)=>{
        console.log("Server is started");
    });
})
.catch(err=>{console.log(err)});


