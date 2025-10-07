const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");

app.use(express.json());
app.use(cookieParser());

connectDB();

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter =  require("./routes/requests");
const userRouter = require("./routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

app.listen(3000, () => {
  console.log("Server is successfully listening on port 3000...");
});