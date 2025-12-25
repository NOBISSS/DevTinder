const express=require("express");
const authRouter=express.Router();
const User=require("../models/user");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const { validateSignUpData } = require("../utils/validation");

authRouter.post("/signup", async (req, res) => {
    try {
        //validation
        validateSignUpData(req);
        const { password } = req.body;
        //encrypt password
        console.log(req.body);
        const passwordHash = await bcrypt.hash(password, 10);

        const user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            emailId: req.body.emailId,
            password: passwordHash,
            gender:req.body.gender,
            photoUrl:req.body.photoUrl,
            age:req.body.age,
            about:req.body.about,
            skills:req.body.skills
        });

        await user.save();

    } catch (error) {
        console.log(error);
        res.status(400).send("ERROR:" + error.message);
    }
    res.send("Done");
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
            res.cookie("token", token);
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