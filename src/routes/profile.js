const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData, validatePasswordStrength } = require("../utils/validation");
const User = require("../models/user");
const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.json({
            success:true,
            message:"USER'S PROFILE FETCHED SUCCESSFULLY",
            user
        });
    } catch (error) {
        console.log(error.message);
        res.send("Invalid Cookie");
    }
})

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        if (!validateEditProfileData(req)) {
            throw new Error("Invalid Edit Request");
        }

        const loggedInUser = req.user;
        console.log(loggedInUser);
        Object.keys(req.body).forEach(key => (loggedInUser[key] = req.body[key]));
        console.log("AFTER UPDATING :", loggedInUser);
        await loggedInUser.save();
        res.json({ message: `${loggedInUser.firstName}, Your Updated Successfully`,
            user:loggedInUser

         });
    } catch (error) {
        console.log(error.message);
        res.status(401).json({success:false,message:error.message});
    }
})

profileRouter.patch("/profile/password",userAuth,async(req,res)=>{
    try{
        //get Existing And New Password
        const user=req.user;
        const {existingPassword,newPassword}=req.body;
        //check existing password correct or not

        await user.validatePassword(existingPassword)

        //if existing password matchs then check new password is strong or not
        if(!validatePasswordStrength(newPassword)){
            return res.status(400).json({message:"Password is too weak"});
        }

        const isSame=await user.isSamePassword(newPassword);
        if(isSame){
            return res.status(400).json({message:"New Password must be different"})
        }

        //if it strong then update after hashing password
        await user.hashPassword(newPassword)
        
            res.status(200).json({
                success:true,
                message:"Password Updated Successfully"
            })
    }catch(error){  
        console.log("ERROR:",error.message);
        res.send("Error:"+error.message);
    }
})

module.exports = profileRouter;