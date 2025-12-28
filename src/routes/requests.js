const express=require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequestModal = require("../models/connectionRequest");
const User = require("../models/user");
const requestsRouter=express.Router();

requestsRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const fromUserId=req.user._id;
        const toUserId=req.params.toUserId;
        const status=req.params.status;

        const allowedStatus=["ignored","interested"];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({message:"Invalid Status Type:"+status})
        }

        const toUser=await User.findById(toUserId);
        if(!toUser){
            return res.status(404).json({message:"User not found"})
        }

        //IF there is an existing ConnectionRequest
        const existingConnectionRequest=await ConnectionRequestModal.findOne({
            $or:[
                {fromUserId,toUserId},
                {fromUserId:toUserId,toUserId:fromUserId}  
            ],
            });
            console.log(existingConnectionRequest);
            if(existingConnectionRequest){
                return res.status(400).json({message:"Connection Request Already Exists"});
            }
        

        const connectionRequest=new ConnectionRequestModal({
            fromUserId,
            toUserId,
            status
        });
        const data=await connectionRequest.save();

        res.status(200).json({
            success:true,
            message:req.user.firstName+" is "+status+" in "+toUser.firstName,
            data
        })

    } catch (error) {
        console.log(error);
        res.status(400).send("ERROR:" + error.message);
    }
})

requestsRouter.post("/request/review/:status/:requestId",userAuth,async(req,res)=>{
    try{
        const loggedInUser=req.user;
        const allowedStatus=["accepted","rejected"];
        const status=req.params.status;
        if(!allowedStatus.includes(status)){
            return res.status(400).json({
                    success:false,
                    message:"Status Not Allowed"
                });
        }

        //check requestId
        const requestId=req.params.requestId;
        const loggedInUserId = loggedInUser._id;
        const connectionRequest=await ConnectionRequestModal.findOne({
            _id:requestId,
            toUserId:loggedInUserId,
            status:"interested"
        });

        if(!connectionRequest){
            return res.status(404).json({success:false,message:"Connection Request Not Found"});
        }
        
        connectionRequest.status=status;
        await connectionRequest.save();
        return res.status(200).json({
            success:true,
            message:"Connection Request :"+status,
            connectionRequest
        })
    }catch(error){
        console.log("Error:"+error.message);
        return res.status(400).json({
            success:false,
            message:error.message
        })
    }
    
})

module.exports=requestsRouter;