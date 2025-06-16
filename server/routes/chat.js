const express = require("express")
const { auth } = require("../middleware/auth")
const { decrypt } = require("../utils/encryption")
const chatController = require("../controllers/chatController")

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

router.get("/:receiverId", auth, chatController.getMessages)
router.post("/", auth, decryptBody, chatController.sendMessage)

module.exports = router
