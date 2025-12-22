const express=require("express");
const { adminAuth, userAuth } = require("./middlewares/auth");
const connectDB=require("./config/database");
const User=require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const app=express();
const bcrypt=require("bcrypt");
app.use(express.json());
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
            res.send("Password is correct || Logged Successfully");
        }else{
            throw new Error("Please Enter Correct Password");
        }
    }catch(error){
        console.log("error",error.message);
        res.status(400).send("Error:"+error.message);
    }
})

//Find One User
app.get("/user",async(req,res)=>{
    const user=await User.find({emailId:req.body.emailId})
    if(user.length===0){ res.status(404).send("User not Found")}else{
    res.send(user);
    }
})

app.put("/user",async(req,res)=>{
    let email=req.body.emailId;
    email="XYZ@gmail.com";
    const user=await User.findOneAndUpdate({emailId:req.body.emailId},{emailId:email});
    if(!user) return res.status(404).send("User not found");
    res.send("User Data Updated");
})
// app.patch("/user",async(req,res)=>{
//     let email=req.body.emailId;
//     email="XYZ@gmail.com";
//     const user=await User.findOneAndUpdate({emailId:req.body.emailId},{emailId:email});
//     if(!user) return res.status(404).send("User not found");
//     res.send("User Data Updated");
// })

app.patch("/user",async(req,res)=>{
    const data=req.body;
    try{
    const ALLOWED_UPDATES=[
        "photourl",
        "userId",
        "about",
        "gender",
        "age",
        "skills"
    ]

    const isUpdateAllowed=Object.keys(data).every(k=>ALLOWED_UPDATES.includes(k));
    if(!isUpdateAllowed){
        res.status(400).send("Only Update Allowed Fields");
    }
    email="XYZ@gmail.com";
    const user=await User.findOneAndUpdate({_id:data.userId},data,{
        returnDocument:"before",
        runValidators:true
    });
    console.log(user);
    if(!user) return res.status(404).send("User not found");
    res.send("User Data Updated");
    }catch(error){
        console.log("Error Occured While Updating User")
        throw new Error("Failed to Update");
    }
})

app.use((err,req,res,next)=>{
    if(err){
        console.log("Error :",err);
    }
    next();
})

connectDB()
.then(()=>{
    console.log("DB CONNECTED SUCCESSFULLY")
    app.listen(3000,(req,res)=>{
        console.log("Server is started");
    });
})
.catch(err=>{console.log(err)});


