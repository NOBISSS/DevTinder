const express=require("express");

const app=express();

app.use("/user/:id",
    (req,res,next)=>{
        console.log("REQUEST PARAMS:",req.params);
        next();
        res.send("Response from 1st one");
    },
    (req,res)=>{
        console.log("REQUEST PARAMS2nd:",req.params);
        res.send("Response from 2nd one");
    })

app.listen(3000,(req,res)=>{
    console.log("Server is started");
});
