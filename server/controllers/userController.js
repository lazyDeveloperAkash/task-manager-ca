const User = require("../models/User")
const { encrypt } = require("../utils/encryption")

const getUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } }).select("email role")

    const response = encrypt({ users })
    res.json({ data: response })
  } catch (error) {
    const response = encrypt({ message: "Server error" })
    res.status(500).json({ data: response })
  }
}

module.exports = {
  getUsers,
}
