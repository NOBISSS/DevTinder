const express=require("express");
const { adminAuth, userAuth } = require("./middlewares/auth");

const app=express();


app.get("/getUser",(req,res)=>{
    throw new Error("ABCD");
})

app.use("/",(err,req,res,next)=>{
    if(err){
        console.log(err);
        res.status(500).send(err.message);
    }
})


app.listen(3000,(req,res)=>{
    console.log("Server is started");
});
