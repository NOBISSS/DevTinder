const express=require("express");
const { userAuth } = require("../middlewares/auth");
const profileRouter=express.Router();

profileRouter.get("/profile", userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send("USER: " + user);
    } catch (error) {
        console.log(error.message);
        res.send("Invalid Cookie");
    }
})

module.exports=profileRouter;