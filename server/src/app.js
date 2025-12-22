const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const cors = require("cors");
const http = require("http");
const initializeSocket = require("./utils/socket");

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
const paymentRouter = require("./routes/payment");
const chatRouter = require("./routes/chat");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", paymentRouter);
app.use("/", chatRouter);

const server = http.createServer(app);
initializeSocket(server);

server.listen(3000, () => {
  console.log("Server is successfully listening on port 3000...");
});