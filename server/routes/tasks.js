const express = require("express")
const Task = require("../models/Task")
const User = require("../models/User")
const { auth, adminAuth } = require("../middleware/auth")
const { encrypt, decrypt } = require("../utils/encryption")
const { sendTaskUpdateNotification } = require("../utils/email")
const taskController = require("../controllers/taskController")

const router = express.Router()

// Middleware to decrypt request body
const decryptBody = (req, res, next) => {
  if (req.body.data) {
    const decryptedData = decrypt(req.body.data)
    if (!decryptedData) {
      return res.status(400).json({ message: "Invalid request format" })
    }
    req.body = decryptedData
  }
  next()
}

// Get all tasks
router.get("/", auth, taskController.getTasks)

// Create task (Admin only)
router.post("/", auth, adminAuth, decryptBody, taskController.createTask)

// Update task
router.put("/:id", auth, decryptBody, taskController.updateTask)

// Delete task (Admin only)
router.delete("/:id", auth, adminAuth, taskController.deleteTask)

module.exports = router
