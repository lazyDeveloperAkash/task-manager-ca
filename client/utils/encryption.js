const CryptoJS = require("crypto-js")

const ENCRYPTION_KEY = "chetna-academy-task-encrption-key"

export const encrypt = (data) => {
  try {
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), ENCRYPTION_KEY).toString()
    return encrypted
  } catch (error) {
    console.error("Encryption error:", error)
    return null
  }
}

export const decrypt = (encryptedData) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY)
    const decrypted = bytes.toString(CryptoJS.enc.Utf8)
    return JSON.parse(decrypted)
  } catch (error) {
    console.error("Decryption error:", error)
    return null
  }
}
