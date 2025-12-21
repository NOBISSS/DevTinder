const mongoose=require("mongoose");

const connectDB=async()=>{
    await mongoose.connect("mongodb+srv://parthchauhan220:oyjK42JFXL9ky0rw@clusterone.earhqof.mongodb.net/devTinder");
}

module.exports=connectDB;



