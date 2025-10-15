const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const cors = require("cors");

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}))
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