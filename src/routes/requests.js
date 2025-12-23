const express=require("express");
const { userAuth } = require("../middlewares/auth");
const requestsRouter=express.Router();

requestsRouter.post("/sendconnectionrequest", userAuth, async (req, res) => {
    try {
        console.log("SEND CONNECTION");
        res.send("CONNECTION REQUEST SENT BY:" + req.user.firstName);
    } catch (error) {
        res.send("ERROR:" + error.message);
    }
})

module.exports=requestsRouter;