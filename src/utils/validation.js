const validator=require("validator");
const validateSignUpData=(req)=>{
    const {firstName,lastName,emailId,password}=req.body;
    if(!firstName || !lastName){
        throw new Error("Please Enter Name")
    }else if(firstName.length< 4 || lastName.length>40){
        throw new Error("Length of name should be between 4 and 40");
    }else if(!validator.isEmail(emailId)){
        throw new Error("Please ENter Valid Email iD");
    }else if(!validator.isStrongPassword(password)){
        throw new Error("PLease ENter Strong Password");
    }
}

module.exports={
    validateSignUpData
}