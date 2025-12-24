const express=require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequestModal = require("../models/connectionRequest");
const  mongoose = require("mongoose");
const User = require("../models/user");
const userRoutes=express.Router();


const USER_SAFE_DATA="firstName lastName photoUrl age gender about skills";

//get all pending connection request for the loggedIn User
userRoutes.get("/user/requests/received",userAuth,async (req,res)=>{
    try{
    const loggedInUser=req.user;
    const connectionRequest=await ConnectionRequestModal.find({toUserId:loggedInUser._id,status:"interested"})
    .populate("fromUserId","firstName lastName photoUrl emailId");
    //.populate("fromUserId",["firstName","lastName"]);

    if(!connectionRequest){
        return res.status(404).json({
            success:false,
            message:"No Connection Requests found"
        })
    }

    res.json({message:"Data Fetched Successfully",connectionRequest});
    }catch(error){
        console.log("ERROR:"+error.message);
        return res.status(400).json({success:false,message:"Error:"+error.message});
    }
})

userRoutes.get("/user/requests/connections",userAuth,async(req,res)=>{
    try{
        const loggedInUser=req.user;
        const connections=await ConnectionRequestModal.find({
            $or:[
                {fromUserId:loggedInUser._id,status:"accepted"},
                {toUserId:loggedInUser._id,status:"accepted"},
            ],
        }).populate("fromUserId",USER_SAFE_DATA)
        .populate("toUserId",USER_SAFE_DATA);

        const data=connections.map((row)=>{
            if(row.fromUserId._id.toString()===loggedInUser._id.toString()){
                return row.fromUserId;
            }
                return row.fromUserId;
        });

        res.json({success:true,message:"Fetched Successfully",data});
    }catch(error){
        console.log("error:"+error.message);
        return res.status(400).json({success:false,message:"Error"+error.message});
    }
})

userRoutes.get("/user/feed",userAuth,async(req,res)=>{
    try{
        const loggedInUser=req.user;
        
        const connectionRequest=await ConnectionRequestModal.find({
            $or:[
                {fromUserId:new mongoose.Types.ObjectId(loggedInUser._id)},
                {toUserId:new mongoose.Types.ObjectId(loggedInUser._id)},
            ]
        }).select("fromUserId toUserId");

        const HideUserFromFeed=new Set();
        connectionRequest.forEach((req)=>{
            HideUserFromFeed.add(req.fromUserId.toString());
            HideUserFromFeed.add(req.toUserId.toString());
        });
        console.log(HideUserFromFeed);

        const user=await User.find({
            $and:[
                {_id:{$nin:Array.from(HideUserFromFeed)}},
                {_id:{$ne:loggedInUser._id}}]
        }).select(USER_SAFE_DATA);

        res.json({message:"FEED",connectionRequest,loggedInUser,user});
    }catch(error){
        console.log("ERROR::"+error.message);
        return res.status(400).json({
            success:false,
            message:'ERROR'+error.message
        })
    }
})

module.exports=userRoutes;