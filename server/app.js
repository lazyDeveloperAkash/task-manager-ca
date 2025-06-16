const express = require("express")
const http = require("http")
const socketIo = require("socket.io")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const connectDB = require("./config/database")
require("dotenv").config()

const app = express()
const server = http.createServer(app)
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
})

// Connect to MongoDB
connectDB()

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
)
app.use(express.json())
app.use(cookieParser())

// Routes
app.use("/api/auth", require("./routes/auth"))
app.use("/api/tasks", require("./routes/tasks"))
app.use("/api/chat", require("./routes/chat"))
app.use("/api/users", require("./routes/users"))

// Socket.io for real-time chat
io.on("connection", (socket) => {
  console.log("User connected:", socket.id)

  socket.on("join-room", (userId) => {
    socket.join(userId)
    console.log(`User ${userId} joined room`)
  })

  socket.on("send-message", (data) => {
    socket.to(data.receiverId).emit("receive-message", data)
  })

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id)
  })
})

const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
