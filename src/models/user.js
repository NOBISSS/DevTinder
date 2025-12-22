const mongoose=require("mongoose");
const validator=require("validator");
const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
    },
    lastName:{
        type:String,
    },
    emailId:{
        type:String,
        lowercase:true,
        unique:true,
        required:true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email Address"+value)
            }
        }
    },  
    password:{
        type:String,
        required:true,
         validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter Strong password"+value)
            }
        }
    },
    age:{
        type:Number,
    },
    gender:{
        type:String,
    },
    photoUrl:{
        type:String,
         validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid URL")
            }
        }
    },
    about:{
        type:String,
        default:"This is a Default Description"
    },
    skills:{
       type:[String], 
    }
})

module.exports=mongoose.model("User",userSchema);