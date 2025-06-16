const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

const sendTaskUpdateNotification = async (adminEmail, taskTitle, updatedBy) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: adminEmail,
      subject: "Task Updated - Task Management System",
      html: `
        <h2>Task Update Notification</h2>
        <p>A task has been updated:</p>
        <ul>
          <li><strong>Task:</strong> ${taskTitle}</li>
          <li><strong>Updated by:</strong> ${updatedBy}</li>
          <li><strong>Time:</strong> ${new Date().toLocaleString()}</li>
        </ul>
      `,
    }

    await transporter.sendMail(mailOptions)
    console.log("Email notification sent successfully")
  } catch (error) {
    console.error("Email sending error:", error)
  }
}

module.exports = { sendTaskUpdateNotification }
