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
    },  
    password:{
        type:String,
        required:true,
    },
    age:{
        type:Number,
        min:18
    },
    gender:{
        type:String,
        validate(value){
            if(!["male","female","other"].includes(value)){
                throw new Error("Please Enter Valid Gender")
            }
        }
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