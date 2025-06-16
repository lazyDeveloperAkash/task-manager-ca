const jwt = require("jsonwebtoken")
const User = require("../models/User")
const { decrypt } = require("../utils/encryption")

const auth = async (req, res, next) => {
  try {
    // Get token from cookies
    const encryptedToken = req.cookies.authToken

    if (!encryptedToken) {
      return res.status(401).json({ message: "No token, authorization denied" })
    }

    // Decrypt the token
    const token = decrypt(encryptedToken)
    if (!token) {
      return res.status(401).json({ message: "Invalid token format" })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.userId).select("-password")

    if (!user) {
      return res.status(401).json({ message: "User not found" })
    }

    req.user = user
    next()
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" })
  }
}

const adminAuth = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" })
  }
  next()
}

module.exports = { auth, adminAuth }
