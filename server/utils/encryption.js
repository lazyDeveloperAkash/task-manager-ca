const CryptoJS = require("crypto-js")

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "your-32-character-secret-key-here"

const encrypt = (data) => {
  try {
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), ENCRYPTION_KEY).toString()
    return encrypted
  } catch (error) {
    console.error("Encryption error:", error)
    return null
  }
}

const decrypt = (encryptedData) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY)
    const decrypted = bytes.toString(CryptoJS.enc.Utf8)
    return JSON.parse(decrypted)
  } catch (error) {
    console.error("Decryption error:", error)
    return null
  }
}

module.exports = { encrypt, decrypt }
