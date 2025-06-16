const jwt = require("jsonwebtoken")
const User = require("../models/User")
const { encrypt } = require("../utils/encryption")

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "24h" })
}

const setTokenCookie = (res, token) => {
  const encryptedToken = encrypt(token)
  res.cookie("authToken", encryptedToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  })
}

const signup = async (req, res) => {
  try {
    const { email, password } = req.body

    // Check if user exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      const response = encrypt({ message: "User already exists" })
      return res.status(400).json({ data: response })
    }

    // Create user
    const user = new User({ email, password })
    await user.save()

    // Generate token and set cookie
    const token = generateToken(user._id)
    setTokenCookie(res, token)

    const response = encrypt({
      message: "User created successfully",
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    })
    res.status(201).json({ data: response })
  } catch (error) {
    const response = encrypt({ message: "Server error" })
    res.status(500).json({ data: response })
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Check user
    const user = await User.findOne({ email })
    if (!user) {
      const response = encrypt({ message: "Invalid credentials" })
      return res.status(400).json({ data: response })
    }

    // Check password
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      const response = encrypt({ message: "Invalid credentials" })
      return res.status(400).json({ data: response })
    }

    // Generate token and set cookie
    const token = generateToken(user._id)
    setTokenCookie(res, token)

    const response = encrypt({
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    })

    res.json({ data: response })
  } catch (error) {
    const response = encrypt({ message: "Server error" })
    res.status(500).json({ data: response })
  }
}

const logout = (req, res) => {
  res.clearCookie("authToken")
  const response = encrypt({ message: "Logged out successfully" })
  res.json({ data: response })
}

const getCurrentUser = async (req, res) => {
  try {
    const response = encrypt({
      user: {
        id: req.user._id,
        email: req.user.email,
        role: req.user.role,
      },
    })
    res.json({ data: response })
  } catch (error) {
    const response = encrypt({ message: "Server error" })
    res.status(500).json({ data: response })
  }
}

module.exports = {
  signup,
  login,
  logout,
  getCurrentUser,
}
