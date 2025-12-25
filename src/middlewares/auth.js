const jwt=require("jsonwebtoken");
const User = require("../models/user");
const adminAuth=(req,res,next)=>{
    console.log("ADMIN MIDDLEWARE");
    const token="XYZ";
    if(token==="XYZZ"){
        next();
    }else{
        res.status(401).send("Not Authorized");
    }
}

const userAuth=async(req,res,next)=>{
    try{
    const {token}=req.cookies;
    if(!token){
        return res.status(401).json({
            success:false,
            message:"Please Login"
        })
    }
    const decoded=jwt.verify(token,"DEV@TINDER$790");
    const user=await User.findById(decoded);
    if(!user){
        throw new Error("Not Found");
    }
    req.user=user;
    next();
    }catch(error){
        console.log(error.message);
        res.status(400).send("Error: "+error.message);
    }
}

module.exports={
    adminAuth,
    userAuth
}