const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");
app.use(express.json());
app.use(cookieParser());

const authRouter=require("./routes/auth");
const profileRouter=require("./routes/profile");
const requestsRouter=require("./routes/requests");
const userRouter=require("./routes/user");

app.use("/",authRouter);
app.use("/",userRouter);
app.use("/",profileRouter);
app.use("/",requestsRouter);

connectDB()
    .then(() => {
        console.log("DB CONNECTED SUCCESSFULLY")
        app.listen(3000, (req, res) => {
            console.log("Server is started");
        });
    })
    .catch(err => { console.log(err) });


