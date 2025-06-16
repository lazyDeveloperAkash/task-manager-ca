const Task = require("../models/Task")
const User = require("../models/User")
const { encrypt } = require("../utils/encryption")
const { sendTaskUpdateNotification } = require("../utils/email")

const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("createdBy", "email")
      .populate("assignedTo", "email")
      .sort({ createdAt: -1 })

    const response = encrypt({ tasks })
    res.json({ data: response })
  } catch (error) {
    const response = encrypt({ message: "Server error" })
    res.status(500).json({ data: response })
  }
}

const createTask = async (req, res) => {
  try {
    const { title, description, status, dueDate, assignedTo } = req.body

    const task = new Task({
      title,
      description,
      status,
      dueDate,
      createdBy: req.user._id,
      assignedTo,
    })

    await task.save()
    await task.populate("createdBy", "email")
    await task.populate("assignedTo", "email")

    const response = encrypt({
      message: "Task created successfully",
      task,
    })
    res.status(201).json({ data: response })
  } catch (error) {
    const response = encrypt({ message: "Server error" })
    res.status(500).json({ data: response })
  }
}

const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
    if (!task) {
      const response = encrypt({ message: "Task not found" })
      return res.status(404).json({ data: response })
    }

    // Update task
    Object.keys(req.body).forEach((key) => {
      task[key] = req.body[key]
    })

    await task.save()
    await task.populate("createdBy", "email")
    await task.populate("assignedTo", "email")

    // Send email notification to admin if updated by user
    if (req.user.role === "user") {
      const admin = await User.findOne({ role: "admin" })
      if (admin) {
        await sendTaskUpdateNotification(admin.email, task.title, req.user.email)
      }
    }

    const response = encrypt({
      message: "Task updated successfully",
      task,
    })
    res.json({ data: response })
  } catch (error) {
    const response = encrypt({ message: "Server error" })
    res.status(500).json({ data: response })
  }
}

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
    if (!task) {
      const response = encrypt({ message: "Task not found" })
      return res.status(404).json({ data: response })
    }

    await Task.findByIdAndDelete(req.params.id)

    const response = encrypt({ message: "Task deleted successfully" })
    res.json({ data: response })
  } catch (error) {
    const response = encrypt({ message: "Server error" })
    res.status(500).json({ data: response })
  }
}

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
}
