const validator=require("validator");
const validateSignUpData = (req) => {
    const { firstName, lastName, emailId, password } = req.body || {};
  
    if (!firstName || !lastName) {
      throw new Error("Please Enter Name");
    }
  
    if (firstName.length < 4 || firstName.length > 40) {
      throw new Error("Length of name should be between 4 and 40");
    }
  
    if (!validator.isEmail(emailId)) {
      throw new Error("Please Enter Valid Email");
    }
  
    if (!validator.isStrongPassword(password)) {
      throw new Error("Please Enter Strong Password");
    }
  };
  

const validateEditProfileData=(req)=>{
    const AllowedEditFiels=["firstName","lastName","emailId","photoUrl","gender","age","about","skills"];
    const isEditAllowed=Object.keys(req.body).every(k=>AllowedEditFiels.includes(k));
    return isEditAllowed;
}

const validatePasswordStrength=(newPassword)=>{
    const isPasswordStrong=validator.isStrongPassword(newPassword);
    return isPasswordStrong;
}



module.exports={
    validateSignUpData,
    validateEditProfileData,
    validatePasswordStrength
}