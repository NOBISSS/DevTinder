const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ["ignored", "interested", "accepted", "rejected"],
            message: `{VALUE} is incorrect status type`
        }
    }
}, { timestampes: true });

//ConnectionRequest.find({fromUserId:123128490124}) Compound Index
connectionRequestSchema.index({fromUserId:1,toUserId:1});

connectionRequestSchema.pre("save",function () {
    const connectionRequest=this;
    //check if the fromUserId as same as to toUserId
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
         throw new Error("Cannot Send Connection request to yourself");
    }
});

const ConnectionRequestModal=new mongoose.model("ConnectionRequest",connectionRequestSchema)
module.exports=ConnectionRequestModal;


