const express = require("express")
const jwt = require("jsonwebtoken")
const User = require("../models/User")
const { encrypt, decrypt } = require("../utils/encryption")
const { auth } = require("../middleware/auth")
const authController = require("../controllers/authController")

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

// Signup
router.post("/signup", decryptBody, authController.signup)

// Login
router.post("/login", decryptBody, authController.login)

// Logout
router.post("/logout", authController.logout)

// Get current user
router.get("/me", auth, authController.getCurrentUser)

module.exports = router
