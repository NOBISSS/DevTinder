require("dotenv").config();
const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(cors({
  origin: ["http://localhost:5173", "https://dev-tinder-mu-lyart.vercel.app/"],
  credentials: true
}));
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestsRouter = require("./routes/requests");
const userRouter = require("./routes/user");
app.use("/", authRouter);
app.use("/", userRouter);
app.use("/", profileRouter);
app.use("/", requestsRouter);
connectDB().then(() => {
  console.log("DB CONNECTED SUCCESSFULLY");
  app.listen(process.env.PORT, (req, res) => {
    console.log("Server is started " + process.env.PORT || 3000);
  });
}).catch(err => {
  console.log(err);
});