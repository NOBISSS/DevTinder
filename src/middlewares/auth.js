const adminAuth=(req,res,next)=>{
    console.log("ADMIN MIDDLEWARE");
    const token="XYZ";
    if(token==="XYZZ"){
        next();
    }else{
        res.status(401).send("Not Authorized");
    }
}

const userAuth=(req,res,next)=>{
    console.log("USER MIDDLEWARE");
    const token="XYZ";
    if(token==="XYZ"){
        next();
    }else{
        res.status(401).send("Not Authorized");
    }
}

module.exports={
    adminAuth,
    userAuth
}