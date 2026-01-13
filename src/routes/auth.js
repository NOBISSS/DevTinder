const express=require("express");
const authRouter=express.Router();
const User=require("../models/user");
const bcrypt=require("bcrypt");
const { validateSignUpData } = require("../utils/validation");
const {uploadToCloudinary} =require("../config/cloudinaryUpload");
const upload=require("../middlewares/upload");
authRouter.post("/signup",upload.single("photo"), async (req, res) => {
    try {
        //validation
        console.log("REQ:::",req);
        validateSignUpData(req);
        const {firstName,lastName,emailId,password,age,gender,about,skills}=req.body;
        const skillsArray=typeof skills==='string' ? JSON.parse(skills) : skills;
        let photoUrl=null;
        console.log("REQFILE:",req.file);
        if(req.file){
            photoUrl=await uploadToCloudinary(req.file.buffer,'devtinder/users');
        }
        //encrypt password
        console.log(req.body);
        const passwordHash = await bcrypt.hash(password, 10);

        const user = new User({
            firstName: firstName,
            lastName: lastName,
            emailId: emailId,
            password: passwordHash,
            gender: gender,
            photoUrl: photoUrl,
            age: age,
            about: about,
            skills: skills
        });

        const savedUser=await user.save();
         const token = await savedUser.getJWT();
        res.cookie("token", token,{
                expires:new Date(Date.now()+8*3600000)
        });
        const userResponse=user.toObject();
        delete userResponse.password;
        res.status(201).json({
            success:true,
            message:"User Created Successfully",
            user:savedUser
        });
    } catch (error) {
        console.log(error);
        res.status(400).send("ERROR:" + error.message);
    }
    
})

authRouter.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;
        const user = await User.findOne({ emailId });
        if (!user) {
            throw new Error("Invalid Credentials");
        }
        console.log(user);
        const isPasswordValid =await user.validatePassword(password);
        if (isPasswordValid) {
            const token = await user.getJWT();
            res.cookie("token", token,{
                expires:new Date(Date.now()+8*3600000)
            });
            res.status(200).json({
                success:true,
                message:"Logged Successfully",
                user:user
            })
        } else {
            throw new Error("Please Enter Correct Password");
        }
    } catch (error) {
        console.log("error", error.message);
        res.status(400).json({success:false,message:error.message});
    }
})

authRouter.post("/logout",async(req,res)=>{
    try{
        res.cookie("token",null,{expires:new Date(Date.now())});
        res.send("Logged Out Successfully");
    }catch(error){
        console.log("Error:",error.message);
        res.send("ERROR::"+error.message);
    }
})
module.exports=authRouter;